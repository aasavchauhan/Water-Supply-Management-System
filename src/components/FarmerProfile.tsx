import { useParams } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FarmerProfile() {
  const { id } = useParams();
  const { farmers } = useData();
  const navigate = useNavigate();
  
  const farmer = farmers.find(f => f.id === id);

  if (!farmer) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Farmer not found</p>
        <Button onClick={() => navigate('/farmers')} className="mt-4">
          Back to Farmers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/farmers')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Farmers
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{farmer.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Detailed farmer profile with transaction history will be displayed here.
          </p>
          <p className="text-sm mt-2">Mobile: {farmer.mobile}</p>
          <p className="text-sm">Location: {farmer.farmLocation}</p>
          <p className="text-sm">Balance: ₹{farmer.balance}</p>
        </CardContent>
      </Card>
    </div>
  );
}
