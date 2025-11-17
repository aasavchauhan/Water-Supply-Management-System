import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Droplet, 
  Clock, 
  IndianRupee, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  WalletCards,
  Activity,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { formatCurrency, formatDate, getTodayDate } from '@/utils/calculations';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';

export default function Dashboard() {
  const { farmers, supplyEntries, payments, settings } = useData();

  const stats = useMemo(() => {
    const totalFarmers = farmers.length;
    const activeFarmers = farmers.filter(f => f.isActive !== false).length;
    
    const totalCharges = supplyEntries.reduce((sum, e) => sum + e.amount, 0);
    const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
    const pendingDues = totalCharges - totalPayments;
    
    const totalHours = supplyEntries.reduce((sum, e) => sum + e.totalTimeUsed, 0);
    const totalWater = supplyEntries.reduce((sum, e) => sum + (e.waterUsed || 0), 0);
    
    const today = getTodayDate();
    const todaySupplies = supplyEntries.filter(e => e.date === today);
    const todayRevenue = todaySupplies.reduce((sum, e) => sum + e.amount, 0);
    const todayPayments = payments.filter(p => p.paymentDate === today);
    const todayCollections = todayPayments.reduce((sum, p) => sum + p.amount, 0);
    
    // This month stats
    const thisMonth = new Date().toISOString().slice(0, 7);
    const monthSupplies = supplyEntries.filter(e => e.date.startsWith(thisMonth));
    const monthRevenue = monthSupplies.reduce((sum, e) => sum + e.amount, 0);
    const monthPayments = payments.filter(p => p.paymentDate.startsWith(thisMonth));
    const monthCollections = monthPayments.reduce((sum, p) => sum + p.amount, 0);
    
    return {
      totalFarmers,
      activeFarmers,
      totalCharges,
      totalPayments,
      pendingDues,
      totalHours,
      totalWater,
      todaySupplies: todaySupplies.length,
      todayRevenue,
      todayCollections,
      monthRevenue,
      monthCollections,
      recentSupplies: supplyEntries.slice(-10).reverse(),
      recentPayments: payments.slice(-10).reverse(),
    };
  }, [farmers, supplyEntries, payments]);

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend, 
    trendValue,
    gradient 
  }: any) => (
    <Card className={`overflow-hidden relative animate-slide-up hover:scale-105 transition-all duration-300 ${gradient}`}>
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 opacity-10">
        <Icon className="w-full h-full" />
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Icon className="h-8 w-8 text-white/90" />
          {trend && (
            <div className={`flex items-center gap-1 text-white/90 text-sm font-semibold`}>
              {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {trendValue}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-xs text-white/70">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 border-2 border-primary/20 shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              Water Supply Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Link to="/supply">
            <Button size="lg" className="shadow-lg hover:shadow-xl">
              <Droplet className="h-5 w-5 mr-2" />
              New Supply Entry
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Farmers"
          value={stats.totalFarmers}
          subtitle={`${stats.activeFarmers} active`}
          icon={Users}
          gradient="gradient-primary text-white"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalCharges, '₹')}
          subtitle="All time charges"
          icon={IndianRupee}
          gradient="gradient-success text-white"
        />
        <StatCard
          title="Total Hours"
          value={`${stats.totalHours.toFixed(1)}h`}
          subtitle={`${stats.totalWater.toFixed(0)}L water`}
          icon={Clock}
          gradient="bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
        />
        <StatCard
          title="Pending Dues"
          value={formatCurrency(stats.pendingDues, '₹')}
          subtitle="Outstanding amount"
          icon={WalletCards}
          gradient={stats.pendingDues > 0 ? "gradient-danger text-white" : "gradient-success text-white"}
        />
      </div>

      {/* Today & Month Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg animate-slide-up">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Today's Activity
                </CardTitle>
                <CardDescription className="mt-1">{formatDate(getTodayDate())}</CardDescription>
              </div>
              <Calendar className="h-10 w-10 text-primary/20" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Supply Entries</p>
                <p className="text-2xl font-bold text-blue-600">{stats.todaySupplies}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.todayRevenue, '₹')}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl col-span-2">
                <p className="text-sm text-gray-600 mb-1">Collections</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.todayCollections, '₹')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg animate-slide-up">
          <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  This Month
                </CardTitle>
                <CardDescription className="mt-1">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</CardDescription>
              </div>
              <Sparkles className="h-10 w-10 text-green-600/20" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-transparent rounded-xl">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.monthRevenue, '₹')}</p>
                </div>
                <IndianRupee className="h-8 w-8 text-green-600/30" />
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl">
                <div>
                  <p className="text-sm text-gray-600">Total Collections</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.monthCollections, '₹')}</p>
                </div>
                <WalletCards className="h-8 w-8 text-blue-600/30" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Supplies */}
        <Card className="shadow-lg animate-slide-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-blue-600" />
                Recent Supply Entries
              </CardTitle>
              <Link to="/supply">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {stats.recentSupplies.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Droplet className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No supply entries yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentSupplies.slice(0, 5).map((entry) => {
                  const farmer = farmers.find(f => f.id === entry.farmerId);
                  return (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{farmer?.name || 'Unknown'}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-sm text-gray-500">{formatDate(entry.date)}</p>
                          <Badge variant="outline" className="text-xs">{entry.totalTimeUsed.toFixed(1)}h</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{formatCurrency(entry.amount, '₹')}</p>
                        <p className="text-xs text-gray-500">@₹{entry.rate}/hr</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card className="shadow-lg animate-slide-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <WalletCards className="h-5 w-5 text-green-600" />
                Recent Payments
              </CardTitle>
              <Link to="/farmers">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {stats.recentPayments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <WalletCards className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No payments recorded yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentPayments.slice(0, 5).map((payment) => {
                  const farmer = farmers.find(f => f.id === payment.farmerId);
                  return (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{farmer?.name || 'Unknown'}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-sm text-gray-500">{formatDate(payment.paymentDate)}</p>
                          <Badge className="text-xs capitalize">{payment.paymentMethod.replace('_', ' ')}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{formatCurrency(payment.amount, '₹')}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg animate-scale-in border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Link to="/supply" className="block">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <Droplet className="h-8 w-8 text-blue-600 mb-2" />
                <p className="font-semibold">Record Supply</p>
                <p className="text-xs text-gray-600 mt-1">Add new water supply entry</p>
              </div>
            </Link>
            <Link to="/farmers" className="block">
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <Users className="h-8 w-8 text-green-600 mb-2" />
                <p className="font-semibold">Manage Farmers</p>
                <p className="text-xs text-gray-600 mt-1">View and edit farmer list</p>
              </div>
            </Link>
            <Link to="/reports" className="block">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <Activity className="h-8 w-8 text-purple-600 mb-2" />
                <p className="font-semibold">View Reports</p>
                <p className="text-xs text-gray-600 mt-1">Analytics and insights</p>
              </div>
            </Link>
            <Link to="/settings" className="block">
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <IndianRupee className="h-8 w-8 text-orange-600 mb-2" />
                <p className="font-semibold">Settings</p>
                <p className="text-xs text-gray-600 mt-1">Configure rates & business</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
