import { action } from "../_generated/server";
import { v } from "convex/values";

/**
 * Service to fetch weather data for energy simulations.
 * Uses Open-Meteo (Free, No API Key required).
 */
export const getSolarData = action({
  args: {
    latitude: v.number(),
    longitude: v.number(),
  },
  handler: async (ctx, args) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${args.latitude}&longitude=${args.longitude}&hourly=shortwave_radiation&forecast_days=1`
      );

      if (!response.ok) {
        throw new Error(`External API returned status ${response.status}`);
      }

      const data = await response.json();
      
      // Normalize data: Get average solar radiation for the day
      const radiationValues = data.hourly.shortwave_radiation as number[];
      const averageRadiation = radiationValues.reduce((a, b) => a + b, 0) / radiationValues.length;

      return {
        success: true,
        averageRadiation, // W/m²
        unit: "W/m²",
        source: "Open-Meteo",
      };
    } catch (error) {
      console.error("External API Error:", error);
      
      // Fallback: Return realistic simulated data
      return {
        success: false,
        averageRadiation: 180, // Realistic average fallback
        unit: "W/m²",
        source: "Simulated Fallback",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
