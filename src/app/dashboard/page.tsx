'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DASHBOARD_METRICS, INITIAL_REPORTS, INITIAL_VEHICLES } from '@/lib/constants';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface Metric {
  id: string;
  title: string;
  value: string;
  icon: React.ElementType;
  unit: string;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metric[]>(DASHBOARD_METRICS);

  useEffect(() => {
    // Simulate fetching data or calculating metrics
    const totalVehicles = INITIAL_VEHICLES.length;
    const optimizedRoutes = INITIAL_REPORTS.length;
    const totalFuelSaved = INITIAL_REPORTS.reduce((sum, r) => sum + r.fuelSaved, 0);
    const totalCo2Reduced = INITIAL_REPORTS.reduce((sum, r) => sum + r.co2Reduced, 0);

    setMetrics(prevMetrics => prevMetrics.map(metric => {
      if (metric.id === 'vehicles') return { ...metric, value: totalVehicles.toString() };
      if (metric.id === 'routes') return { ...metric, value: optimizedRoutes.toString() };
      if (metric.id === 'fuel_saved') return { ...metric, value: totalFuelSaved.toFixed(1) };
      if (metric.id === 'co2_reduced') return { ...metric, value: totalCo2Reduced.toFixed(1) };
      return metric;
    }));
  }, []);
  
  const chartData = INITIAL_REPORTS.map(report => ({
    date: new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fuelSaved: report.fuelSaved,
    co2Reduced: report.co2Reduced,
  }));

  const chartConfig = {
    fuelSaved: {
      label: "Fuel Saved (L)",
      color: "hsl(var(--chart-1))",
    },
    co2Reduced: {
      label: "CO2 Reduced (kg)",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;


  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {metrics.map((metric) => (
          <Card key={metric.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.unit}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Sustainability Impact Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" tickLine={false} axisLine={false} tickMargin={8} />
                  <RechartsTooltip content={<ChartTooltipContent />} />
                  <Bar yAxisId="left" dataKey="fuelSaved" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="co2Reduced" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              No report data available for chart.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
