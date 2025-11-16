import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Droplets, IndianRupee, AlertCircle, Plus } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Dashboard() {
  const { farmers, supplyEntries, payments } = useData();
  const navigate = useNavigate();
  
  const totalFarmers = farmers.length;
  const farmersWithDues = farmers.filter(f => f.balance < 0).length;
  const totalWater = supplyEntries.reduce((sum, s) => sum + s.totalWaterUsed, 0);
  const totalHours = supplyEntries.reduce((sum, s) => sum + s.totalTimeUsed, 0);
  const totalCharges = supplyEntries.reduce((sum, s) => sum + s.amount, 0);
  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
  const pendingDues = totalCharges - totalPayments;
  const collectionRate = totalCharges > 0 ? (totalPayments / totalCharges) * 100 : 0;

  const recentSupplies = [...supplyEntries]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Water Supply Management</p>
        </div>
        <Button onClick={() => navigate('/supply')} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Supply
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFarmers}</div>
            <p className="text-xs text-muted-foreground">
              {farmersWithDues} with pending dues
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Supplied</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWater.toLocaleString()} L</div>
            <p className="text-xs text-muted-foreground">
              {totalHours.toFixed(1)} hours total
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPayments)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(totalCharges)} charged
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Dues</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(pendingDues)}</div>
            <p className="text-xs text-muted-foreground">
              {collectionRate.toFixed(1)}% collected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Supply Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Supply Sessions</CardTitle>
          <CardDescription>Latest 10 supply entries</CardDescription>
        </CardHeader>
        <CardContent>
          {recentSupplies.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No supply entries yet. Click "New Supply" to add one.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Farmer</TableHead>
                    <TableHead className="hidden sm:table-cell">Time (hrs)</TableHead>
                    <TableHead className="hidden md:table-cell">Water (L)</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSupplies.map((supply) => {
                    const farmer = farmers.find(f => f.id === supply.farmerId);
                    return (
                      <TableRow key={supply.id}>
                        <TableCell className="font-medium">{formatDate(supply.date)}</TableCell>
                        <TableCell>{farmer?.name || 'Unknown'}</TableCell>
                        <TableCell className="hidden sm:table-cell">{supply.totalTimeUsed.toFixed(2)}</TableCell>
                        <TableCell className="hidden md:table-cell">{supply.totalWaterUsed.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(supply.amount)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Latest 10 payment records</CardDescription>
        </CardHeader>
        <CardContent>
          {recentPayments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No payments recorded yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Farmer</TableHead>
                    <TableHead className="hidden sm:table-cell">Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayments.map((payment) => {
                    const farmer = farmers.find(f => f.id === payment.farmerId);
                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{formatDate(payment.createdAt)}</TableCell>
                        <TableCell>{farmer?.name || 'Unknown'}</TableCell>
                        <TableCell className="hidden sm:table-cell capitalize">{payment.paymentMethod || 'cash'}</TableCell>
                        <TableCell className="text-right font-medium text-green-600">{formatCurrency(payment.amount)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
