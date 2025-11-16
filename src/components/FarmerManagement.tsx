import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Eye, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, getBalanceColor, getBalanceStatus } from '@/lib/utils';
import type { Farmer } from '@/types';

export default function FarmerManagement() {
  const { farmers, settings, addFarmer, updateFarmer, deleteFarmer } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState<Farmer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    farmLocation: '',
    defaultRate: settings.defaultHourlyRate,
  });

  const filteredFarmers = farmers.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.mobile.includes(searchTerm) ||
    f.farmLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDialog = (farmer?: Farmer) => {
    if (farmer) {
      setEditingFarmer(farmer);
      setFormData({
        name: farmer.name,
        mobile: farmer.mobile,
        farmLocation: farmer.farmLocation,
        defaultRate: farmer.defaultRate,
      });
    } else {
      setEditingFarmer(null);
      setFormData({
        name: '',
        mobile: '',
        farmLocation: '',
        defaultRate: settings.defaultHourlyRate,
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter farmer name');
      return;
    }

    if (!formData.mobile.trim() || formData.mobile.length < 10) {
      toast.error('Please enter a valid mobile number');
      return;
    }

    if (editingFarmer) {
      updateFarmer(editingFarmer.id, formData);
    } else {
      addFarmer(formData);
    }

    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Farmer Management</h1>
          <p className="text-muted-foreground">Manage farmer accounts and profiles</p>
        </div>
        <Button onClick={() => openDialog()} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Farmer
        </Button>
      </div>

      {/* Farmers List Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>All Farmers ({farmers.length})</CardTitle>
              <CardDescription>View and manage all registered farmers</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFarmers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {searchTerm ? 'No farmers found matching your search.' : 'No farmers yet. Click "Add Farmer" to add one.'}
            </p>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Rate (₹/hr)</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFarmers.map((farmer) => (
                      <TableRow key={farmer.id}>
                        <TableCell className="font-medium">{farmer.name}</TableCell>
                        <TableCell>{farmer.mobile}</TableCell>
                        <TableCell>{farmer.farmLocation || '-'}</TableCell>
                        <TableCell>₹{farmer.defaultRate}</TableCell>
                        <TableCell>
                          <span className={getBalanceColor(farmer.balance)}>
                            {formatCurrency(Math.abs(farmer.balance))}
                          </span>
                          <Badge variant={farmer.balance < 0 ? 'destructive' : farmer.balance > 0 ? 'success' : 'secondary'} className="ml-2">
                            {getBalanceStatus(farmer.balance)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="ghost" onClick={() => navigate(`/farmers/${farmer.id}`)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => openDialog(farmer)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => {
                              if (confirm('Are you sure? This will delete all supply entries and payments for this farmer.')) {
                                deleteFarmer(farmer.id);
                              }
                            }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredFarmers.map((farmer) => (
                  <Card key={farmer.id}>
                    <CardContent className="pt-6 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{farmer.name}</h3>
                          <p className="text-sm text-muted-foreground">{farmer.mobile}</p>
                        </div>
                        <Badge variant={farmer.balance < 0 ? 'destructive' : farmer.balance > 0 ? 'success' : 'secondary'}>
                          {getBalanceStatus(farmer.balance)}
                        </Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <p><span className="text-muted-foreground">Location:</span> {farmer.farmLocation || '-'}</p>
                        <p><span className="text-muted-foreground">Rate:</span> ₹{farmer.defaultRate}/hr</p>
                        <p>
                          <span className="text-muted-foreground">Balance:</span>{' '}
                          <span className={getBalanceColor(farmer.balance)}>{formatCurrency(Math.abs(farmer.balance))}</span>
                        </p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/farmers/${farmer.id}`)} className="flex-1">
                          <Eye className="h-3 w-3 mr-1" /> View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openDialog(farmer)} className="flex-1">
                          <Pencil className="h-3 w-3 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => {
                          if (confirm('Delete this farmer?')) deleteFarmer(farmer.id);
                        }} className="flex-1">
                          <Trash2 className="h-3 w-3 mr-1" /> Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingFarmer ? 'Edit Farmer' : 'Add New Farmer'}</DialogTitle>
              <DialogDescription>
                {editingFarmer ? 'Update farmer information' : 'Enter farmer details to add to the system'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter farmer's full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile *</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="Enter mobile number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Farm Location</Label>
                <Input
                  id="location"
                  value={formData.farmLocation}
                  onChange={(e) => setFormData({ ...formData, farmLocation: e.target.value })}
                  placeholder="Enter farm location or address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Default Rate (₹/hour) *</Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.01"
                  value={formData.defaultRate}
                  onChange={(e) => setFormData({ ...formData, defaultRate: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingFarmer ? 'Update Farmer' : 'Add Farmer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
