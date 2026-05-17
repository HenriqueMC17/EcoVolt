import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  energyData: defineTable({
    machineId: v.string(),
    voltage: v.number(),
    current: v.number(),
    power: v.number(),
    status: v.string(),
    timestamp: v.number(),
  }).index('by_machine', ['machineId']),

  healthMetrics: defineTable({
    service: v.string(),
    status: v.string(),
    latencyMs: v.number(),
    lastChecked: v.number(),
  }).index('by_service', ['service']),
});
