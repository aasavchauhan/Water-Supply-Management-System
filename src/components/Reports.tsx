import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Download, Printer, FileText, Receipt } from 'lucide-react';
import { Badge } from './ui/badge';

export function Reports() {
  const { farmers, supplyEntries, payments, settings } = useData();
  
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    farmerId: 'all',
  });

  const [selectedFarmerForReceipt, setSelectedFarmerForReceipt] = useState<string | null>(null);

  // Filter data
  let filteredEntries = supplyEntries;
  let filteredPayments = payments;

  if (filters.dateFrom) {
    filteredEntries = filteredEntries.filter(e => e.date >= filters.dateFrom);
    filteredPayments = filteredPayments.filter(p => p.date >= filters.dateFrom);
  }
  if (filters.dateTo) {
    filteredEntries = filteredEntries.filter(e => e.date <= filters.dateTo);
    filteredPayments = filteredPayments.filter(p => p.date <= filters.dateTo);
  }
  if (filters.farmerId !== 'all') {
    filteredEntries = filteredEntries.filter(e => e.farmerId === filters.farmerId);
    filteredPayments = filteredPayments.filter(p => p.farmerId === filters.farmerId);
  }

  // Calculate summary
  const totalHours = filteredEntries.reduce((sum, e) => sum + e.totalTimeUsed, 0);
  const totalWater = filteredEntries.reduce((sum, e) => sum + e.totalWaterUsed, 0);
  const totalCharges = filteredEntries.reduce((sum, e) => sum + e.amount, 0);
  const totalPaid = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalDue = totalCharges - totalPaid;

  // Generate farmer-wise summary
  const farmerSummary = farmers.map(farmer => {
    const farmerEntries = filteredEntries.filter(e => e.farmerId === farmer.id);
    const farmerPayments = filteredPayments.filter(p => p.farmerId === farmer.id);
    
    const charges = farmerEntries.reduce((sum, e) => sum + e.amount, 0);
    const paid = farmerPayments.reduce((sum, p) => sum + p.amount, 0);
    const hours = farmerEntries.reduce((sum, e) => sum + e.totalTimeUsed, 0);
    const water = farmerEntries.reduce((sum, e) => sum + e.totalWaterUsed, 0);

    return {
      farmer,
      hours,
      water,
      charges,
      paid,
      due: charges - paid,
    };
  }).filter(s => s.charges > 0 || s.paid > 0); // Only show farmers with activity

  const exportToCSV = () => {
    let csv = 'Farmer,Hours,Water (L),Charges (₹),Paid (₹),Due (₹)\n';
    farmerSummary.forEach(s => {
      csv += `${s.farmer.name},${s.hours.toFixed(2)},${s.water},${s.charges},${s.paid},${s.due}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `water-supply-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Print-only header */}
      <div className="hidden print:block print-header">
        <h1>{settings?.businessName || 'Water Irrigation Supply'}</h1>
        {settings?.businessAddress && (
          <p className="business-info">{settings.businessAddress}</p>
        )}
        <p className="report-meta">
          Water Supply Report
          {filters.dateFrom && filters.dateTo && (
            <> • Period: {new Date(filters.dateFrom).toLocaleDateString()} to {new Date(filters.dateTo).toLocaleDateString()}</>
          )}
        </p>
        <p className="report-meta">
          Generated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </p>
      </div>

      {/* Screen-only header */}
      <div className="print:hidden">
        <h1>Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Generate detailed reports and export data
        </p>
      </div>

      {/* Filters */}
      <Card className="no-print">
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="farmer">Farmer</Label>
              <Select
                value={filters.farmerId}
                onValueChange={(value) => setFilters({ ...filters, farmerId: value })}
              >
                <SelectTrigger id="farmer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Farmers</SelectItem>
                  {farmers.map((farmer) => (
                    <SelectItem key={farmer.id} value={farmer.id}>
                      {farmer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setFilters({ dateFrom: '', dateTo: '', farmerId: 'all' })}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="print:hidden grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredEntries.length} sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Water Supplied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalWater.toLocaleString()} L</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Charges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">₹{totalCharges.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">₹{totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ₹{totalDue.toLocaleString()} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Print-only summary cards */}
      <div className="hidden print:block print-summary-grid">
        <div className="print-summary-card">
          <div className="label">Total Hours</div>
          <div className="value">{totalHours.toFixed(1)}</div>
          <div className="subtext">{filteredEntries.length} sessions</div>
        </div>
        <div className="print-summary-card">
          <div className="label">Water Supplied</div>
          <div className="value">{totalWater.toLocaleString()} L</div>
        </div>
        <div className="print-summary-card">
          <div className="label">Total Charges</div>
          <div className="value">₹{totalCharges.toLocaleString()}</div>
        </div>
        <div className="print-summary-card">
          <div className="label">Collection</div>
          <div className="value">₹{totalPaid.toLocaleString()}</div>
          <div className="subtext">₹{totalDue.toLocaleString()} pending</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 print:hidden">
        <Button onClick={exportToCSV} variant="outline" className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Export to CSV</span>
          <span className="sm:hidden">Export CSV</span>
        </Button>
        <Button onClick={printReport} variant="outline" className="w-full sm:w-auto">
          <Printer className="mr-2 h-4 w-4" />
          Print Report
        </Button>
      </div>

      {/* Farmer-wise Summary */}
      <div className="report-section">
        <Card>
          <CardHeader className="print:hidden">
            <CardTitle>Farmer-wise Summary</CardTitle>
          </CardHeader>
          <h2 className="hidden print:block">Farmer-wise Summary</h2>
          <CardContent>
            {farmerSummary.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No data available for the selected filters
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Farmer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Water (L)</TableHead>
                      <TableHead>Charges</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Due/Advance</TableHead>
                      <TableHead className="print:hidden">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {farmerSummary.map((summary) => (
                      <TableRow key={summary.farmer.id}>
                        <TableCell>{summary.farmer.name}</TableCell>
                        <TableCell>{summary.farmer.mobile}</TableCell>
                        <TableCell>{summary.hours.toFixed(1)}</TableCell>
                        <TableCell>{summary.water.toLocaleString()}</TableCell>
                        <TableCell>₹{summary.charges.toLocaleString()}</TableCell>
                        <TableCell className="amount-positive">₹{summary.paid.toLocaleString()}</TableCell>
                        <TableCell>
                          {summary.due === 0 ? (
                            <span className="print-badge badge-neutral">Cleared</span>
                          ) : summary.due > 0 ? (
                            <span className="print-badge badge-danger">
                              -₹{summary.due.toLocaleString()}
                            </span>
                          ) : (
                            <span className="print-badge badge-success">
                              +₹{Math.abs(summary.due).toLocaleString()}
                            </span>
                          )}
                          {/* Screen-only badges */}
                          <span className="print:hidden">
                            {summary.due === 0 ? (
                              <Badge variant="outline">Cleared</Badge>
                            ) : summary.due > 0 ? (
                              <Badge variant="destructive">
                                -₹{summary.due.toLocaleString()}
                              </Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800">
                                +₹{Math.abs(summary.due).toLocaleString()}
                              </Badge>
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="print:hidden">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedFarmerForReceipt(summary.farmer.id)}
                          >
                            <Receipt className="mr-1 h-3 w-3" />
                            Receipt
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="total-row">
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell>{totalHours.toFixed(1)}</TableCell>
                      <TableCell>{totalWater.toLocaleString()}</TableCell>
                      <TableCell>₹{totalCharges.toLocaleString()}</TableCell>
                      <TableCell>₹{totalPaid.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className="print-badge badge-danger">
                          {totalDue > 0 ? `-₹${totalDue.toLocaleString()}` : 'Cleared'}
                        </span>
                        {/* Screen-only badge */}
                        <span className="print:hidden">
                          <Badge variant={totalDue > 0 ? 'destructive' : 'outline'}>
                            {totalDue > 0 ? `-₹${totalDue.toLocaleString()}` : 'Cleared'}
                          </Badge>
                        </span>
                      </TableCell>
                      <TableCell className="print:hidden"></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Transactions */}
      <div className="report-section">
        <Card>
          <CardHeader className="print:hidden">
            <CardTitle>All Transactions</CardTitle>
          </CardHeader>
          <h2 className="hidden print:block">All Transactions</h2>
          <CardContent>
            {filteredEntries.length === 0 && filteredPayments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No transactions found for the selected filters
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Farmer</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ...filteredEntries.map(e => ({ ...e, type: 'supply' as const })),
                      ...filteredPayments.map(p => ({ ...p, type: 'payment' as const })),
                    ]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((item, index) => {
                        const farmer = farmers.find(f => f.id === item.farmerId);
                        return (
                          <TableRow key={`${item.type}-${item.id}`}>
                            <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              {/* Print-only badge */}
                              <span className={`print-badge ${item.type === 'supply' ? 'badge-danger' : 'badge-success'}`}>
                                {item.type === 'supply' ? 'Supply' : 'Payment'}
                              </span>
                              {/* Screen-only badge */}
                              <span className="print:hidden">
                                <Badge variant={item.type === 'supply' ? 'destructive' : 'default'}>
                                  {item.type === 'supply' ? 'Supply' : 'Payment'}
                                </Badge>
                              </span>
                            </TableCell>
                            <TableCell>{farmer?.name}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {item.type === 'supply'
                                ? `${item.totalTimeUsed.toFixed(2)} hrs • ${item.totalWaterUsed.toLocaleString()} L`
                                : `${item.mode} payment`}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={item.type === 'supply' ? 'amount-negative' : 'amount-positive'}>
                                {item.type === 'supply' ? '-' : '+'}₹{item.amount.toLocaleString()}
                              </span>
                            </TableCell>
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

      {/* Print footer */}
      <div className="hidden print:block print-footer">
        <p>This is a computer-generated report from {settings?.businessName || 'Water Irrigation Supply'}</p>
        <p>For queries, please contact the administration</p>
      </div>

      {/* Farmer Receipt Modal */}
      {selectedFarmerForReceipt && (
        <FarmerReceipt
          farmerId={selectedFarmerForReceipt}
          dateFrom={filters.dateFrom}
          dateTo={filters.dateTo}
          onClose={() => setSelectedFarmerForReceipt(null)}
        />
      )}
    </div>
  );
}