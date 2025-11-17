import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { SupplyFormData } from '@/types';
import { convertMeterToHours, calculateTimeDuration, validateMeterReading, getTodayDate } from '@/utils/calculations';
import { Droplets, Calculator, Clock, Gauge } from 'lucide-react';

export default function SupplyEntryForm() {
  const { farmers, addSupplyEntry, settings } = useData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SupplyFormData>({
    farmerId: '',
    date: getTodayDate(),
    billingMethod: 'meter',
    meterReadingStart: '',
    meterReadingEnd: '',
    startTime: '',
    stopTime: '',
    pauseDuration: '0',
    rate: settings.defaultRate.toString(),
    remarks: '',
  });

  // Auto-calculate total time and amount
  const calculated = useMemo(() => {
    let totalTimeUsed = 0;

    if (formData.billingMethod === 'meter' && formData.meterReadingStart && formData.meterReadingEnd) {
      const start = parseFloat(formData.meterReadingStart);
      const end = parseFloat(formData.meterReadingEnd);
      if (!isNaN(start) && !isNaN(end) && end > start) {
        const startHours = convertMeterToHours(start);
        const endHours = convertMeterToHours(end);
        totalTimeUsed = endHours - startHours;
      }
    } else if (formData.billingMethod === 'time' && formData.startTime && formData.stopTime) {
      const pause = parseFloat(formData.pauseDuration) || 0;
      totalTimeUsed = calculateTimeDuration(formData.startTime, formData.stopTime, pause);
    }

    const rate = parseFloat(formData.rate) || 0;
    const amount = totalTimeUsed * rate;
    const waterUsed = totalTimeUsed * (settings.waterFlowRate || 1000);

    return { totalTimeUsed, amount, waterUsed };
  }, [formData, settings.waterFlowRate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.farmerId) {
      toast.error('Please select a farmer');
      return;
    }

    if (formData.billingMethod === 'meter') {
      const start = parseFloat(formData.meterReadingStart);
      const end = parseFloat(formData.meterReadingEnd);
      
      if (!formData.meterReadingStart || !formData.meterReadingEnd) {
        toast.error('Please enter both meter readings');
        return;
      }

      if (!validateMeterReading(start) || !validateMeterReading(end)) {
        toast.error('Invalid meter reading format. Minutes must be 00-59');
        return;
      }

      if (end <= start) {
        toast.error('End reading must be greater than start reading');
        return;
      }
    } else {
      if (!formData.startTime || !formData.stopTime) {
        toast.error('Please enter both start and stop times');
        return;
      }
    }

    if (calculated.totalTimeUsed <= 0) {
      toast.error('Total time must be greater than 0');
      return;
    }

    if (parseFloat(formData.rate) <= 0) {
      toast.error('Rate must be greater than 0');
      return;
    }

    // Create supply entry
    addSupplyEntry({
      farmerId: formData.farmerId,
      date: formData.date,
      billingMethod: formData.billingMethod,
      meterReadingStart: formData.billingMethod === 'meter' ? parseFloat(formData.meterReadingStart) : undefined,
      meterReadingEnd: formData.billingMethod === 'meter' ? parseFloat(formData.meterReadingEnd) : undefined,
      startTime: formData.billingMethod === 'time' ? formData.startTime : undefined,
      stopTime: formData.billingMethod === 'time' ? formData.stopTime : undefined,
      pauseDuration: formData.billingMethod === 'time' ? parseFloat(formData.pauseDuration) : undefined,
      totalTimeUsed: calculated.totalTimeUsed,
      waterUsed: calculated.waterUsed,
      rate: parseFloat(formData.rate),
      amount: calculated.amount,
      remarks: formData.remarks || undefined,
    });

    toast.success('Supply entry added successfully');
    navigate('/');
  };

  const selectedFarmer = farmers.find(f => f.id === formData.farmerId);

  // Auto-fill rate when farmer is selected
  const handleFarmerChange = (farmerId: string) => {
    const farmer = farmers.find(f => f.id === farmerId);
    setFormData(prev => ({
      ...prev,
      farmerId,
      rate: farmer ? farmer.defaultRate.toString() : settings.defaultRate.toString(),
    }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-primary rounded-xl shadow-lg">
            <Droplets className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">New Supply Entry</h1>
            <p className="text-gray-500 mt-1">Record a new water supply session</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="shadow-xl animate-slide-up border-2">
              <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-transparent border-b-2">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calculator className="h-6 w-6 text-blue-600" />
                  Supply Details
                </CardTitle>
                <CardDescription>Fill in the water supply information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
            {/* Farmer Selection */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="farmer">Farmer *</Label>
                <Select value={formData.farmerId} onValueChange={handleFarmerChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select farmer" />
                  </SelectTrigger>
                  <SelectContent>
                    {farmers.map(farmer => (
                      <SelectItem key={farmer.id} value={farmer.id}>
                        {farmer.name} - {farmer.mobile}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Billing Method */}
            <div className="space-y-2">
              <Label>Billing Method *</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.billingMethod === 'meter' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, billingMethod: 'meter' })}
                >
                  Meter Reading
                </Button>
                <Button
                  type="button"
                  variant={formData.billingMethod === 'time' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, billingMethod: 'time' })}
                >
                  Time-Based
                </Button>
              </div>
            </div>

            {/* Meter-Based Fields */}
            {formData.billingMethod === 'meter' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="meterStart">Meter Reading Start (h.mm) *</Label>
                  <Input
                    id="meterStart"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 5.30 (5h 30m)"
                    value={formData.meterReadingStart}
                    onChange={(e) => setFormData({ ...formData, meterReadingStart: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meterEnd">Meter Reading End (h.mm) *</Label>
                  <Input
                    id="meterEnd"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 10.45 (10h 45m)"
                    value={formData.meterReadingEnd}
                    onChange={(e) => setFormData({ ...formData, meterReadingEnd: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Time-Based Fields */}
            {formData.billingMethod === 'time' && (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stopTime">Stop Time *</Label>
                  <Input
                    id="stopTime"
                    type="time"
                    value={formData.stopTime}
                    onChange={(e) => setFormData({ ...formData, stopTime: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pause">Pause Duration (hours)</Label>
                  <Input
                    id="pause"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="0"
                    value={formData.pauseDuration}
                    onChange={(e) => setFormData({ ...formData, pauseDuration: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Rate and Amount */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rate">Rate (₹/hour) *</Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input
                  value={calculated.amount.toFixed(2)}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Optional notes..."
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                rows={3}
              />
            </div>

            {/* Summary Panel */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold mb-3">Session Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Method</p>
                  <p className="font-semibold">{formData.billingMethod === 'meter' ? 'Meter' : 'Time'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Hours</p>
                  <p className="font-semibold">{calculated.totalTimeUsed.toFixed(2)} h</p>
                </div>
                <div>
                  <p className="text-gray-600">Water Used</p>
                  <p className="font-semibold">{calculated.waterUsed.toFixed(0)} L</p>
                </div>
                <div>
                  <p className="text-gray-600">Amount</p>
                  <p className="font-semibold text-primary text-lg">₹{calculated.amount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Submit Supply Entry
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/')}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>

    {/* Live Preview Panel */}
    <div className="lg:col-span-1">
      <Card className="shadow-xl sticky top-6 border-2 animate-scale-in">
        <CardHeader className="bg-gradient-to-br from-green-50 to-transparent border-b-2">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            Live Preview
          </CardTitle>
          <CardDescription>Real-time calculations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {/* Selected Farmer */}
          {selectedFarmer && (
            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <p className="text-xs text-gray-600 mb-1">Farmer</p>
              <p className="font-bold text-lg">{selectedFarmer.name}</p>
              <p className="text-sm text-gray-600">{selectedFarmer.mobile}</p>
            </div>
          )}

          {/* Billing Method */}
          <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
            <p className="text-xs text-gray-600 mb-1">Billing Method</p>
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-purple-600" />
              <p className="font-bold">
                {formData.billingMethod === 'meter' ? 'Meter Reading' : 'Time-Based'}
              </p>
            </div>
          </div>

          {/* Calculations */}
          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-2 border-orange-200">
              <p className="text-xs text-gray-600 mb-1">Total Hours</p>
              <p className="font-bold text-2xl text-orange-700">
                {calculated.totalTimeUsed.toFixed(2)} <span className="text-sm">hrs</span>
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border-2 border-cyan-200">
              <p className="text-xs text-gray-600 mb-1">Water Used</p>
              <p className="font-bold text-2xl text-cyan-700">
                {calculated.waterUsed.toFixed(0)} <span className="text-sm">L</span>
              </p>
            </div>

            <div className="p-4 bg-gradient-primary rounded-lg shadow-lg">
              <p className="text-xs text-white/80 mb-1">Total Amount</p>
              <p className="font-bold text-3xl text-white">
                ₹{calculated.amount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Rate Info */}
          <div className="p-3 bg-gray-100 rounded-lg text-sm">
            <p className="text-gray-600">Rate: <span className="font-semibold">₹{formData.rate}/hour</span></p>
            <p className="text-gray-600 mt-1">Date: <span className="font-semibold">{formData.date || 'Not set'}</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</div>
  );
}
