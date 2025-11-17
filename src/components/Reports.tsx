import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, BarChart, TrendingUp, Droplets, DollarSign, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency, formatDate, getFirstDayOfMonth, getTodayDate, exportToCSV } from '@/utils/calculations';
import { FarmerReport } from '@/types';

export default function Reports() {
  const { farmers, supplyEntries, payments, settings } = useData();

  const [fromDate, setFromDate] = useState(getFirstDayOfMonth());
  const [toDate, setToDate] = useState(getTodayDate());
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('all');

  // Filter data by date range
  const filteredSupplies = supplyEntries.filter(e => {
    const date = new Date(e.date);
    const matchesDate = date >= new Date(fromDate) && date <= new Date(toDate);
    const matchesFarmer = selectedFarmerId === 'all' || e.farmerId === selectedFarmerId;
    return matchesDate && matchesFarmer;
  });

  const filteredPayments = payments.filter(p => {
    const date = new Date(p.paymentDate);
    const matchesDate = date >= new Date(fromDate) && date <= new Date(toDate);
    const matchesFarmer = selectedFarmerId === 'all' || p.farmerId === selectedFarmerId;
    return matchesDate && matchesFarmer;
  });

  // Calculate summary stats
  const totalEntries = filteredSupplies.length;
  const totalWater = filteredSupplies.reduce((sum, e) => sum + (e.waterUsed || 0), 0);
  const totalCharges = filteredSupplies.reduce((sum, e) => sum + e.amount, 0);
  const totalPayments = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  // Generate farmer-wise summary
  const farmerReports: FarmerReport[] = farmers
    .filter(f => selectedFarmerId === 'all' || f.id === selectedFarmerId)
    .map(farmer => {
      const farmerSupplies = filteredSupplies.filter(e => e.farmerId === farmer.id);
      const farmerPayments = filteredPayments.filter(p => p.farmerId === farmer.id);

      const charges = farmerSupplies.reduce((sum, e) => sum + e.amount, 0);
      const paid = farmerPayments.reduce((sum, p) => sum + p.amount, 0);
      const water = farmerSupplies.reduce((sum, e) => sum + (e.waterUsed || 0), 0);

      return {
        farmerId: farmer.id,
        farmerName: farmer.name,
        mobile: farmer.mobile,
        totalSupplies: farmerSupplies.length,
        waterUsed: water,
        totalCharges: charges,
        paymentsReceived: paid,
        balance: charges - paid,
      };
    })
    .filter(report => report.totalSupplies > 0 || report.paymentsReceived > 0);

  const handleExportCSV = () => {
    const data = farmerReports.map(report => ({
      'Farmer Name': report.farmerName,
      'Mobile': report.mobile,
      'Total Supplies': report.totalSupplies,
      'Water Used (L)': report.waterUsed.toFixed(0),
      'Total Charges': report.totalCharges.toFixed(2),
      'Payments Received': report.paymentsReceived.toFixed(2),
      'Balance': report.balance.toFixed(2),
    }));

    exportToCSV(data, `farmer-report-${fromDate}-to-${toDate}`);
    toast.success('Report exported successfully');
  };

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-primary rounded-xl shadow-lg">
            <BarChart className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-500 mt-1">Generate comprehensive reports and view summaries</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Entries</p>
                  <p className="text-3xl font-bold text-blue-600">{totalEntries}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 bg-gradient-to-br from-cyan-50 to-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Water Used</p>
                  <p className="text-3xl font-bold text-cyan-600">{totalWater.toFixed(0)}L</p>
                </div>
                <div className="p-3 bg-cyan-100 rounded-lg">
                  <Droplets className="h-8 w-8 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 bg-gradient-to-br from-green-50 to-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Charges</p>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(totalCharges, '₹')}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Payments</p>
                  <p className="text-3xl font-bold text-purple-600">{formatCurrency(totalPayments, '₹')}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-xl border-2 animate-slide-up">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent border-b-2">
          <CardTitle className="text-xl">Report Filters</CardTitle>
          <CardDescription>Select date range and farmer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>From Date</Label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>To Date</Label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>Farmer</Label>
              <Select value={selectedFarmerId} onValueChange={setSelectedFarmerId}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Farmers</SelectItem>
                  {farmers.map(farmer => (
                    <SelectItem key={farmer.id} value={farmer.id}>
                      {farmer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <div className="flex gap-2">
                <Button onClick={handlePrint} variant="outline" className="flex-1 h-11 shadow-lg hover:shadow-xl transition-all">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button onClick={handleExportCSV} className="flex-1 h-11 shadow-lg hover:shadow-xl transition-all">
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Farmer-wise Summary */}
      <Card className="shadow-xl border-2">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-transparent border-b-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Farmer-wise Summary</CardTitle>
              <CardDescription>Detailed breakdown by farmer</CardDescription>
            </div>
            <FileText className="h-5 w-5 text-gray-500" />
          </div>
        </CardHeader>
        <CardContent>
          {farmerReports.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No data found for selected filters</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Farmer Name</TableHead>
                  <TableHead className="hidden md:table-cell">Mobile</TableHead>
                  <TableHead>Supplies</TableHead>
                  <TableHead className="hidden lg:table-cell">Water (L)</TableHead>
                  <TableHead>Charges</TableHead>
                  <TableHead className="hidden md:table-cell">Payments</TableHead>
                  <TableHead>Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {farmerReports.map((report) => (
                  <TableRow key={report.farmerId} className="hover:bg-gray-50/70 transition-colors duration-200">
                    <TableCell className="font-medium">{report.farmerName}</TableCell>
                    <TableCell className="hidden md:table-cell">{report.mobile}</TableCell>
                    <TableCell>{report.totalSupplies}</TableCell>
                    <TableCell className="hidden lg:table-cell">{report.waterUsed.toFixed(0)}</TableCell>
                    <TableCell>{formatCurrency(report.totalCharges, '₹')}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatCurrency(report.paymentsReceived, '₹')}</TableCell>
                    <TableCell>
                      <Badge variant={report.balance < 0 ? 'destructive' : 'default'}>
                        {formatCurrency(report.balance, '₹')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Totals Row */}
                <TableRow className="font-bold bg-muted/50">
                  <TableCell>TOTAL</TableCell>
                  <TableCell className="hidden md:table-cell">-</TableCell>
                  <TableCell>{farmerReports.reduce((sum, r) => sum + r.totalSupplies, 0)}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {farmerReports.reduce((sum, r) => sum + r.waterUsed, 0).toFixed(0)}
                  </TableCell>
                  <TableCell>{formatCurrency(totalCharges, '₹')}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatCurrency(totalPayments, '₹')}</TableCell>
                  <TableCell>{formatCurrency(totalCharges - totalPayments, '₹')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
