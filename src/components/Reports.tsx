import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">Generate comprehensive reports and view summaries</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reports Module</CardTitle>
          <CardDescription>Comprehensive reporting features</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Reports with filters, farmer-wise summary, and export functionality will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
