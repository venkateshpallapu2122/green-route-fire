
'use client';

import React from 'react';
import { useActionState, useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { optimizeRouteAction, type RouteOptimizationFormState } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, MapIcon, CheckCircle2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ENVIRONMENTAL_CONSIDERATIONS_OPTIONS, TRAFFIC_CONDITIONS_OPTIONS, VEHICLE_TYPES } from '@/lib/constants';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending} aria-live="polite">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Optimizing...
        </>
      ) : (
        'Optimize Route'
      )}
    </Button>
  );
}

export default function RouteOptimizationPage() {
  const initialState: RouteOptimizationFormState = { message: null, errors: null, simulationResult: null, origin: null, destination: null };
  const [state, formAction] = useActionState(optimizeRouteAction, initialState);

  return (
    <div className="container mx-auto py-8 grid gap-8 md:grid-cols-3">
      <Card className="md:col-span-1 shadow-lg">
        <CardHeader>
          <CardTitle>Optimize Your Route</CardTitle>
          <CardDescription>Enter details to find the most eco-friendly and efficient route.</CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="origin">Origin Address</Label>
              <Input id="origin" name="origin" placeholder="e.g., 123 Main St, Anytown" aria-describedby="origin-error" />
              {state.errors?.origin && <p id="origin-error" className="text-sm text-destructive mt-1">{state.errors.origin.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="destination">Destination Address</Label>
              <Input id="destination" name="destination" placeholder="e.g., 456 Oak Ave, Otherville" aria-describedby="destination-error" />
              {state.errors?.destination && <p id="destination-error" className="text-sm text-destructive mt-1">{state.errors.destination.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select name="vehicleType" defaultValue={VEHICLE_TYPES[0]}>
                <SelectTrigger id="vehicleType" aria-describedby="vehicleType-error">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.errors?.vehicleType && <p id="vehicleType-error" className="text-sm text-destructive mt-1">{state.errors.vehicleType.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="vehicleCapacity">Vehicle Capacity (kg)</Label>
              <Input id="vehicleCapacity" name="vehicleCapacity" type="number" placeholder="e.g., 1000" aria-describedby="vehicleCapacity-error" />
              {state.errors?.vehicleCapacity && <p id="vehicleCapacity-error" className="text-sm text-destructive mt-1">{state.errors.vehicleCapacity.join(', ')}</p>}
            </div>
             <div>
              <Label htmlFor="trafficConditions">Traffic Conditions</Label>
              <Select name="trafficConditions" defaultValue={TRAFFIC_CONDITIONS_OPTIONS[0]}>
                <SelectTrigger id="trafficConditions" aria-describedby="trafficConditions-error">
                  <SelectValue placeholder="Select traffic conditions" />
                </SelectTrigger>
                <SelectContent>
                  {TRAFFIC_CONDITIONS_OPTIONS.map(tc => <SelectItem key={tc} value={tc}>{tc}</SelectItem>)}
                </SelectContent>
              </Select>
              {state.errors?.trafficConditions && <p id="trafficConditions-error" className="text-sm text-destructive mt-1">{state.errors.trafficConditions.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="environmentalConsiderations">Environmental Considerations</Label>
               <Select name="environmentalConsiderations" defaultValue={ENVIRONMENTAL_CONSIDERATIONS_OPTIONS[0]}>
                <SelectTrigger id="environmentalConsiderations" aria-describedby="environmentalConsiderations-error">
                  <SelectValue placeholder="Select environmental considerations" />
                </SelectTrigger>
                <SelectContent>
                  {ENVIRONMENTAL_CONSIDERATIONS_OPTIONS.map(ec => <SelectItem key={ec} value={ec}>{ec}</SelectItem>)}
                </SelectContent>
              </Select>
              {state.errors?.environmentalConsiderations && <p id="environmentalConsiderations-error" className="text-sm text-destructive mt-1">{state.errors.environmentalConsiderations.join(', ')}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      <div className="md:col-span-2 space-y-6">
        {state.message && !state.errors && (
          <Alert variant={state.simulationResult ? "default" : "destructive"} className="bg-opacity-80 backdrop-blur-sm">
            {state.simulationResult ? <CheckCircle2 className="h-4 w-4" /> : <Loader2 className="h-4 w-4" />}
            <AlertTitle>{state.simulationResult ? "Optimization Complete" : "Optimization Failed"}</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        {state.message && state.errors && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
            </Alert>
        )}

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Simulated Route & Impact</CardTitle>
          </CardHeader>
          <CardContent>
            {state.simulationResult ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-primary">Optimized Route:</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{state.simulationResult.optimizedRoute}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-secondary/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Est. Fuel Consumption</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary">{state.simulationResult.estimatedFuelConsumption.toFixed(2)} L</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-secondary/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Est. CO2 Emissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary">{state.simulationResult.estimatedCO2Emissions.toFixed(2)} kg</p>
                    </CardContent>
                  </Card>
                </div>
                {state.origin && state.destination ? (
                  <div className="mt-4 h-80 bg-muted rounded-lg shadow-inner overflow-hidden" data-ai-hint="interactive route map">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyA_O_V6h-YBbKbYbIw4_T2y1EASjLBJM2o&origin=${encodeURIComponent(state.origin)}&destination=${encodeURIComponent(state.destination)}`}
                      title="Route Map"
                    ></iframe>
                  </div>
                ) : (
                  <div className="mt-4 h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground shadow-inner" data-ai-hint="route map">
                    <MapIcon className="w-16 h-16 mr-2" />
                    Map data unavailable (origin/destination missing).
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                <MapIcon className="w-16 h-16 mb-4 text-gray-400" />
                <p className="text-lg font-medium">Your optimized route and map will appear here.</p>
                <p className="text-sm">Fill out the form and click "Optimize Route" to see the simulation.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
