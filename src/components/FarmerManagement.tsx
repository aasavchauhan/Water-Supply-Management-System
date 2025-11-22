import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Edit, Trash2, Eye, Receipt } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Badge } from './ui/badge';
import { FarmerReceipt } from './FarmerReceipt';

interface FarmerManagementProps {
  onViewProfile: (farmerId: string) => void;
}

export function FarmerManagement({ onViewProfile }: FarmerManagementProps) {
  const { farmers, addFarmer, updateFarmer, deleteFarmer, settings } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFarmerForReceipt, setSelectedFarmerForReceipt] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    farmLocation: '',
    defaultRate: settings?.defaultHourlyRate || 100,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      mobile: '',
      farmLocation: '',
      defaultRate: settings?.defaultHourlyRate || 100,
    });
    setEditingFarmer(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingFarmer) {
      updateFarmer(editingFarmer, formData);
      toast.success('Farmer updated successfully');
    } else {
      addFarmer({ ...formData, balance: 0 });
      toast.success('Farmer added successfully');
    }

    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = (farmer: any) => {
    setFormData({
      name: farmer.name,
      mobile: farmer.mobile,
      farmLocation: farmer.farmLocation,
      defaultRate: farmer.defaultRate,
    });
    setEditingFarmer(farmer.id);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this farmer? This action cannot be undone.')) {
      deleteFarmer(id);
      toast.success('Farmer deleted successfully');
    }
  };

  const filteredFarmers = farmers.filter(farmer =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.mobile.includes(searchTerm) ||
    farmer.farmLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>Farmer Management</h1>
          <p className="text-muted-foreground">
            Manage farmer accounts and profiles
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Farmer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingFarmer ? 'Edit Farmer' : 'Add New Farmer'}
              </DialogTitle>
              <DialogDescription>
                {editingFarmer ? 'Edit the details of the farmer.' : 'Add a new farmer to the system.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Farm Location *</Label>
                <Input
                  id="location"
                  value={formData.farmLocation}
                  onChange={(e) => setFormData({ ...formData, farmLocation: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate">Default Hourly Rate (₹) *</Label>
                <Input
                  id="rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.defaultRate}
                  onChange={(e) => setFormData({ ...formData, defaultRate: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  {editingFarmer ? 'Update' : 'Add'} Farmer
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Farmers ({farmers.length})</CardTitle>
          <div className="pt-4">
            <Input
              placeholder="Search by name, mobile, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredFarmers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {searchTerm ? 'No farmers found matching your search.' : 'No farmers added yet. Click "Add Farmer" to get started.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Farm Location</TableHead>
                    <TableHead>Rate (₹/hr)</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFarmers.map((farmer) => (
                    <TableRow key={farmer.id}>
                      <TableCell>{farmer.name}</TableCell>
                      <TableCell>{farmer.mobile}</TableCell>
                      <TableCell>{farmer.farmLocation}</TableCell>
                      <TableCell>₹{farmer.defaultRate}</TableCell>
                      <TableCell>
                        {farmer.balance === 0 ? (
                          <Badge variant="outline">Cleared</Badge>
                        ) : farmer.balance > 0 ? (
                          <Badge className="bg-green-100 text-green-800">
                            +₹{farmer.balance.toLocaleString()}
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            -₹{Math.abs(farmer.balance).toLocaleString()}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onViewProfile(farmer.id)}
                            title="View Profile"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedFarmerForReceipt(farmer.id)}
                            title="Generate Statement"
                          >
                            <Receipt className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(farmer)}
                            title="Edit Farmer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(farmer.id)}
                            title="Delete Farmer"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      {selectedFarmerForReceipt && (
        <FarmerReceipt farmerId={selectedFarmerForReceipt} onClose={() => setSelectedFarmerForReceipt(null)} />
      )}
    </div>
  );
}