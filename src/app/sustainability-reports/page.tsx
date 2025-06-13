'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { INITIAL_REPORTS } from '@/lib/constants';
import type { ReportEntry } from '@/types';
import { Fuel, Leaf, BarChartHorizontalBig } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function SustainabilityReportsPage() {
  const [reports, setReports] = useState<ReportEntry[]>(INITIAL_REPORTS);

  const summaryStats = useMemo(() => {
    const totalFuelSaved = reports.reduce((sum, r) => sum + r.fuelSaved, 0);
    const totalCo2Reduced = reports.reduce((sum, r) => sum + r.co2Reduced, 0);
    const averageEfficiency = reports.length > 0
      ? reports.reduce((sum, r) => sum + r.averageEfficiency, 0) / reports.length
      : 0;
    return { totalFuelSaved, totalCo2Reduced, averageEfficiency };
  }, [reports]);

  const summaryCards = [
    { title: 'Total Fuel Saved', value: `${summaryStats.totalFuelSaved.toFixed(1)} L`, icon: Fuel },
    { title: 'Total CO2 Reduced', value: `${summaryStats.totalCo2Reduced.toFixed(1)} kg`, icon: Leaf },
    { title: 'Avg. Fuel Efficiency', value: `${summaryStats.averageEfficiency.toFixed(1)} km/L`, icon: BarChartHorizontalBig },
  ];

  const handleExport = () => {
    // Basic CSV export functionality
    const headers = ["Date", "Route Name", "Fuel Saved (L)", "CO2 Reduced (kg)", "Avg. Efficiency (km/L)"];
    const csvContent = [
      headers.join(","),
      ...reports.map(r => [r.date, r.routeName, r.fuelSaved, r.co2Reduced, r.averageEfficiency].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "sustainability_reports.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3 mb-8">
        {summaryCards.map(card => (
          <Card key={card.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Detailed Sustainability Log</CardTitle>
            <CardDescription>Review individual records of fuel and CO2 savings.</CardDescription>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          {reports.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Route Name</TableHead>
                  <TableHead className="text-right">Fuel Saved (L)</TableHead>
                  <TableHead className="text-right">CO2 Reduced (kg)</TableHead>
                  <TableHead className="text-right">Avg. Efficiency (km/L)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{report.routeName}</TableCell>
                    <TableCell className="text-right text-green-600 dark:text-green-400">{report.fuelSaved.toFixed(1)}</TableCell>
                    <TableCell className="text-right text-emerald-600 dark:text-emerald-400">{report.co2Reduced.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{report.averageEfficiency.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No sustainability reports available.</h3>
                <p>Optimized routes will generate reports here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
