import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Search, Users, TrendingUp, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { FarmerFormData } from '@/types';
import { formatCurrency, searchFarmers } from '@/utils/calculations';

export default function FarmerManagement() {
  const { farmers, addFarmer, updateFarmer, deleteFarmer, settings } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState<string | null>(null);

  const [formData, setFormData] = useState<FarmerFormData>({
    name: '',
    mobile: '',
    farmLocation: '',
    defaultRate: settings.defaultRate.toString(),
  });

  const filteredFarmers = searchFarmers(farmers, searchTerm);

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
      updateFarmer(editingFarmer, {
        name: formData.name,
        mobile: formData.mobile,
        farmLocation: formData.farmLocation,
        defaultRate: parseFloat(formData.defaultRate),
      });
      toast.success('Farmer updated successfully');
    } else {
      addFarmer({
        name: formData.name,
        mobile: formData.mobile,
        farmLocation: formData.farmLocation,
        defaultRate: parseFloat(formData.defaultRate),
      });
      toast.success('Farmer added successfully');
    }

    resetForm();
    setDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      mobile: '',
      farmLocation: '',
      defaultRate: settings.defaultRate.toString(),
    });
    setEditingFarmer(null);
  };

  const handleEdit = (farmerId: string) => {
    const farmer = farmers.find(f => f.id === farmerId);
    if (farmer) {
      setFormData({
        name: farmer.name,
        mobile: farmer.mobile,
        farmLocation: farmer.farmLocation,
        defaultRate: farmer.defaultRate.toString(),
      });
      setEditingFarmer(farmerId);
      setDialogOpen(true);
    }
  };

  const handleDelete = (farmerId: string) => {
    deleteFarmer(farmerId);
    toast.success('Farmer deleted successfully');
  };

  const totalBalance = farmers.reduce((sum, f) => sum + f.balance, 0);
  const avgRate = farmers.length > 0 ? farmers.reduce((sum, f) => sum + f.defaultRate, 0) / farmers.length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-primary rounded-xl shadow-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Farmer Management</h1>
            <p className="text-gray-500 mt-1">Manage farmer accounts and profiles</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Farmers</p>
                  <p className="text-3xl font-bold text-blue-600">{farmers.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Balance</p>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(totalBalance, '₹')}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Rate</p>
                  <p className="text-3xl font-bold text-purple-600">₹{avgRate.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Farmer Button */}
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Farmer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingFarmer ? 'Edit Farmer' : 'Add New Farmer'}</DialogTitle>
                <DialogDescription>Enter farmer information below</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter farmer's full name"
                    required
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
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Farm Location</Label>
                  <Input
                    id="location"
                    value={formData.farmLocation}
                    onChange={(e) => setFormData({ ...formData, farmLocation: e.target.value })}
                    placeholder="Enter farm location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Default Rate (₹/hour) *</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.defaultRate}
                    onChange={(e) => setFormData({ ...formData, defaultRate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingFarmer ? 'Update' : 'Add'} Farmer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Farmers List */}
      <Card className="shadow-xl border-2 animate-slide-up">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-transparent border-b-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">All Farmers ({filteredFarmers.length})</CardTitle>
              <CardDescription>Manage and view farmer accounts</CardDescription>
            </div>
            <div className="w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <Input
                  placeholder="Search farmers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFarmers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No farmers found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="hidden lg:table-cell">Default Rate</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFarmers.map((farmer) => (
                  <TableRow key={farmer.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                    <TableCell className="font-medium">{farmer.name}</TableCell>
                    <TableCell>{farmer.mobile}</TableCell>
                    <TableCell className="hidden md:table-cell">{farmer.farmLocation || '-'}</TableCell>
                    <TableCell className="hidden lg:table-cell">₹{farmer.defaultRate}/hr</TableCell>
                    <TableCell>
                      <Badge variant={farmer.balance < 0 ? 'destructive' : 'default'}>
                        {formatCurrency(farmer.balance, '₹')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/farmers/${farmer.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(farmer.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Farmer</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {farmer.name}? This will also delete all supply entries and payments for this farmer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(farmer.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
