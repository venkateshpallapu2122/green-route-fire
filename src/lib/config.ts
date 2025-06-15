
export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

if (!GOOGLE_MAPS_API_KEY && typeof window !== 'undefined') {
  // This warning will appear in the browser console if the key is not set.
  console.warn(
    "Google Maps API key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env file (for local development) or in your Vercel project settings (for deployment). The map features may not work correctly without it."
  );
}
