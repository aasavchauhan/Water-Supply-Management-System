import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, IndianRupee, Droplets, Clock, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

interface FarmerProfileProps {
  farmerId: string;
  onBack: () => void;
}

export function FarmerProfile({ farmerId, onBack }: FarmerProfileProps) {
  const { farmers, supplyEntries, payments, addPayment } = useData();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    from: '',
    to: '',
  });

  const [paymentForm, setPaymentForm] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    mode: 'Cash' as 'Cash' | 'Online' | 'Other',
    remarks: '',
  });

  const farmer = farmers.find(f => f.id === farmerId);

  if (!farmer) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Farmer not found</p>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  // Filter entries for this farmer
  let farmerEntries = supplyEntries.filter(e => e.farmerId === farmerId);
  let farmerPayments = payments.filter(p => p.farmerId === farmerId);

  // Apply date filter
  if (dateFilter.from) {
    farmerEntries = farmerEntries.filter(e => e.date >= dateFilter.from);
    farmerPayments = farmerPayments.filter(p => p.date >= dateFilter.from);
  }
  if (dateFilter.to) {
    farmerEntries = farmerEntries.filter(e => e.date <= dateFilter.to);
    farmerPayments = farmerPayments.filter(p => p.date <= dateFilter.to);
  }

  // Calculate totals
  const totalHours = farmerEntries.reduce((sum, e) => sum + e.totalTimeUsed, 0);
  const totalWater = farmerEntries.reduce((sum, e) => sum + e.totalWaterUsed, 0);
  const totalCharges = farmerEntries.reduce((sum, e) => sum + e.amount, 0);
  const totalPaid = farmerPayments.reduce((sum, p) => sum + p.amount, 0);

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentForm.amount <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    addPayment({
      farmerId,
      date: paymentForm.date,
      amount: paymentForm.amount,
      mode: paymentForm.mode,
      remarks: paymentForm.remarks,
    });

    toast.success('Payment recorded successfully');
    setIsPaymentDialogOpen(false);
    setPaymentForm({
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      mode: 'Cash',
      remarks: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button onClick={onBack} variant="outline" size="sm" className="self-start">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1>{farmer.name}</h1>
          <p className="text-muted-foreground">
            {farmer.mobile} • {farmer.farmLocation}
          </p>
        </div>
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Record Payment</span>
              <span className="sm:hidden">Payment</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
              <DialogDescription>Enter the payment details for {farmer.name}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payDate">Date *</Label>
                <Input
                  id="payDate"
                  type="date"
                  value={paymentForm.date}
                  onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mode">Payment Mode *</Label>
                <Select
                  value={paymentForm.mode}
                  onValueChange={(value: any) => setPaymentForm({ ...paymentForm, mode: value })}
                >
                  <SelectTrigger id="mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payRemarks">Remarks</Label>
                <Textarea
                  id="payRemarks"
                  value={paymentForm.remarks}
                  onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
                  placeholder="Optional notes"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  Save Payment
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPaymentDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Account Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {farmerEntries.length} sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Water Used</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalWater.toLocaleString()} L</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total consumption
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Charges</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">₹{totalCharges.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ₹{totalPaid.toLocaleString()} paid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Balance</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {farmer.balance === 0 ? (
              <>
                <div className="text-2xl text-green-600">Cleared</div>
                <p className="text-xs text-muted-foreground mt-1">No dues</p>
              </>
            ) : farmer.balance > 0 ? (
              <>
                <div className="text-2xl text-green-600">+₹{farmer.balance.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Advance</p>
              </>
            ) : (
              <>
                <div className="text-2xl text-red-600">-₹{Math.abs(farmer.balance).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Due</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Date Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter by Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="from">From Date</Label>
              <Input
                id="from"
                type="date"
                value={dateFilter.from}
                onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">To Date</Label>
              <Input
                id="to"
                type="date"
                value={dateFilter.to}
                onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
              />
            </div>
          </div>
          {(dateFilter.from || dateFilter.to) && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setDateFilter({ from: '', to: '' })}
            >
              Clear Filter
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Supply Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Supply Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {farmerEntries.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No supply sessions found for this date range
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Water Used</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...farmerEntries]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {entry.startTime} - {entry.stopTime}
                        </TableCell>
                        <TableCell>{entry.totalTimeUsed.toFixed(2)} hrs</TableCell>
                        <TableCell>{entry.totalWaterUsed.toLocaleString()} L</TableCell>
                        <TableCell>₹{entry.rate}/hr</TableCell>
                        <TableCell>₹{entry.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {entry.remarks || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {farmerPayments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No payments recorded for this date range
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...farmerPayments]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-green-600">₹{payment.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{payment.mode}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {payment.remarks || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}