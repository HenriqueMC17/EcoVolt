import { action } from "../_generated/server";
import { getSolarData } from "../external/weather";
import { v } from "convex/values";

/**
 * Service Layer: Business logic for energy calculations.
 */
export const energyService = {
  /**
   * Calculates the estimated monthly generation based on capacity and solar radiation.
   */
  calculateSolarGeneration: (capacityKw: number, averageRadiation: number) => {
    // Basic formula: Capacity (kW) * Avg Radiation (W/m2) * efficiency * hours
    const efficiency = 0.15; // 15% efficiency
    const hoursPerDay = 5; // Standard peak sun hours
    const dailyGeneration = capacityKw * (averageRadiation / 1000) * efficiency * hoursPerDay * 24; 
    return dailyGeneration * 30; // Monthly
  },

  /**
   * Calculates financial savings.
   */
  calculateSavings: (generationKwh: number, ratePerKwh: number) => {
    return generationKwh * ratePerKwh;
  },

  /**
   * Calculates CO2 avoided (kg).
   * Average Brazil: 0.088 kg CO2/kWh
   */
  calculateEnvironmentalImpact: (generationKwh: number) => {
    const co2Factor = 0.088; 
    return generationKwh * co2Factor;
  },

  /**
   * Generates a complete simulation scenario.
   */
  generateSimulation: (params: {
    capacityKw: number;
    radiation: number;
    rate: number;
  }) => {
    const generation = energyService.calculateSolarGeneration(params.capacityKw, params.radiation);
    const savings = energyService.calculateSavings(generation, params.rate);
    const impact = energyService.calculateEnvironmentalImpact(generation);

    return {
      monthlyGeneration: generation,
      monthlySavings: savings,
      co2Avoided: impact,
      paybackYears: (params.capacityKw * 5000) / (savings * 12), // Assuming cost is $5000 per kW
    };
  }
};

/**
 * Convex Action exposing simulation logic to the UI.
 */
export const simulate = action({
  args: {
    latitude: v.number(),
    longitude: v.number(),
    capacityKw: v.number(),
    rate: v.number(),
  },
  handler: async (ctx, args) => {
    // 1. Fetch real weather data from Open-Meteo using the weather action
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const weather = await ctx.runAction(getSolarData as any, {
      latitude: args.latitude,
      longitude: args.longitude,
    });

    // 2. Perform the simulation calculations using the domain service
    const results = energyService.generateSimulation({
      capacityKw: args.capacityKw,
      radiation: weather.averageRadiation,
      rate: args.rate,
    });

    return {
      success: true,
      weather,
      generation: results.monthlyGeneration.toFixed(2),
      savings: results.monthlySavings.toFixed(2),
      co2: results.co2Avoided.toFixed(2),
      paybackYears: results.paybackYears.toFixed(1),
    };
  },
});
