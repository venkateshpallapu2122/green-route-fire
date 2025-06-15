
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { optimizeRouteAction, type RouteOptimizationFormState } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, MapIcon, CheckCircle2, Sparkles, Thermometer, Wind, AlertTriangle, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ENVIRONMENTAL_CONSIDERATIONS_OPTIONS, VEHICLE_TYPES, ECO_FRIENDLY_OPTIONS } from '@/lib/constants';
import { GOOGLE_MAPS_API_KEY } from '@/lib/config';

// Extend window type for Google Maps
declare global {
  interface Window {
    google?: typeof google;
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending} aria-live="polite" suppressHydrationWarning={true}>
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
  const [state, formAction] = React.useActionState(optimizeRouteAction, initialState);

  const originInputRef = useRef<HTMLInputElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);
  const [isMapsScriptLoaded, setIsMapsScriptLoaded] = useState(false);
  
  useEffect(() => {
    const scriptId = "google-maps-script";

    if (window.google?.maps?.places) {
      setIsMapsScriptLoaded(true);
      return;
    }
    
    if (document.getElementById(scriptId)) {
      // Script already added or is loading
      if (window.google?.maps?.places) setIsMapsScriptLoaded(true); // Check if loaded by another instance
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsMapsScriptLoaded(true);
    };
    script.onerror = () => {
      console.error("Google Maps script could not be loaded.");
    };
    document.head.appendChild(script);

  }, []);

  useEffect(() => {
    if (!isMapsScriptLoaded || !window.google?.maps?.places) {
      return;
    }

    if (originInputRef.current) {
      const originAutocomplete = new window.google.maps.places.Autocomplete(
        originInputRef.current,
        { types: ['geocode', 'establishment'] }
      );
      originAutocomplete.setFields(['formatted_address', 'name', 'geometry']);
    }

    if (destinationInputRef.current) {
      const destinationAutocomplete = new window.google.maps.places.Autocomplete(
        destinationInputRef.current,
        { types: ['geocode', 'establishment'] }
      );
      destinationAutocomplete.setFields(['formatted_address', 'name', 'geometry']);
    }
  }, [isMapsScriptLoaded]);


  return (
    <div className="container mx-auto py-8 grid gap-8 md:grid-cols-3">
      <Card className="md:col-span-1 shadow-lg">
        <CardHeader>
          <CardTitle>Optimize Your Route</CardTitle>
          <CardDescription>Enter details to find the most intelligent and efficient route.</CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="origin">Origin Address</Label>
              <Input 
                id="origin" 
                name="origin" 
                placeholder="e.g., 123 Main St, Anytown" 
                aria-describedby="origin-error" 
                suppressHydrationWarning={true}
                ref={originInputRef} 
              />
              {state.errors?.origin && <p id="origin-error" className="text-sm text-destructive mt-1">{state.errors.origin.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="destination">Destination Address</Label>
              <Input 
                id="destination" 
                name="destination" 
                placeholder="e.g., 456 Oak Ave, Otherville" 
                aria-describedby="destination-error" 
                suppressHydrationWarning={true}
                ref={destinationInputRef}
              />
              {state.errors?.destination && <p id="destination-error" className="text-sm text-destructive mt-1">{state.errors.destination.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="departureDateTime">Departure Date & Time (Optional)</Label>
              <Input id="departureDateTime" name="departureDateTime" type="datetime-local" aria-describedby="departureDateTime-error" suppressHydrationWarning={true} />
              {state.errors?.departureDateTime && <p id="departureDateTime-error" className="text-sm text-destructive mt-1">{state.errors.departureDateTime.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select name="vehicleType" defaultValue={VEHICLE_TYPES[0]}>
                <SelectTrigger id="vehicleType" aria-describedby="vehicleType-error" suppressHydrationWarning={true}>
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
              <Input id="vehicleCapacity" name="vehicleCapacity" type="number" placeholder="e.g., 1000" aria-describedby="vehicleCapacity-error" suppressHydrationWarning={true} />
              {state.errors?.vehicleCapacity && <p id="vehicleCapacity-error" className="text-sm text-destructive mt-1">{state.errors.vehicleCapacity.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="environmentalConsiderations">Environmental Considerations</Label>
               <Select name="environmentalConsiderations" defaultValue={ENVIRONMENTAL_CONSIDERATIONS_OPTIONS[0]}>
                <SelectTrigger id="environmentalConsiderations" aria-describedby="environmentalConsiderations-error" suppressHydrationWarning={true}>
                  <SelectValue placeholder="Select environmental considerations" />
                </SelectTrigger>
                <SelectContent>
                  {ENVIRONMENTAL_CONSIDERATIONS_OPTIONS.map(ec => <SelectItem key={ec} value={ec}>{ec}</SelectItem>)}
                </SelectContent>
              </Select>
              {state.errors?.environmentalConsiderations && <p id="environmentalConsiderations-error" className="text-sm text-destructive mt-1">{state.errors.environmentalConsiderations.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="preferredEcoOption">Preferred Eco Option</Label>
               <Select name="preferredEcoOption" defaultValue={ECO_FRIENDLY_OPTIONS[0].value}>
                <SelectTrigger id="preferredEcoOption" aria-describedby="preferredEcoOption-error" suppressHydrationWarning={true}>
                  <SelectValue placeholder="Select eco-friendly preference" />
                </SelectTrigger>
                <SelectContent>
                  {ECO_FRIENDLY_OPTIONS.map(eco => <SelectItem key={eco.value} value={eco.value}>{eco.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {state.errors?.preferredEcoOption && <p id="preferredEcoOption-error" className="text-sm text-destructive mt-1">{state.errors.preferredEcoOption.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="userPreferences">Routing Preferences (Optional)</Label>
              <Textarea id="userPreferences" name="userPreferences" placeholder="e.g., avoid tolls, prefer scenic routes, no unpaved roads" aria-describedby="userPreferences-error" suppressHydrationWarning={true} />
              {state.errors?.userPreferences && <p id="userPreferences-error" className="text-sm text-destructive mt-1">{state.errors.userPreferences.join(', ')}</p>}
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
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-primary mb-1">Optimized Route Description:</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap p-3 bg-muted/30 rounded-md shadow-sm">{state.simulationResult.optimizedRouteDescription}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="bg-secondary/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Est. Duration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary">{state.simulationResult.estimatedDuration}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-secondary/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Est. Distance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary">{state.simulationResult.estimatedDistance}</p>
                    </CardContent>
                  </Card>
                   <Card className="bg-secondary/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Est. Fuel/Energy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary">{state.simulationResult.estimatedFuelConsumption.toFixed(2)} L/kWh</p>
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
                
                {state.simulationResult.ecoFriendlySuggestion && (
                  <Alert variant="default" className="bg-accent/10 border-accent/50">
                    <Sparkles className="h-5 w-5 text-accent" />
                    <AlertTitle className="text-accent">Eco-Friendly Suggestion</AlertTitle>
                    <AlertDescription className="text-accent-foreground">
                      {state.simulationResult.ecoFriendlySuggestion}
                    </AlertDescription>
                  </Alert>
                )}

                {state.simulationResult.weatherForecastImpact && (
                  <Alert variant="default" className="bg-blue-500/10 border-blue-500/50">
                    <Thermometer className="h-5 w-5 text-blue-600" />
                    <AlertTitle className="text-blue-700">Weather Impact</AlertTitle>
                    <AlertDescription className="text-blue-700/90">
                      {state.simulationResult.weatherForecastImpact}
                    </AlertDescription>
                  </Alert>
                )}

                {state.simulationResult.trafficConsiderations && (
                  <Alert variant="default" className="bg-orange-500/10 border-orange-500/50">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-traffic-cone text-orange-600"><path d="M10.33 1.07 12 2l1.67-1.07C13.81 1.04 14 1.13 14 1.27v3.33c0 .1-.07.19-.17.23l-1.66.93a.2.2 0 0 1-.21.01l-1.61-.83c-.1-.05-.19-.15-.19-.26V1.27c0-.13.19-.23.33-.2Z"/><path d="M10.33 5.07 12 6l1.67-1.07C13.81 5.04 14 5.13 14 5.27v3.33c0 .1-.07.19-.17.23l-1.66.93a.2.2 0 0 1-.21.01l-1.61-.83c-.1-.05-.19-.15-.19-.26V5.27c0-.13.19-.23.33-.2Z"/><path d="M10.33 9.07 12 10l1.67-1.07c.14-.09.33.01.33.14v3.33c0 .1-.07.19-.17.23l-1.66.93a.2.2 0 0 1-.21.01l-1.61-.83c-.1-.05-.19-.15-.19-.26V9.21c0-.13.19-.23.33-.14Z"/><path d="m15.962 13.429 1.554 3.701a.25.25 0 0 1-.199.375H6.683a.25.25 0 0 1-.199-.375l1.554-3.701A1 1 0 0 1 9 13h6a1 1 0 0 1 .962.429Z"/><path d="M9 13V3.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5V13"/></svg>
                    <AlertTitle className="text-orange-700">Traffic Considerations</AlertTitle>
                    <AlertDescription className="text-orange-700/90">
                      {state.simulationResult.trafficConsiderations}
                    </AlertDescription>
                  </Alert>
                )}

                {state.simulationResult.routeWarnings && state.simulationResult.routeWarnings.length > 0 && (
                  <Alert variant="destructive" className="bg-yellow-500/10 border-yellow-500/50 text-yellow-700 [&>svg]:text-yellow-600">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitle>Route Warnings</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-5 space-y-1">
                        {state.simulationResult.routeWarnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {state.simulationResult.otherRecommendations && state.simulationResult.otherRecommendations.length > 0 && (
                   <Alert variant="default" className="bg-purple-500/10 border-purple-500/50">
                    <Info className="h-5 w-5 text-purple-600" />
                    <AlertTitle className="text-purple-700">Other Recommendations</AlertTitle>
                    <AlertDescription className="text-purple-700/90">
                       <ul className="list-disc pl-5 space-y-1">
                        {state.simulationResult.otherRecommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
                
                {state.origin && state.destination ? (
                  <div className="mt-4 h-80 bg-muted rounded-lg shadow-inner overflow-hidden" data-ai-hint="interactive route map">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_API_KEY}&origin=${encodeURIComponent(state.origin)}&destination=${encodeURIComponent(state.destination)}`}
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
                <p className="text-lg font-medium">Your detailed route simulation will appear here.</p>
                <p className="text-sm">Fill out the form and click "Optimize Route" for an intelligent analysis.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

