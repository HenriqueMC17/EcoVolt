import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const ping = query({
  args: {},
  handler: async () => {
    return { ok: true, timestamp: Date.now() };
  },
});

export const updateHealth = mutation({
  args: {
    service: v.string(),
    status: v.string(),
    latencyMs: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('healthMetrics')
      .withIndex('by_service', (q) => q.eq('service', args.service))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: args.status,
        latencyMs: args.latencyMs,
        lastChecked: Date.now(),
      });
      return existing._id;
    } else {
      const id = await ctx.db.insert('healthMetrics', {
        service: args.service,
        status: args.status,
        latencyMs: args.latencyMs,
        lastChecked: Date.now(),
      });
      return id;
    }
  },
});
