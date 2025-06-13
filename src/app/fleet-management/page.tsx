'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { INITIAL_VEHICLES, VEHICLE_TYPES, VEHICLE_HEALTH_STATUSES, FUEL_TYPES } from '@/lib/constants';
import type { Vehicle } from '@/types';
import { PlusCircle, Edit3, Trash2, Car, Truck as TruckIcon, Bike } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const getVehicleIcon = (type: Vehicle['type']) => {
  switch (type) {
    case 'Van':
    case 'Truck (Light)':
    case 'Truck (Heavy)':
      return <TruckIcon className="h-5 w-5 text-muted-foreground" />;
    case 'Car':
      return <Car className="h-5 w-5 text-muted-foreground" />;
    case 'Motorcycle':
      return <Bike className="h-5 w-5 text-muted-foreground" />;
    default:
      return <TruckIcon className="h-5 w-5 text-muted-foreground" />;
  }
};

const getStatusBadgeVariant = (status: Vehicle['healthStatus']): "default" | "secondary" | "destructive" | "outline" | null | undefined => {
  switch (status) {
    case 'Good': return 'default'; // Will use primary color from theme
    case 'Maintenance Soon': return 'secondary'; // Will use accent color or similar
    case 'Needs Repair': return 'destructive';
    default: return 'outline';
  }
};

export default function FleetManagementPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Partial<Vehicle>>({});
  const [isEditing, setIsEditing] = useState(false);

  const handleAddOrUpdateVehicle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newVehicle: Vehicle = {
      id: currentVehicle.id || Date.now().toString(),
      name: formData.get('name') as string,
      type: formData.get('type') as Vehicle['type'],
      capacity: parseInt(formData.get('capacity') as string, 10),
      healthStatus: formData.get('healthStatus') as Vehicle['healthStatus'],
      fuelType: formData.get('fuelType') as Vehicle['fuelType'] || undefined,
      registration: formData.get('registration') as string || undefined,
      purchaseDate: formData.get('purchaseDate') as string || undefined,
    };

    if (isEditing) {
      setVehicles(vehicles.map(v => v.id === newVehicle.id ? newVehicle : v));
    } else {
      setVehicles([...vehicles, newVehicle]);
    }
    setIsDialogOpen(false);
    setCurrentVehicle({});
    setIsEditing(false);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const openAddDialog = () => {
    setCurrentVehicle({});
    setIsEditing(false);
    setIsDialogOpen(true);
  }


  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Fleet Management</CardTitle>
            <CardDescription>Manage your fleet of vehicles efficiently.</CardDescription>
          </div>
          <Button onClick={openAddDialog} variant="default">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Vehicle
          </Button>
        </CardHeader>
        <CardContent>
          {vehicles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Capacity (kg)</TableHead>
                  <TableHead>Fuel Type</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead>Health Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>{getVehicleIcon(vehicle.type)}</TableCell>
                    <TableCell className="font-medium">{vehicle.name}</TableCell>
                    <TableCell>{vehicle.type}</TableCell>
                    <TableCell>{vehicle.capacity}</TableCell>
                    <TableCell>{vehicle.fuelType || 'N/A'}</TableCell>
                    <TableCell>{vehicle.registration || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(vehicle.healthStatus)}>{vehicle.healthStatus}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(vehicle)} aria-label={`Edit ${vehicle.name}`}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(vehicle.id)} aria-label={`Delete ${vehicle.name}`}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <div className="text-center py-12 text-muted-foreground">
                <TruckIcon className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No vehicles in your fleet yet.</h3>
                <p className="mb-4">Add your first vehicle to get started!</p>
                <Button onClick={openAddDialog} variant="default">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Vehicle
                </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setCurrentVehicle({});
          setIsEditing(false);
        }
      }}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the details of your vehicle.' : 'Fill in the details for the new vehicle.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddOrUpdateVehicle}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" defaultValue={currentVehicle.name || ''} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Select name="type" defaultValue={currentVehicle.type || VEHICLE_TYPES[0]}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {VEHICLE_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">Capacity (kg)</Label>
                <Input id="capacity" name="capacity" type="number" defaultValue={currentVehicle.capacity || ''} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="healthStatus" className="text-right">Health Status</Label>
                 <Select name="healthStatus" defaultValue={currentVehicle.healthStatus || VEHICLE_HEALTH_STATUSES[0]}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select health status" />
                  </SelectTrigger>
                  <SelectContent>
                    {VEHICLE_HEALTH_STATUSES.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fuelType" className="text-right">Fuel Type</Label>
                <Select name="fuelType" defaultValue={currentVehicle.fuelType || ''}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select fuel type (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="">N/A</SelectItem>
                    {FUEL_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="registration" className="text-right">Registration</Label>
                <Input id="registration" name="registration" defaultValue={currentVehicle.registration || ''} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="purchaseDate" className="text-right">Purchase Date</Label>
                <Input id="purchaseDate" name="purchaseDate" type="date" defaultValue={currentVehicle.purchaseDate || ''} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{isEditing ? 'Save Changes' : 'Add Vehicle'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
