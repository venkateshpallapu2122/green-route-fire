'use server';

/**
 * @fileOverview Simulates a route based on real-time traffic, vehicle parameters,
 * and environmental considerations.
 *
 * - generateRouteSimulation - A function that handles the route simulation process.
 * - GenerateRouteSimulationInput - The input type for the generateRouteSimulation function.
 * - GenerateRouteSimulationOutput - The return type for the generateRouteSimulation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRouteSimulationInputSchema = z.object({
  origin: z.string().describe('Starting address for the route.'),
  destination: z.string().describe('Ending address for the route.'),
  vehicleCapacity: z.number().describe('The carrying capacity of the vehicle in kg.'),
  vehicleType: z.string().describe('The type of vehicle (e.g., truck, van, car).'),
  trafficConditions: z.string().describe('Real-time traffic conditions (e.g., light, moderate, heavy).'),
  environmentalConsiderations: z.string().describe('Environmental factors to consider (e.g., low emission zones).'),
});
export type GenerateRouteSimulationInput = z.infer<typeof GenerateRouteSimulationInputSchema>;

const GenerateRouteSimulationOutputSchema = z.object({
  optimizedRoute: z.string().describe('The optimized route considering all parameters.'),
  estimatedFuelConsumption: z.number().describe('Estimated fuel consumption for the route in liters.'),
  estimatedCO2Emissions: z.number().describe('Estimated CO2 emissions for the route in kg.'),
});
export type GenerateRouteSimulationOutput = z.infer<typeof GenerateRouteSimulationOutputSchema>;

export async function generateRouteSimulation(input: GenerateRouteSimulationInput): Promise<GenerateRouteSimulationOutput> {
  return generateRouteSimulationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRouteSimulationPrompt',
  input: {schema: GenerateRouteSimulationInputSchema},
  output: {schema: GenerateRouteSimulationOutputSchema},
  prompt: `You are an expert logistics and transportation planner.

  Based on the following information, generate an optimized route, estimate fuel consumption and CO2 emissions:

  Origin: {{{origin}}}
  Destination: {{{destination}}}
  Vehicle Capacity: {{{vehicleCapacity}}} kg
  Vehicle Type: {{{vehicleType}}}
  Traffic Conditions: {{{trafficConditions}}}
  Environmental Considerations: {{{environmentalConsiderations}}}

  Provide the optimized route, estimated fuel consumption (in liters), and estimated CO2 emissions (in kg).
  `,
});

const generateRouteSimulationFlow = ai.defineFlow(
  {
    name: 'generateRouteSimulationFlow',
    inputSchema: GenerateRouteSimulationInputSchema,
    outputSchema: GenerateRouteSimulationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
