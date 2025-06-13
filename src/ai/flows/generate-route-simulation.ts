
'use server';

/**
 * @fileOverview Simulates an advanced route based on real-time and predictive traffic,
 * vehicle parameters, environmental considerations, weather, and user preferences.
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
  environmentalConsiderations: z.string().describe('Environmental factors to consider (e.g., low emission zones).'),
  preferredEcoOption: z.enum(['standard', 'ev_optimized', 'bike_optimized', 'not_specified']).optional().default('not_specified').describe('Preferred eco-friendly routing option (e.g., standard, ev_optimized, bike_optimized). Defaults to not_specified.'),
  departureDateTime: z.string().optional().describe("Planned departure date and time in ISO format (e.g., '2024-07-30T10:00:00'). If not provided, assume 'now' for traffic and weather considerations."),
  userPreferences: z.string().optional().describe("User-specific routing preferences (e.g., 'avoid highways', 'prefer scenic route', 'no tolls')."),
});
export type GenerateRouteSimulationInput = z.infer<typeof GenerateRouteSimulationInputSchema>;

const GenerateRouteSimulationOutputSchema = z.object({
  optimizedRouteDescription: z.string().describe('Detailed turn-by-turn or segment-based description of the optimized route.'),
  estimatedDuration: z.string().describe('Estimated travel time for the route (e.g., "2 hours 30 minutes").'),
  estimatedDistance: z.string().describe('Estimated distance of the route (e.g., "150 km" or "90 miles").'),
  estimatedFuelConsumption: z.number().describe('Estimated fuel consumption for the route in liters (or kWh for EVs).'),
  estimatedCO2Emissions: z.number().describe('Estimated CO2 emissions for the route in kg.'),
  ecoFriendlySuggestion: z.string().optional().describe('A suggestion for a more eco-friendly alternative if applicable, or confirmation of eco-friendly choice.'),
  weatherForecastImpact: z.string().optional().describe("Summary of how current and forecasted weather (rain, snow, wind, temperature) might impact the journey, based on departure time and route duration. E.g., 'Light rain expected mid-journey, roads may be slick.'"),
  trafficConsiderations: z.string().optional().describe("Summary of how real-time traffic, typical peak/off-peak patterns, and weekend/weekday variations are factored into the route. E.g., 'Route avoids typical M5 peak traffic. Current A303 traffic is light.'"),
  routeWarnings: z.array(z.string()).optional().describe("Specific warnings about the route, such as 'Steep inclines on B3212, consider for heavy loads/EV range.' or 'Potential for road closures on A38 due to forecasted high winds.'"),
  otherRecommendations: z.array(z.string()).optional().describe("Other useful recommendations for the journey, like 'Consider a brief stop at Exeter Services for long journeys.' or 'Charge EV to 80% before departure for optimal range on this route.'"),
});
export type GenerateRouteSimulationOutput = z.infer<typeof GenerateRouteSimulationOutputSchema>;

export async function generateRouteSimulation(input: GenerateRouteSimulationInput): Promise<GenerateRouteSimulationOutput> {
  return generateRouteSimulationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdvancedRouteSimulationPrompt',
  input: {schema: GenerateRouteSimulationInputSchema},
  output: {schema: GenerateRouteSimulationOutputSchema},
  prompt: `You are an expert logistics and transportation planning AI. Your primary goal is to provide the user with the BEST and SHORTEST route, meticulously considering multiple dynamic factors.

  Analyze the journey from origin: {{{origin}}} to destination: {{{destination}}}.
  The vehicle is a {{{vehicleType}}} with a carrying capacity of {{{vehicleCapacity}}} kg.
  Environmental considerations specified: {{{environmentalConsiderations}}}.
  User's preferred eco-friendly option: {{{preferredEcoOption}}}.
  {{#if departureDateTime}}Planned departure date and time: {{{departureDateTime}}}.{{else}}Assume departure is 'now'.{{/if}}
  {{#if userPreferences}}User-specific preferences: {{{userPreferences}}}.{{/if}}

  Based on all the above, and simulating access to real-time and predictive data, please provide the following:

  1.  **Optimized Route Description**: A detailed, segment-based or turn-by-turn description of the recommended route. Be comprehensive.
  2.  **Estimated Duration**: The total estimated travel time.
  3.  **Estimated Distance**: The total estimated distance.
  4.  **Estimated Fuel Consumption**: In liters for combustion engines, or kWh for electric vehicles.
  5.  **Estimated CO2 Emissions**: In kg. For EVs, direct CO2 emissions during operation are 0 kg.
  6.  **Eco-Friendly Suggestion**:
      - If 'ev_optimized' was preferred and the vehicleType is electric or suitable, confirm this choice. If vehicleType is not electric, suggest it.
      - If 'bike_optimized' was preferred, confirm if suitable or explain if not (e.g., cargo bike for distance/capacity).
      - If 'standard' or 'not_specified' was preferred, analyze if a more eco-friendly option is viable (e.g., "Consider an electric van for this urban route," or "A cargo bike could be zero-emission for this short haul."). If current is optimal, state that.
      - Make it concise and actionable.
  7.  **Weather Forecast Impact**: Simulate current weather and forecast for the journey's duration (considering departureDateTime or 'now'). Mention significant weather (rain, snow, high winds, fog, extreme temperatures) and its potential impact on driving conditions, visibility, or journey time.
  8.  **Traffic Considerations**: Simulate real-time traffic conditions. Also, predict traffic patterns based on departure time (peak hours, off-peak), day of the week (weekday vs. weekend). Explain how the suggested route mitigates potential traffic issues or leverages favorable conditions.
  9.  **Route Warnings (Array of strings)**: List any specific warnings. Examples: "Steep inclines on [Road Name], may affect EV range or heavy vehicle performance.", "Section of [Road Name] prone to congestion during school drop-off/pick-up times if journey coincides.", "High winds forecasted for coastal section of the route, exercise caution." "Roadworks scheduled on [Road Name], minor delays possible." If no specific warnings, provide an empty array or omit.
  10. **Other Recommendations (Array of strings)**: Provide other useful, context-aware advice. Examples: "For this long journey, a rest stop at [Service Area Name] is advised around the halfway point.", "Ensure EV is charged to at least 80% for this route with limited charging infrastructure.", "Road surface on B-roads can be uneven, maintain moderate speed.", "Given the early morning departure, watch for potential frost on shaded road sections." If no specific recommendations, provide an empty array or omit.

  Prioritize safety, efficiency (time and cost), and adherence to user preferences. The route should be the "best and shortest" by balancing these factors.
  `,
});

const generateRouteSimulationFlow = ai.defineFlow(
  {
    name: 'generateAdvancedRouteSimulationFlow',
    inputSchema: GenerateRouteSimulationInputSchema,
    outputSchema: GenerateRouteSimulationOutputSchema,
  },
  async input => {
    // Add a default departureDateTime if not provided, to help AI reasoning about 'now'
    const enrichedInput = {
      ...input,
      departureDateTime: input.departureDateTime || new Date().toISOString(),
    };
    const {output} = await prompt(enrichedInput);
    return output!;
  }
);
