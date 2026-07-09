import { action } from "../_generated/server";
import { v } from "convex/values";
import { z } from "zod";

// Zod schema to validate external Open-Meteo payload structure
const WeatherResponseSchema = z.object({
  hourly: z.object({
    shortwave_radiation: z.array(z.number()),
  }),
});

// Simple in-memory Circuit Breaker state (persisted per-container lifespan)
let failureCount = 0;
let circuitOpenUntil = 0;

const FAILURE_THRESHOLD = 3;
const COOLDOWN_PERIOD_MS = 60000; // 1 minute cooldown

/**
 * Service to fetch weather data for energy simulations.
 * Uses Open-Meteo (Free, No API Key required).
 * Protected by Zod Validation and Circuit Breaker logic.
 */
export const getSolarData = action({
  args: {
    latitude: v.number(),
    longitude: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    if (now < circuitOpenUntil) {
      return {
        success: false,
        averageRadiation: 180, // Realistic average fallback
        unit: "W/m²",
        source: "Circuit Breaker Fallback (Open)",
        error: "Circuit is open due to persistent external API failures.",
      };
    }

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${args.latitude}&longitude=${args.longitude}&hourly=shortwave_radiation&forecast_days=1`
      );

      if (!response.ok) {
        throw new Error(`External API returned status ${response.status}`);
      }

      const rawData = await response.json();
      
      // Validate schema and prevent prototype pollution
      const parsedData = WeatherResponseSchema.safeParse(rawData);
      if (!parsedData.success) {
        throw new Error(`Invalid API schema: ${parsedData.error.message}`);
      }

      const data = parsedData.data;
      const radiationValues = data.hourly.shortwave_radiation;
      
      if (radiationValues.length === 0) {
        throw new Error("Empty shortwave radiation array from provider");
      }

      // Normalize data: Get average solar radiation for the day
      const averageRadiation = radiationValues.reduce((a, b) => a + b, 0) / radiationValues.length;

      // Reset failure tracker on success
      failureCount = 0;

      return {
        success: true,
        averageRadiation, // W/m²
        unit: "W/m²",
        source: "Open-Meteo",
      };
    } catch (error) {
      console.error("External API Error:", error);
      
      // Update Circuit Breaker failure counter
      failureCount++;
      if (failureCount >= FAILURE_THRESHOLD) {
        circuitOpenUntil = Date.now() + COOLDOWN_PERIOD_MS;
        console.warn(`Circuit Breaker OPENED until ${new Date(circuitOpenUntil).toISOString()} due to ${failureCount} consecutive failures.`);
      }

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
