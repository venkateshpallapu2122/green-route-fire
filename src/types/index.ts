
import type { LucideIcon } from 'lucide-react';

export interface Vehicle {
  id: string;
  name: string;
  type: 'Van' | 'Truck (Light)' | 'Truck (Heavy)' | 'Car' | 'Motorcycle' | 'Cargo Bike' | 'Electric Van' | 'Electric Truck';
  capacity: number; // in kg
  healthStatus: 'Good' | 'Maintenance Soon' | 'Needs Repair';
  fuelType?: 'Diesel' | 'Gasoline' | 'Electric' | 'Hybrid';
  registration?: string;
  purchaseDate?: string;
}

export interface ReportEntry {
  id: string;
  date: string;
  routeName: string;
  fuelSaved: number; // in liters or kWh
  co2Reduced: number; // in kg
  averageEfficiency: number; // km/l or km/kWh
}

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: (pathname: string) => boolean;
}

export interface RouteSimulationResult {
  optimizedRouteDescription: string;
  estimatedDuration: string;
  estimatedDistance: string;
  estimatedFuelConsumption: number; // Liters for combustion, kWh for electric
  estimatedCO2Emissions: number;
  ecoFriendlySuggestion?: string;
  weatherForecastImpact?: string;
  trafficConsiderations?: string;
  routeWarnings?: string[];
  otherRecommendations?: string[];
}
