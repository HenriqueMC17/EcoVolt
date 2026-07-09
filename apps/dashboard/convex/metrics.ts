import { query } from "./_generated/server";
import { v } from "convex/values";
import { resolveUser } from "./users";


export const getGlobalStats = query({
  args: { 
    userId: v.optional(v.string()), 
    timeRange: v.optional(v.union(v.literal("24h"), v.literal("7d"), v.literal("30d"), v.literal("12m"))) 
  },
  handler: async (ctx, args) => {
    const userId = await resolveUser(ctx, args.userId);
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    let totalEnergy = 0;
    let totalSavings = 0;
    let totalCO2 = 0;

    // Temporal Filter Boundaries
    let rangeStart = 0;
    const now = Date.now();
    const range = args.timeRange || "30d";

    if (range === "24h") rangeStart = now - (24 * 60 * 60 * 1000);
    else if (range === "7d") rangeStart = now - (7 * 24 * 60 * 60 * 1000);
    else if (range === "30d") rangeStart = now - (30 * 24 * 60 * 60 * 1000);
    else if (range === "12m") rangeStart = now - (365 * 24 * 60 * 60 * 1000);

    // Fetch all project metrics concurrently to resolve N+1 tables scan queries
    const metricsPromises = projects.map((p) =>
      ctx.db
        .query("metrics")
        .withIndex("by_projectId", (q) => q.eq("projectId", p._id))
        .collect()
    );

    const allMetrics = await Promise.all(metricsPromises);

    for (let i = 0; i < projects.length; i++) {
      const projectMetrics = allMetrics[i];
      const filteredMetrics = rangeStart > 0 
        ? projectMetrics.filter(m => m.timestamp >= rangeStart)
        : projectMetrics;

      for (const metric of filteredMetrics) {
        totalEnergy += metric.energyConsumption;
        totalSavings += metric.savings;
        totalCO2 += metric.environmentalImpact;
      }
    }

    return {
      activeProjects: projects.filter(p => p.status === "active").length,
      totalEnergy: Math.round(totalEnergy),
      totalSavings: Math.round(totalSavings),
      totalCO2: Math.round(totalCO2),
      projectCount: projects.length,
    };
  },
});

export const getGlobalChartData = query({
  args: { 
    userId: v.optional(v.string()), 
    timeRange: v.optional(v.union(v.literal("24h"), v.literal("7d"), v.literal("30d"), v.literal("12m"))) 
  },
  handler: async (ctx, args) => {
    // Resolve user to ensure active session/authorization
    await resolveUser(ctx, args.userId);

    const range = args.timeRange || "30d";

    if (range === "24h") {
      const data = [];
      const currentHour = new Date().getHours();
      for (let i = 23; i >= 0; i--) {
        const hour = (currentHour - i + 24) % 24;
        const hourStr = `${hour.toString().padStart(2, "0")}:00`;
        const factor = Math.max(0.1, 1 - Math.abs(hour - 13) / 10);
        const previsto = Math.round(300 + factor * 500 + Math.random() * 50);
        const realizado = Math.round(previsto * (0.92 + Math.random() * 0.15));
        data.push({ name: hourStr, previsto, realizado });
      }
      return data;
    }

    if (range === "7d") {
      const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
      const data = [];
      const today = new Date().getDay();
      for (let i = 6; i >= 0; i--) {
        const dayIdx = (today - i + 7) % 7;
        const previsto = Math.round(3200 + Math.random() * 800);
        const realizado = Math.round(previsto * (0.95 + Math.random() * 0.1));
        data.push({ name: weekdays[dayIdx], previsto, realizado });
      }
      return data;
    }

    if (range === "30d") {
      const data = [];
      for (let i = 30; i > 0; i -= 3) {
        const day = new Date(Date.now() - (i * 24 * 60 * 60 * 1000));
        const dateStr = `${day.getDate()}/${day.getMonth() + 1}`;
        const previsto = Math.round(3800 + Math.random() * 1000);
        const realizado = Math.round(previsto * (0.94 + Math.random() * 0.12));
        data.push({ name: dateStr, previsto, realizado });
      }
      return data;
    }

    // Default "12m" range
    return [
      { name: 'Jan', previsto: 4500, realizado: 4200 },
      { name: 'Fev', previsto: 4600, realizado: 4800 },
      { name: 'Mar', previsto: 4800, realizado: 4400 },
      { name: 'Abr', previsto: 5000, realizado: 5200 },
      { name: 'Mai', previsto: 5200, realizado: 4900 },
      { name: 'Jun', previsto: 5500, realizado: 5600 },
      { name: 'Jul', previsto: 5800, realizado: 5400 },
      { name: 'Ago', previsto: 6000, realizado: 6100 },
      { name: 'Set', previsto: 5900, realizado: 5800 },
      { name: 'Out', previsto: 5700, realizado: 5900 },
      { name: 'Nov', previsto: 5500, realizado: 5300 },
      { name: 'Dez', previsto: 5800, realizado: 6000 },
    ];
  },
});

