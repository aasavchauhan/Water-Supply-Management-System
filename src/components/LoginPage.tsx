import { SignIn } from '@stackframe/stack';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Droplets } from 'lucide-react';

export function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Droplets className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            Water Irrigation Supply
          </CardTitle>
          <p className="text-muted-foreground">
            Management System
          </p>
        </CardHeader>
        <CardContent>
          <SignIn />
        </CardContent>
      </Card>
    </div>
  );
}
