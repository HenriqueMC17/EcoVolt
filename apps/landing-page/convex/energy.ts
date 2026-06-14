import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const getMachineData = query({
  args: { machineId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('energyData')
      .withIndex('by_machine', (q) => q.eq('machineId', args.machineId))
      .order('desc')
      .take(args.limit || 50);
  },
});

export const insertEnergyData = mutation({
  args: {
    machineId: v.string(),
    voltage: v.number(),
    current: v.number(),
    power: v.number(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('energyData', {
      ...args,
      timestamp: Date.now(),
    });
    return id;
  },
});

export const generateMockTelemetry = mutation({
  args: {
    machineId: v.string(),
    voltage: v.number(),
    current: v.number(),
    power: v.number(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('energyData', {
      ...args,
      timestamp: Date.now(),
    });
    return id;
  },
});

export const clearMachineData = mutation({
  args: { machineId: v.string() },
  handler: async (ctx, args) => {
    const records = await ctx.db
      .query('energyData')
      .withIndex('by_machine', (q) => q.eq('machineId', args.machineId))
      .collect();
    for (const record of records) {
      await ctx.db.delete(record._id);
    }
    return { success: true };
  },
});

