'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { DatabaseZap, Route } from 'lucide-react';

export default function SettingsPage() {
  const { toast } = useToast();

  const handleAddSampleVehicles = () => {
    // In a real app, this would likely call an API or update a global state/DB
    // For now, it's a placeholder action.
    toast({
      title: "Sample Data Added",
      description: "Sample vehicles have been added to Fleet Management (simulated).",
      variant: "default",
    });
  };

  const handleAddSampleRoutes = () => {
    toast({
      title: "Sample Data Added",
      description: "Sample route reports have been added to Sustainability Reports (simulated).",
      variant: "default",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>Manage application preferences and load sample data for demonstration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Demo Data</CardTitle>
              <CardDescription>Populate the application with sample data to explore its features.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Sample Vehicles</h4>
                  <p className="text-sm text-muted-foreground">Add a predefined set of vehicles to the fleet.</p>
                </div>
                <Button onClick={handleAddSampleVehicles} variant="outline">
                  <DatabaseZap className="mr-2 h-4 w-4" /> Add Sample Vehicles
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Sample Routes & Reports</h4>
                  <p className="text-sm text-muted-foreground">Add sample optimized routes and sustainability reports.</p>
                </div>
                <Button onClick={handleAddSampleRoutes} variant="outline">
                  <Route className="mr-2 h-4 w-4" /> Add Sample Reports
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preferences (Placeholder)</CardTitle>
              <CardDescription>Customize your EcoRoute AI experience.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Future settings such as preferred units (metric/imperial), notification settings, or map preferences would appear here.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
