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
