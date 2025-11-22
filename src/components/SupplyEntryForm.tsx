import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { Clock, Gauge, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface SupplyEntryFormProps {
  onSuccess: () => void;
}

type BillingMethod = 'meter' | 'time';

export function SupplyEntryForm({ onSuccess }: SupplyEntryFormProps) {
  const { farmers, addSupplyEntry, settings } = useData();
  
  const [billingMethod, setBillingMethod] = useState<BillingMethod>('meter');
  const [formData, setFormData] = useState({
    farmerId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    stopTime: '',
    pauseDuration: 0,
    meterReadingStart: '',
    meterReadingEnd: '',
    rate: settings?.defaultHourlyRate || 100,
    remarks: '',
  });

  /**
   * Converts meter reading in h.mm format to decimal hours
   * @param reading - Meter reading (e.g., "5.30" for 5 hours 30 minutes)
   * @returns Hours in decimal format (e.g., 5.5)
   */
  const convertMeterToHours = (reading: string): number => {
    if (!reading) return 0;
    const value = parseFloat(reading);
    if (isNaN(value)) return 0;
    
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 100);
    return hours + (minutes / 60);
  };

  /**
   * Validates meter reading format (minutes must be 0-59)
   */
  const validateMeterReading = (reading: string): boolean => {
    if (!reading) return true; // Empty is valid (will be 0)
    const value = parseFloat(reading);
    if (isNaN(value) || value < 0) return false;
    
    const minutes = Math.round((value - Math.floor(value)) * 100);
    return minutes <= 59;
  };

  // Auto-calculate totals when relevant fields change
  const calculated = useMemo(() => {
    let totalTimeUsed = 0;
    let totalWaterUsed = 0;

    if (billingMethod === 'meter') {
      // Meter-based calculation
      if (formData.meterReadingStart && formData.meterReadingEnd) {
        const startHours = convertMeterToHours(formData.meterReadingStart);
        const endHours = convertMeterToHours(formData.meterReadingEnd);
        totalTimeUsed = Math.max(0, endHours - startHours);
      }
    } else {
      // Time-based calculation
      if (formData.startTime && formData.stopTime) {
        const start = new Date(`1970-01-01T${formData.startTime}:00`);
        let stop = new Date(`1970-01-01T${formData.stopTime}:00`);
        
        // Handle overnight shifts
        if (stop < start) {
          stop = new Date(`1970-01-02T${formData.stopTime}:00`);
        }
        
        const diffMs = stop.getTime() - start.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        totalTimeUsed = Math.max(0, diffHours - formData.pauseDuration);
      }
    }
    
    // Calculate water based on time (assuming 1000 L/hour flow rate)
    totalWaterUsed = totalTimeUsed * 1000;
    
    return {
      totalTimeUsed: parseFloat(totalTimeUsed.toFixed(2)),
      totalWaterUsed: parseFloat(totalWaterUsed.toFixed(2)),
      amount: parseFloat((totalTimeUsed * formData.rate).toFixed(2))
    };
  }, [billingMethod, formData, convertMeterToHours]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.farmerId) {
      toast.error('Please select a farmer');
      return;
    }

    if (billingMethod === 'meter') {
      if (!formData.meterReadingStart || !formData.meterReadingEnd) {
        toast.error('Please enter both meter readings');
        return;
      }

      if (!validateMeterReading(formData.meterReadingStart) || !validateMeterReading(formData.meterReadingEnd)) {
        toast.error('Invalid meter reading format. Minutes must be 00-59 (e.g., 5.30 for 5h 30m)');
        return;
      }

      const startHours = convertMeterToHours(formData.meterReadingStart);
      const endHours = convertMeterToHours(formData.meterReadingEnd);
      
      if (endHours <= startHours) {
        toast.error('End reading must be greater than start reading');
        return;
      }
    } else {
      if (!formData.startTime || !formData.stopTime) {
        toast.error('Please enter start and stop times');
        return;
      }
    }

    if (calculated.totalTimeUsed <= 0) {
      toast.error('Total time used must be greater than 0');
      return;
    }

    if (formData.rate <= 0) {
      toast.error('Rate must be greater than 0');
      return;
    }

    // Submit the supply entry
    addSupplyEntry({
      farmerId: formData.farmerId,
      date: formData.date,
      billingMethod,
      startTime: formData.startTime || undefined,
      stopTime: formData.stopTime || undefined,
      pauseDuration: billingMethod === 'time' ? formData.pauseDuration : 0,
      meterReadingStart: billingMethod === 'meter' ? parseFloat(formData.meterReadingStart) : 0,
      meterReadingEnd: billingMethod === 'meter' ? parseFloat(formData.meterReadingEnd) : 0,
      totalWaterUsed: calculated.totalWaterUsed,
      totalTimeUsed: calculated.totalTimeUsed,
      rate: formData.rate,
      amount: calculated.amount,
      remarks: formData.remarks,
    });

    toast.success('Supply entry saved successfully');
    onSuccess();
  };

  const activeFarmers = farmers.filter(f => f.isActive !== false);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>New Water Supply Session</CardTitle>
        <CardDescription>Record a new water supply entry for a farmer</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section A: Farmer Selection */}
          <div className="space-y-2">
            <Label htmlFor="farmer">Farmer Name / Mobile <span className="text-destructive">*</span></Label>
            <Select
              value={formData.farmerId}
              onValueChange={(value) => {
                const farmer = farmers.find(f => f.id === value);
                setFormData({ 
                  ...formData, 
                  farmerId: value,
                  rate: farmer?.defaultRate || settings?.defaultHourlyRate || 100
                });
              }}
            >
              <SelectTrigger id="farmer">
                <SelectValue placeholder="Select a farmer" />
              </SelectTrigger>
              <SelectContent>
                {activeFarmers.length === 0 ? (
                  <SelectItem value="none" disabled>No active farmers found</SelectItem>
                ) : (
                  activeFarmers.map((farmer) => (
                    <SelectItem key={farmer.id} value={farmer.id}>
                      {farmer.name} • {farmer.mobile}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Section B: Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">Date <span className="text-destructive">*</span></Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          {/* Section C: Billing Method Toggle */}
          <div className="space-y-3">
            <Label>Billing Method <span className="text-destructive">*</span></Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={billingMethod === 'meter' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setBillingMethod('meter')}
              >
                <Gauge className="mr-2 h-4 w-4" />
                Meter Reading
              </Button>
              <Button
                type="button"
                variant={billingMethod === 'time' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setBillingMethod('time')}
              >
                <Clock className="mr-2 h-4 w-4" />
                Time-Based
              </Button>
            </div>
          </div>

          {/* Section D: Meter-Based Billing Fields */}
          {billingMethod === 'meter' && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Enter meter readings in h.mm format (e.g., 5.30 = 5 hours 30 minutes)
                </AlertDescription>
              </Alert>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="meterStart">
                    Meter Reading Start <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="meterStart"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 5.30 (5h 30m)"
                    value={formData.meterReadingStart}
                    onChange={(e) => setFormData({ ...formData, meterReadingStart: e.target.value })}
                    required={billingMethod === 'meter'}
                  />
                  {formData.meterReadingStart && (
                    <p className="text-xs text-muted-foreground">
                      = {convertMeterToHours(formData.meterReadingStart).toFixed(2)} hours
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meterEnd">
                    Meter Reading End <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="meterEnd"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 10.45 (10h 45m)"
                    value={formData.meterReadingEnd}
                    onChange={(e) => setFormData({ ...formData, meterReadingEnd: e.target.value })}
                    required={billingMethod === 'meter'}
                  />
                  {formData.meterReadingEnd && (
                    <p className="text-xs text-muted-foreground">
                      = {convertMeterToHours(formData.meterReadingEnd).toFixed(2)} hours
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Section E: Time-Based Billing Fields */}
          {billingMethod === 'time' && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startTime">
                    Start Time <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required={billingMethod === 'time'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stopTime">
                    Stop Time <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="stopTime"
                    type="time"
                    value={formData.stopTime}
                    onChange={(e) => setFormData({ ...formData, stopTime: e.target.value })}
                    required={billingMethod === 'time'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pauseDuration">Pause Duration (hours)</Label>
                <Input
                  id="pauseDuration"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.pauseDuration}
                  onChange={(e) => setFormData({ ...formData, pauseDuration: parseFloat(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground">
                  Time when supply was paused/stopped (optional)
                </p>
              </div>
            </div>
          )}

          {/* Section F: Billing Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rate">
                Rate (₹/hour) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                min="0"
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input
                value={`₹${calculated.amount.toFixed(2)}`}
                disabled
                className="bg-muted font-semibold"
              />
            </div>
          </div>

          {/* Section G: Additional Information */}
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks / Notes</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Optional notes about this supply session"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.remarks.length} / 500 characters
            </p>
          </div>

          {/* Section H: Session Summary Panel */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Session Summary
            </h3>
            <div className="grid gap-3">
              <div className="flex justify-between items-center py-2 border-b border-primary/10">
                <span className="text-muted-foreground">Billing Method:</span>
                <span className="font-medium capitalize">{billingMethod === 'meter' ? 'Meter Reading' : 'Time-Based'}</span>
              </div>
              
              {billingMethod === 'meter' && formData.meterReadingStart && formData.meterReadingEnd && (
                <div className="flex justify-between items-center py-2 border-b border-primary/10">
                  <span className="text-muted-foreground">Meter Range:</span>
                  <span className="font-medium">
                    {formData.meterReadingStart} → {formData.meterReadingEnd}
                  </span>
                </div>
              )}
              
              {billingMethod === 'time' && formData.startTime && formData.stopTime && (
                <div className="flex justify-between items-center py-2 border-b border-primary/10">
                  <span className="text-muted-foreground">Time Range:</span>
                  <span className="font-medium">
                    {formData.startTime} → {formData.stopTime}
                    {formData.pauseDuration > 0 && ` (pause: ${formData.pauseDuration}h)`}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-2 border-b border-primary/10">
                <span className="text-muted-foreground">Total Time:</span>
                <span className="font-medium">{calculated.totalTimeUsed.toFixed(2)} hours</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-primary/10">
                <span className="text-muted-foreground">Rate per Hour:</span>
                <span className="font-medium">₹{formData.rate.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center pt-3 mt-2 border-t-2 border-primary/30">
                <span className="text-lg font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold text-primary">₹{calculated.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" size="lg" className="flex-1">
              Save Supply Entry
            </Button>
            <Button type="button" size="lg" variant="outline" onClick={onSuccess}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}