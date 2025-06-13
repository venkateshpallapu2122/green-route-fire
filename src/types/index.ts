import type { LucideIcon } from 'lucide-react';

export interface Vehicle {
  id: string;
  name: string;
  type: 'Van' | 'Truck (Light)' | 'Truck (Heavy)' | 'Car' | 'Motorcycle';
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
  fuelSaved: number; // in liters
  co2Reduced: number; // in kg
  averageEfficiency: number; // km/l or kWh/km
}

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: (pathname: string) => boolean;
}

export interface RouteSimulationResult {
  optimizedRoute: string;
  estimatedFuelConsumption: number;
  estimatedCO2Emissions: number;
}
