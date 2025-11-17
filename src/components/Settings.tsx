import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Settings as SettingsIcon, Save, Sparkles, DollarSign, Info, Download, Upload, Database } from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings } = useData();

  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.businessName.trim()) {
      toast.error('Business name is required');
      return;
    }

    if (formData.defaultRate <= 0) {
      toast.error('Default rate must be greater than 0');
      return;
    }

    updateSettings(formData);
    toast.success('Settings saved successfully');
  };

  const handleExportData = () => {
    try {
      const allData = {
        farmers: localStorage.getItem('farmers'),
        supplyEntries: localStorage.getItem('supplyEntries'),
        payments: localStorage.getItem('payments'),
        settings: localStorage.getItem('settings'),
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `water-supply-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
      console.error(error);
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        if (data.farmers) localStorage.setItem('farmers', data.farmers);
        if (data.supplyEntries) localStorage.setItem('supplyEntries', data.supplyEntries);
        if (data.payments) localStorage.setItem('payments', data.payments);
        if (data.settings) localStorage.setItem('settings', data.settings);

        toast.success('Data imported successfully! Reloading page...');
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        toast.error('Invalid backup file');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-primary rounded-xl shadow-lg">
            <SettingsIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 mt-1">Configure your system preferences</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Business Information */}
        <Card className="shadow-xl border-2 animate-slide-up">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent border-b-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-xl">Business Information</CardTitle>
            </div>
            <CardDescription>Update your business details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="Enter business name"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="Enter contact number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter business address"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Billing Settings */}
        <Card className="mt-6 shadow-xl border-2 animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <CardTitle className="text-xl">Billing Settings</CardTitle>
            </div>
            <CardDescription>Configure default billing parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="defaultRate">Default Rate (₹/hour) *</Label>
                <Input
                  id="defaultRate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.defaultRate}
                  onChange={(e) => setFormData({ ...formData, defaultRate: parseFloat(e.target.value) })}
                  required
                />
                <p className="text-sm text-gray-500">This rate will be used for new farmers</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="waterFlowRate">Water Flow Rate (L/hour)</Label>
                <Input
                  id="waterFlowRate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.waterFlowRate || ''}
                  onChange={(e) => setFormData({ ...formData, waterFlowRate: parseFloat(e.target.value) || undefined })}
                  placeholder="1000"
                />
                <p className="text-sm text-gray-500">For water usage calculations</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  placeholder="INR"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Input
                  id="dateFormat"
                  value={formData.dateFormat}
                  onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
                  placeholder="dd/MM/yyyy"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <Button type="submit" size="lg" className="shadow-lg hover:shadow-xl transition-all">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </form>

      {/* Data Management */}
      <Card className="shadow-xl border-2 animate-scale-in">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent border-b-2">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-xl">Data Management</CardTitle>
          </div>
          <CardDescription>Backup and restore your data</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-medium mb-2">⚠️ Important</p>
              <p className="text-xs text-yellow-700">
                Your data is stored locally in your browser. Clearing browser data will delete all records. 
                It's recommended to export backups regularly.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Button
                onClick={handleExportData}
                variant="outline"
                className="h-auto py-4 flex-col items-start shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-2 mb-2 w-full">
                  <Download className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">Export Data</span>
                </div>
                <span className="text-xs text-gray-500 text-left">
                  Download all data as JSON backup file
                </span>
              </Button>

              <div>
                <input
                  type="file"
                  accept="application/json"
                  onChange={handleImportData}
                  className="hidden"
                  id="import-data"
                />
                <Button
                  onClick={() => document.getElementById('import-data')?.click()}
                  variant="outline"
                  className="h-auto py-4 flex-col items-start w-full shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-2 mb-2 w-full">
                    <Upload className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">Import Data</span>
                  </div>
                  <span className="text-xs text-gray-500 text-left">
                    Restore data from backup file
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card className="shadow-lg border-2">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent border-b-2">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-xl">About</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Application:</strong> Water Supply Management System</p>
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Storage:</strong> LocalStorage (Browser)</p>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
              <p className="text-xs text-blue-700">
                💡 Tip: Your data is stored locally in your browser. Export reports regularly as backup.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
