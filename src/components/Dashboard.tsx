import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, Droplets, IndianRupee, Clock, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

interface DashboardProps {
  onNewSupply: () => void;
  onViewFarmers: () => void;
}

export function Dashboard({ onNewSupply, onViewFarmers }: DashboardProps) {
  const { farmers, supplyEntries, payments } = useData();

  // Calculate statistics
  const totalFarmers = farmers.length;
  
  const totalWaterSupplied = supplyEntries.reduce((sum, entry) => sum + entry.totalWaterUsed, 0);
  const totalHoursSupplied = supplyEntries.reduce((sum, entry) => sum + entry.totalTimeUsed, 0);
  
  const totalCharges = supplyEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalDues = totalCharges - totalPayments;
  
  const farmersWithDues = farmers.filter(f => f.balance < 0).length;

  // Recent supply entries
  const recentEntries = [...supplyEntries]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          Water Irrigation Supply Management Overview
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onNewSupply} size="lg" className="w-full sm:w-auto">
          Start New Supply Session
        </Button>
        <Button onClick={onViewFarmers} variant="outline" size="lg" className="w-full sm:w-auto">
          View Farmer Accounts
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Farmers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalFarmers}</div>
            {farmersWithDues > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {farmersWithDues} with pending dues
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Water Supplied</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalWaterSupplied.toLocaleString()} L</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalHoursSupplied.toFixed(1)} total hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Income</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">₹{totalPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ₹{totalCharges.toLocaleString()} total charges
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Pending Dues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-orange-600">₹{totalDues.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((totalPayments / totalCharges) * 100 || 0).toFixed(1)}% collected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Supply Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Supply Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentEntries.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No supply sessions recorded yet. Start a new session to begin tracking.
            </p>
          ) : (
            <div className="space-y-4">
              {recentEntries.map((entry) => {
                const farmer = farmers.find(f => f.id === entry.farmerId);
                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div>
                      <p>{farmer?.name || 'Unknown Farmer'}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString()} • {entry.totalTimeUsed.toFixed(2)} hrs • {entry.totalWaterUsed.toLocaleString()} L
                      </p>
                    </div>
                    <div className="text-right">
                      <p>₹{entry.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">@₹{entry.rate}/hr</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}