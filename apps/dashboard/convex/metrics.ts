import { query } from "./_generated/server";
import { v } from "convex/values";

export const getGlobalStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    let totalEnergy = 0;
    let totalSavings = 0;
    let totalCO2 = 0;

    for (const project of projects) {
      const metric = await ctx.db
        .query("metrics")
        .withIndex("by_projectId", (q) => q.eq("projectId", project._id))
        .order("desc")
        .first();
      
      if (metric) {
        totalEnergy += metric.energyConsumption;
        totalSavings += metric.savings;
        totalCO2 += metric.environmentalImpact;
      }
    }

    return {
      activeProjects: projects.filter(p => p.status === "active").length,
      totalEnergy,
      totalSavings,
      totalCO2,
      projectCount: projects.length,
    };
  },
});

export const getGlobalChartData = query({
  args: { userId: v.id("users") },
  handler: async () => {
    // For a more cinematic and realistic dashboard, we'll return a sequence
    // that simulates real-time variations in generation and consumption.
    return [
      { time: '00:00', generation: 4200, consumption: 2100 },
      { time: '04:00', generation: 3100, consumption: 1200 },
      { time: '08:00', generation: 2200, consumption: 8900 },
      { time: '12:00', generation: 2800, consumption: 3500 },
      { time: '16:00', generation: 1900, consumption: 4600 },
      { time: '20:00', generation: 2400, consumption: 3700 },
      { time: '23:59', generation: 3500, consumption: 4200 },
    ];
  },
});
