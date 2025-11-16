import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { convertMeterToHours, validateMeterReading, calculateTimeDuration } from '@/lib/utils';
import type { SupplyEntry } from '@/types';

export default function SupplyEntryForm() {
  const { farmers, settings, addSupplyEntry } = useData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    farmerId: '',
    date: new Date().toISOString().split('T')[0],
    billingMethod: 'meter' as 'meter' | 'time',
    startTime: '',
    stopTime: '',
    pauseDuration: 0,
    meterReadingStart: 0,
    meterReadingEnd: 0,
    rate: settings.defaultHourlyRate,
    remarks: '',
  });

  const calculated = useMemo(() => {
    let totalTimeUsed = 0;
    let totalWaterUsed = 0;

    if (formData.billingMethod === 'meter') {
      if (formData.meterReadingEnd > formData.meterReadingStart) {
        const startHours = convertMeterToHours(formData.meterReadingStart);
        const endHours = convertMeterToHours(formData.meterReadingEnd);
        totalTimeUsed = Math.max(0, endHours - startHours);
      }
    } else {
      if (formData.startTime && formData.stopTime) {
        totalTimeUsed = calculateTimeDuration(
          formData.startTime,
          formData.stopTime,
          formData.pauseDuration
        );
      }
    }

    totalWaterUsed = totalTimeUsed * (settings.waterFlowRate || 1000);

    return {
      totalTimeUsed: parseFloat(totalTimeUsed.toFixed(2)),
      totalWaterUsed: parseFloat(totalWaterUsed.toFixed(2)),
      amount: parseFloat((totalTimeUsed * formData.rate).toFixed(2)),
    };
  }, [formData, settings.waterFlowRate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.farmerId) {
      toast.error('Please select a farmer');
      return;
    }

    if (formData.billingMethod === 'meter') {
      if (!validateMeterReading(formData.meterReadingStart) || !validateMeterReading(formData.meterReadingEnd)) {
        toast.error('Invalid meter reading format. Minutes must be 00-59');
        return;
      }
      if (formData.meterReadingEnd <= formData.meterReadingStart) {
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
      toast.error('Total time used must be greater than zero');
      return;
    }

    const entry: Omit<SupplyEntry, 'id' | 'createdAt' | 'updatedAt'> = {
      farmerId: formData.farmerId,
      date: formData.date,
      billingMethod: formData.billingMethod,
      startTime: formData.billingMethod === 'time' ? formData.startTime : '',
      stopTime: formData.billingMethod === 'time' ? formData.stopTime : '',
      pauseDuration: formData.billingMethod === 'time' ? formData.pauseDuration : 0,
      meterReadingStart: formData.billingMethod === 'meter' ? formData.meterReadingStart : 0,
      meterReadingEnd: formData.billingMethod === 'meter' ? formData.meterReadingEnd : 0,
      totalTimeUsed: calculated.totalTimeUsed,
      totalWaterUsed: calculated.totalWaterUsed,
      rate: formData.rate,
      amount: calculated.amount,
      remarks: formData.remarks,
    };

    addSupplyEntry(entry);
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">New Supply Entry</h1>
        <p className="text-muted-foreground">Record a new water supply session</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Supply Details</CardTitle>
            <CardDescription>Fill in the supply session information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Farmer Selection */}
            <div className="space-y-2">
              <Label htmlFor="farmer">Farmer *</Label>
              <Select
                value={formData.farmerId}
                onValueChange={(value) => {
                  const farmer = farmers.find(f => f.id === value);
                  setFormData({
                    ...formData,
                    farmerId: value,
                    rate: farmer?.defaultRate || settings.defaultHourlyRate,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a farmer" />
                </SelectTrigger>
                <SelectContent>
                  {farmers.map((farmer) => (
                    <SelectItem key={farmer.id} value={farmer.id}>
                      {farmer.name} - {farmer.mobile}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            {/* Billing Method Toggle */}
            <div className="space-y-2">
              <Label>Billing Method</Label>
              <Tabs value={formData.billingMethod} onValueChange={(value) => setFormData({ ...formData, billingMethod: value as 'meter' | 'time' })}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="meter">Meter Reading</TabsTrigger>
                  <TabsTrigger value="time">Time-Based</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Meter Reading Fields */}
            {formData.billingMethod === 'meter' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meterStart">Meter Reading Start *</Label>
                  <Input
                    type="number"
                    id="meterStart"
                    step="0.01"
                    placeholder="e.g., 5.30 (5h 30m)"
                    value={formData.meterReadingStart || ''}
                    onChange={(e) => setFormData({ ...formData, meterReadingStart: parseFloat(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-muted-foreground">Format: h.mm (e.g., 5.30 = 5 hours 30 minutes)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meterEnd">Meter Reading End *</Label>
                  <Input
                    type="number"
                    id="meterEnd"
                    step="0.01"
                    placeholder="e.g., 10.45 (10h 45m)"
                    value={formData.meterReadingEnd || ''}
                    onChange={(e) => setFormData({ ...formData, meterReadingEnd: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
            )}

            {/* Time-Based Fields */}
            {formData.billingMethod === 'time' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      type="time"
                      id="startTime"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stopTime">Stop Time *</Label>
                    <Input
                      type="time"
                      id="stopTime"
                      value={formData.stopTime}
                      onChange={(e) => setFormData({ ...formData, stopTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pause">Pause Duration (hours)</Label>
                  <Input
                    type="number"
                    id="pause"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.pauseDuration || ''}
                    onChange={(e) => setFormData({ ...formData, pauseDuration: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
            )}

            {/* Rate */}
            <div className="space-y-2">
              <Label htmlFor="rate">Rate (₹/hour) *</Label>
              <Input
                type="number"
                id="rate"
                step="0.01"
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) || 0 })}
              />
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Optional notes about this supply session"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              />
            </div>

            {/* Summary */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h3 className="font-semibold">Session Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Method:</span>
                <span className="font-medium capitalize">{formData.billingMethod}</span>
                
                <span className="text-muted-foreground">Total Time:</span>
                <span className="font-medium">{calculated.totalTimeUsed} hours</span>
                
                <span className="text-muted-foreground">Water Used:</span>
                <span className="font-medium">{calculated.totalWaterUsed.toLocaleString()} L</span>
                
                <span className="text-muted-foreground">Rate:</span>
                <span className="font-medium">₹{formData.rate}/hour</span>
              </div>
              <div className="pt-2 border-t border-border flex justify-between items-center">
                <span className="font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold text-primary">₹{calculated.amount.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" className="w-full sm:w-auto">
                Add Supply Entry
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/')} className="w-full sm:w-auto">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
