
'use server';

import { z } from 'zod';
import { generateRouteSimulation, type GenerateRouteSimulationInput } from '@/ai/flows/generate-route-simulation';
import type { RouteSimulationResult } from '@/types';

const RouteOptimizationFormSchema = z.object({
  origin: z.string().min(3, { message: 'Origin must be at least 3 characters.' }),
  destination: z.string().min(3, { message: 'Destination must be at least 3 characters.' }),
  vehicleCapacity: z.coerce.number().positive({ message: 'Vehicle capacity must be a positive number.' }),
  vehicleType: z.string().min(1, { message: 'Vehicle type is required.'}),
  trafficConditions: z.string().min(1, { message: 'Traffic conditions are required.'}),
  environmentalConsiderations: z.string().min(1, { message: 'Environmental considerations are required.'}),
  preferredEcoOption: z.enum(['standard', 'ev_optimized', 'bike_optimized', 'not_specified']).default('not_specified'),
});

export type RouteOptimizationFormState = {
  message?: string | null;
  errors?: {
    origin?: string[];
    destination?: string[];
    vehicleCapacity?: string[];
    vehicleType?: string[];
    trafficConditions?: string[];
    environmentalConsiderations?: string[];
    preferredEcoOption?: string[];
  } | null;
  simulationResult?: RouteSimulationResult | null;
  origin?: string | null;
  destination?: string | null;
};

export async function optimizeRouteAction(
  prevState: RouteOptimizationFormState,
  formData: FormData
): Promise<RouteOptimizationFormState> {
  const validatedFields = RouteOptimizationFormSchema.safeParse({
    origin: formData.get('origin'),
    destination: formData.get('destination'),
    vehicleCapacity: formData.get('vehicleCapacity'),
    vehicleType: formData.get('vehicleType'),
    trafficConditions: formData.get('trafficConditions'),
    environmentalConsiderations: formData.get('environmentalConsiderations'),
    preferredEcoOption: formData.get('preferredEcoOption'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
      simulationResult: null,
      origin: null,
      destination: null,
    };
  }

  const inputData: GenerateRouteSimulationInput = validatedFields.data;

  try {
    const result = await generateRouteSimulation(inputData);
    return {
      message: 'Route optimization successful!',
      errors: null,
      simulationResult: result,
      origin: inputData.origin,
      destination: inputData.destination,
    };
  } catch (error) {
    console.error('Route optimization error:', error);
    return {
      message: 'An error occurred during route optimization. Please try again.',
      errors: null,
      simulationResult: null,
      origin: inputData.origin, 
      destination: inputData.destination,
    };
  }
}

