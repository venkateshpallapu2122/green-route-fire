
'use server';

/**
 * @fileOverview Simulates a route based on real-time traffic, vehicle parameters,
 * and environmental considerations, with an option for eco-friendly preferences.
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
  preferredEcoOption: z.enum(['standard', 'ev_optimized', 'bike_optimized', 'not_specified']).optional().default('not_specified').describe('Preferred eco-friendly routing option (e.g., standard, ev_optimized, bike_optimized). Defaults to not_specified.'),
});
export type GenerateRouteSimulationInput = z.infer<typeof GenerateRouteSimulationInputSchema>;

const GenerateRouteSimulationOutputSchema = z.object({
  optimizedRoute: z.string().describe('The optimized route considering all parameters.'),
  estimatedFuelConsumption: z.number().describe('Estimated fuel consumption for the route in liters (or kWh for EVs).'),
  estimatedCO2Emissions: z.number().describe('Estimated CO2 emissions for the route in kg.'),
  ecoFriendlySuggestion: z.string().optional().describe('A suggestion for a more eco-friendly alternative if applicable, or confirmation of eco-friendly choice.'),
});
export type GenerateRouteSimulationOutput = z.infer<typeof GenerateRouteSimulationOutputSchema>;

export async function generateRouteSimulation(input: GenerateRouteSimulationInput): Promise<GenerateRouteSimulationOutput> {
  return generateRouteSimulationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRouteSimulationPrompt',
  input: {schema: GenerateRouteSimulationInputSchema},
  output: {schema: GenerateRouteSimulationOutputSchema},
  prompt: `You are an expert logistics and transportation planner with a strong focus on sustainability.

  Based on the following information, generate an optimized route, estimate fuel consumption (or energy for EVs, specify units), estimate CO2 emissions, and provide an eco-friendly suggestion.

  Origin: {{{origin}}}
  Destination: {{{destination}}}
  Vehicle Capacity: {{{vehicleCapacity}}} kg
  Vehicle Type: {{{vehicleType}}}
  Traffic Conditions: {{{trafficConditions}}}
  Environmental Considerations: {{{environmentalConsiderations}}}
  Preferred Eco Option: {{{preferredEcoOption}}}

  Provide the optimized route.
  Estimate fuel consumption (in liters for combustion engines, or kWh for electric vehicles).
  Estimate CO2 emissions (in kg). For EVs, direct CO2 emissions are 0 kg during operation.
  
  Then, provide an ecoFriendlySuggestion:
  - If 'ev_optimized' was preferred and the vehicleType is electric or suitable, confirm this choice (e.g., "Excellent choice! Using an EV for this route minimizes direct emissions."). If vehicleType is not electric, suggest it.
  - If 'bike_optimized' was preferred, suggest a cargo bike if the distance and capacity are suitable, or explain if not.
  - If 'standard' or 'not_specified' was preferred, analyze the route and vehicle. If applicable, suggest a more eco-friendly option (e.g., "Consider using an electric van for this urban route to reduce emissions," or "For this short distance with moderate capacity needs, a cargo bike could be an efficient and zero-emission alternative."). If the current choice is already optimal from an eco-perspective given constraints, state that.
  - Ensure the suggestion is concise and actionable.
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

