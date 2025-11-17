import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, User, Droplets, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { PaymentFormData } from '@/types';
import { formatCurrency, formatDate, getFarmerStats, getTodayDate, getFirstDayOfMonth } from '@/utils/calculations';

export default function FarmerProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { farmers, supplyEntries, payments, addPayment, deletePayment } = useData();

  const [fromDate, setFromDate] = useState(getFirstDayOfMonth());
  const [toDate, setToDate] = useState(getTodayDate());
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    farmerId: id || '',
    paymentDate: getTodayDate(),
    amount: '',
    paymentMethod: 'cash',
    transactionId: '',
    remarks: '',
  });

  const farmer = farmers.find(f => f.id === id);

  if (!farmer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Farmer not found</p>
        <Button onClick={() => navigate('/farmers')} className="mt-4">
          Back to Farmers
        </Button>
      </div>
    );
  }

  const farmerSupplies = supplyEntries.filter(e => e.farmerId === id);
  const farmerPayments = payments.filter(p => p.farmerId === id);

  // Filter by date range
  const filteredSupplies = farmerSupplies.filter(e => {
    const date = new Date(e.date);
    return date >= new Date(fromDate) && date <= new Date(toDate);
  });

  const filteredPayments = farmerPayments.filter(p => {
    const date = new Date(p.paymentDate);
    return date >= new Date(fromDate) && date <= new Date(toDate);
  });

  const stats = getFarmerStats(farmerSupplies, farmerPayments);

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentForm.amount || parseFloat(paymentForm.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    addPayment({
      farmerId: farmer.id,
      paymentDate: paymentForm.paymentDate,
      amount: parseFloat(paymentForm.amount),
      paymentMethod: paymentForm.paymentMethod,
      transactionId: paymentForm.transactionId || undefined,
      remarks: paymentForm.remarks || undefined,
    });

    toast.success('Payment recorded successfully');
    setPaymentDialogOpen(false);
    setPaymentForm({
      ...paymentForm,
      amount: '',
      transactionId: '',
      remarks: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate('/farmers')} className="hover:scale-105 transition-transform">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-lg">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{farmer.name}</h1>
              <p className="text-gray-500 mt-1">{farmer.mobile} • {farmer.farmLocation || 'No location'}</p>
            </div>
          </div>
          <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-lg hover:shadow-xl transition-all">
                <Plus className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
            <form onSubmit={handlePaymentSubmit}>
              <DialogHeader>
                <DialogTitle>Record Payment</DialogTitle>
                <DialogDescription>Add a new payment for {farmer.name}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Payment Date *</Label>
                    <Input
                      type="date"
                      value={paymentForm.paymentDate}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (₹) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Payment Method *</Label>
                  <Select 
                    value={paymentForm.paymentMethod} 
                    onValueChange={(value: any) => setPaymentForm({ ...paymentForm, paymentMethod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Transaction ID</Label>
                  <Input
                    value={paymentForm.transactionId}
                    onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Remarks</Label>
                  <Input
                    value={paymentForm.remarks}
                    onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Record Payment</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 animate-slide-up">
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Total Supplies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{stats.totalSupplies}</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Total Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{stats.totalHours.toFixed(2)}h</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Charges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalCharges, '₹')}</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${stats.currentBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatCurrency(stats.currentBalance, '₹')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Date Filters */}
      <Card className="shadow-lg border-2 animate-scale-in">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>From Date</Label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="flex-1">
              <Label>To Date</Label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-11"
              />
            </div>
            <Button variant="outline" onClick={() => {
              setFromDate(getFirstDayOfMonth());
              setToDate(getTodayDate());
            }} className="h-11">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Supply Entries */}
      <Card className="shadow-xl border-2">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent border-b-2">
          <CardTitle className="text-xl">Supply Entries ({filteredSupplies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSupplies.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No supply entries found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSupplies.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.billingMethod}</Badge>
                    </TableCell>
                    <TableCell>{entry.totalTimeUsed.toFixed(2)}h</TableCell>
                    <TableCell>₹{entry.rate}/hr</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(entry.amount, '₹')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Payments */}
      <Card className="shadow-xl border-2">
        <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b-2">
          <CardTitle className="text-xl">Payment History ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No payments found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-green-50/50 transition-colors duration-200">
                    <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatCurrency(payment.amount, '₹')}
                    </TableCell>
                    <TableCell>
                      <Badge>{payment.paymentMethod}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{payment.transactionId || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          deletePayment(payment.id);
                          toast.success('Payment deleted');
                        }}
                        className="hover:scale-110 transition-transform"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
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
