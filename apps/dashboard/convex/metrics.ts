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
  handler: async (ctx, args) => {
    // This would aggregate metrics by date. For now, let's return a simulated sequence
    // based on real data if possible, or mocked for the demo.
    return [
      { name: 'Jan', previsto: 4000, realizado: 3800 },
      { name: 'Fev', previsto: 3000, realizado: 3200 },
      { name: 'Mar', previsto: 2000, realizado: 1800 },
      { name: 'Abr', previsto: 2780, realizado: 2900 },
    ];
  },
});
