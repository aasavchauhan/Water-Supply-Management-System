import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { Settings as SettingsIcon, Download, Upload } from 'lucide-react';
import { db } from '../services/database';

export function Settings() {
  const { settings, updateSettings, farmers, supplyEntries, payments } = useData();
  
  const [formData, setFormData] = useState(settings || {
    businessName: '',
    businessAddress: '',
    defaultHourlyRate: 100,
    currency: 'INR',
    currencySymbol: '₹',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    toast.success('Settings updated successfully');
  };

  const handleBackup = () => {
    const data = {
      farmers,
      supplyEntries,
      payments,
      settings,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `water-supply-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Backup downloaded successfully');
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        if (confirm('This will replace all existing data. Are you sure you want to restore from this backup?')) {
          // Save to IndexedDB
          await db.saveFarmers(data.farmers || []);
          await db.saveSupplyEntries(data.supplyEntries || []);
          await db.savePayments(data.payments || []);
          await db.saveSettings(data.settings || settings);
          
          toast.success('Backup restored successfully. Reloading page...');
          setTimeout(() => window.location.reload(), 1000);
        }
      } catch (error) {
        toast.error('Invalid backup file');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1>Settings</h1>
        <p className="text-muted-foreground">
          Configure system settings and preferences
        </p>
      </div>

      {/* Business Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessAddress">Business Address</Label>
              <Textarea
                id="businessAddress"
                value={formData.businessAddress}
                onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                placeholder="Enter your business address"
                rows={3}
              />
            </div>

            <Button type="submit">
              Save Business Information
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Rate Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Default Rate Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultRate">Default Hourly Rate (₹) *</Label>
              <Input
                id="defaultRate"
                type="number"
                min="0"
                step="0.01"
                value={formData.defaultHourlyRate}
                onChange={(e) => setFormData({ ...formData, defaultHourlyRate: Number(e.target.value) })}
                required
              />
              <p className="text-sm text-muted-foreground">
                This rate will be used as default for new farmers
              </p>
            </div>

            <div className="space-y-2">
              <Label>Half-hour Rate</Label>
              <Input
                value={`₹${(formData.defaultHourlyRate / 2).toFixed(2)}`}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                Automatically calculated as half of hourly rate
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rounding">Time Rounding (minutes)</Label>
              <Input
                id="rounding"
                type="number"
                min="1"
                max="60"
                value={formData.timeRoundingMinutes}
                onChange={(e) => setFormData({ ...formData, timeRoundingMinutes: Number(e.target.value) })}
              />
              <p className="text-sm text-muted-foreground">
                Common values: 15 or 30 minutes
              </p>
            </div>

            <Button type="submit">
              Save Rate Settings
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Backup & Restore</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Backup your data regularly to prevent data loss. You can restore data from a previously saved backup.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleBackup} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Backup
              </Button>

              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestore}
                  className="hidden"
                  id="restore-file"
                />
                <Button variant="outline" onClick={() => document.getElementById('restore-file')?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Restore from Backup
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="mb-2">Current Data Summary</h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Farmers:</span>
                <span>{farmers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Supply Sessions:</span>
                <span>{supplyEntries.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Records:</span>
                <span>{payments.length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Future Features */}
      <Card>
        <CardHeader>
          <CardTitle>Future Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <SettingsIcon className="h-4 w-4 mt-0.5" />
              <div>
                <p>SMS/WhatsApp Notifications</p>
                <p className="text-xs">Send automated notifications to farmers</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <SettingsIcon className="h-4 w-4 mt-0.5" />
              <div>
                <p>Smart Meter Integration</p>
                <p className="text-xs">Connect with IoT water meters for automatic readings</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <SettingsIcon className="h-4 w-4 mt-0.5" />
              <div>
                <p>Mobile App</p>
                <p className="text-xs">Record supply sessions from your mobile device</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}