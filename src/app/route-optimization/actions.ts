
'use server';

import { z } from 'zod';
import { generateRouteSimulation, type GenerateRouteSimulationInput } from '@/ai/flows/generate-route-simulation';
import type { RouteSimulationResult } from '@/types';

const RouteOptimizationFormSchema = z.object({
  origin: z.string().min(3, { message: 'Origin must be at least 3 characters.' }),
  destination: z.string().min(3, { message: 'Destination must be at least 3 characters.' }),
  vehicleCapacity: z.coerce.number().positive({ message: 'Vehicle capacity must be a positive number.' }),
  vehicleType: z.string().min(1, { message: 'Vehicle type is required.'}),
  environmentalConsiderations: z.string().min(1, { message: 'Environmental considerations are required.'}),
  preferredEcoOption: z.enum(['standard', 'ev_optimized', 'bike_optimized', 'not_specified']).default('not_specified'),
  departureDateTime: z.string().optional(),
  userPreferences: z.string().optional(),
});

export type RouteOptimizationFormState = {
  message?: string | null;
  errors?: {
    origin?: string[];
    destination?: string[];
    vehicleCapacity?: string[];
    vehicleType?: string[];
    environmentalConsiderations?: string[];
    preferredEcoOption?: string[];
    departureDateTime?: string[];
    userPreferences?: string[];
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
    environmentalConsiderations: formData.get('environmentalConsiderations'),
    preferredEcoOption: formData.get('preferredEcoOption'),
    departureDateTime: formData.get('departureDateTime') || undefined,
    userPreferences: formData.get('userPreferences') || undefined,
  });

  if (!validatedFields.success) {
    console.error("Validation errors:", validatedFields.error.flatten().fieldErrors);
    return {
      message: 'Validation failed. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
      simulationResult: null,
      origin: formData.get('origin') as string,
      destination: formData.get('destination') as string,
    };
  }

  const inputData: GenerateRouteSimulationInput = {
    origin: validatedFields.data.origin,
    destination: validatedFields.data.destination,
    vehicleCapacity: validatedFields.data.vehicleCapacity,
    vehicleType: validatedFields.data.vehicleType,
    environmentalConsiderations: validatedFields.data.environmentalConsiderations,
    preferredEcoOption: validatedFields.data.preferredEcoOption,
    ...(validatedFields.data.departureDateTime && { departureDateTime: validatedFields.data.departureDateTime }),
    ...(validatedFields.data.userPreferences && { userPreferences: validatedFields.data.userPreferences }),
  };


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
    console.error(
      'Route optimization error. This might be due to missing environment variables (e.g., GEMINI_API_KEY or GOOGLE_API_KEY) in your Vercel/hosting provider settings, or API configuration issues for the Genkit AI service. Full error:',
      error
    );
    return {
      message: 'An error occurred during route optimization. Please try again.',
      errors: null,
      simulationResult: null,
      origin: inputData.origin,
      destination: inputData.destination,
    };
  }
}
