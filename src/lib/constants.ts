
import { LayoutDashboard, MapPinned, Truck, BarChart3, Settings as SettingsIcon, Leaf, Fuel, CloudCog, Bike, Zap } from 'lucide-react';
import type { NavItem, Vehicle, ReportEntry } from '@/types';

export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, match: (pathname) => pathname.startsWith('/dashboard') },
  { href: '/route-optimization', label: 'Route Optimization', icon: MapPinned, match: (pathname) => pathname.startsWith('/route-optimization') },
  { href: '/fleet-management', label: 'Fleet Management', icon: Truck, match: (pathname) => pathname.startsWith('/fleet-management') },
  { href: '/sustainability-reports', label: 'Sustainability Reports', icon: BarChart3, match: (pathname) => pathname.startsWith('/sustainability-reports') },
];

export const SETTINGS_NAV_ITEM: NavItem = {
  href: '/settings',
  label: 'Settings',
  icon: SettingsIcon,
  match: (pathname) => pathname.startsWith('/settings')
};

export const DASHBOARD_METRICS = [
  { id: 'vehicles', title: 'Total Vehicles', value: '0', icon: Truck, unit: '' },
  { id: 'routes', title: 'Optimized Routes', value: '0', icon: MapPinned, unit: '' },
  { id: 'fuel_saved', title: 'Est. Fuel Saved', value: '0', icon: Fuel, unit: 'Liters/kWh' },
  { id: 'co2_reduced', title: 'Est. CO2 Reduced', value: '0', icon: Leaf, unit: 'kg' },
];

export const INITIAL_VEHICLES: Vehicle[] = [
  { id: '1', name: 'Eco Van 1', type: 'Van', capacity: 1200, healthStatus: 'Good', fuelType: 'Electric', registration: 'EV001', purchaseDate: '2023-05-10' },
  { id: '2', name: 'Green Truck', type: 'Truck (Light)', capacity: 3000, healthStatus: 'Maintenance Soon', fuelType: 'Diesel', registration: 'GT002', purchaseDate: '2022-11-20' },
  { id: '3', name: 'City Runner', type: 'Car', capacity: 300, healthStatus: 'Good', fuelType: 'Hybrid', registration: 'CR003', purchaseDate: '2024-01-15' },
];

export const INITIAL_REPORTS: ReportEntry[] = [
  { id: '1', date: '2024-07-15', routeName: 'Downtown Delivery Loop', fuelSaved: 15.5, co2Reduced: 40.2, averageEfficiency: 8.2 },
  { id: '2', date: '2024-07-16', routeName: 'Intercity Express', fuelSaved: 45.0, co2Reduced: 117.0, averageEfficiency: 6.5 },
  { id: '3', date: '2024-07-17', routeName: 'Suburb Logistics Run', fuelSaved: 22.3, co2Reduced: 58.0, averageEfficiency: 7.1 },
];

export const VEHICLE_TYPES: Vehicle['type'][] = ['Van', 'Truck (Light)', 'Truck (Heavy)', 'Car', 'Motorcycle', 'Cargo Bike', 'Electric Van', 'Electric Truck'];
export const VEHICLE_HEALTH_STATUSES: Vehicle['healthStatus'][] = ['Good', 'Maintenance Soon', 'Needs Repair'];
export const FUEL_TYPES: Vehicle['fuelType'][] = ['Diesel', 'Gasoline', 'Electric', 'Hybrid'];

export const TRAFFIC_CONDITIONS_OPTIONS = ['Light', 'Moderate', 'Heavy', 'Unknown'];
export const ENVIRONMENTAL_CONSIDERATIONS_OPTIONS = ['None', 'Low Emission Zones', 'Avoid Tolls', 'Prefer Green Routes'];

export const ECO_FRIENDLY_OPTIONS: { value: 'not_specified' | 'standard' | 'ev_optimized' | 'bike_optimized'; label: string; icon?: React.ElementType }[] = [
  { value: 'not_specified', label: 'Not Specified' },
  { value: 'standard', label: 'Standard Route' },
  { value: 'ev_optimized', label: 'Optimize for EV', icon: Zap },
  { value: 'bike_optimized', label: 'Optimize for Bike/Cargo Bike', icon: Bike },
];
