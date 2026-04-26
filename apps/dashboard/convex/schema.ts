import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.optional(v.string()), // For custom auth if needed
    role: v.union(
      v.literal("admin"),
      v.literal("user"),
      v.literal("operator"),
      v.literal("provider"),
      v.literal("event_company")
    ),
    companyId: v.optional(v.id("companies")),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  projects: defineTable({
    userId: v.id("users"),
    name: v.string(),
    category: v.union(v.literal("Solar"), v.literal("Wind"), v.literal("Hydro"), v.literal("Biomass")),
    status: v.union(v.literal("active"), v.literal("in_analysis"), v.literal("completed")),
    location: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  metrics: defineTable({
    projectId: v.id("projects"),
    energyConsumption: v.number(), // in kWh
    savings: v.number(), // in currency unit
    environmentalImpact: v.number(), // e.g., kg of CO2 avoided
    timestamp: v.number(),
  }).index("by_projectId", ["projectId"]),

  auditLogs: defineTable({
    projectId: v.optional(v.id("projects")),
    userId: v.id("users"),
    action: v.string(), // e.g. "CREATE_PROJECT", "UPDATE_METRICS"
    details: v.any(),
    timestamp: v.number(),
  }).index("by_projectId", ["projectId"])
    .index("by_userId", ["userId"]),

  // Keep legacy tables for now to avoid breaking existing code
  companies: defineTable({
    name: v.string(),
    type: v.union(v.literal("client"), v.literal("provider")),
    cnpj: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    region: v.optional(v.string()),
    capacity: v.optional(v.string()),
    rating: v.optional(v.number()),
    category: v.optional(v.string()), 
    createdAt: v.number(),
  }),
  
  events: defineTable({
    name: v.string(),
    status: v.union(v.literal("planning"), v.literal("active"), v.literal("completed"), v.literal("cancelled")),
    startDate: v.number(),
    endDate: v.number(),
    location: v.string(),
    expectedAttendees: v.number(),
    estimatedConsumption: v.number(), 
    companyId: v.id("companies"), 
    createdAt: v.number(),
  }).index("by_companyId", ["companyId"]),

  contracts: defineTable({
    eventId: v.id("events"),
    providerCompanyId: v.id("companies"),
    clientCompanyId: v.id("companies"),
    status: v.union(
      v.literal("draft"),
      v.literal("pending_signatures"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("terminated")
    ),
    value: v.number(),
    ratePerKwh: v.optional(v.number()), // The agreed rate per kWh for this contract
    signedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_eventId", ["eventId"])
    .index("by_providerCompanyId", ["providerCompanyId"]),

  consumptions: defineTable({
    eventId: v.id("events"),
    predictedKwh: v.number(),
    actualKwh: v.optional(v.number()),
    isReconciled: v.optional(v.boolean()), // Track if financial adjustment was processed
    recordedAt: v.number(),
    createdAt: v.number(),
  }).index("by_eventId", ["eventId"]),

  financials: defineTable({
    eventId: v.optional(v.id("events")),
    contractId: v.optional(v.id("contracts")),
    type: v.union(v.literal("income"), v.literal("expense")),
    category: v.string(),
    amount: v.number(),
    status: v.union(v.literal("pending"), v.literal("paid"), v.literal("overdue"), v.literal("cancelled")),
    dueDate: v.number(),
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_eventId", ["eventId"])
    .index("by_contractId", ["contractId"]),

  documents: defineTable({
    name: v.string(),
    type: v.string(),
    url: v.string(), // Storage URL or external URL
    eventId: v.optional(v.id("events")),
    contractId: v.optional(v.id("contracts")),
    status: v.union(v.literal("pending_validation"), v.literal("valid"), v.literal("rejected")),
    uploadedBy: v.id("users"),
    uploadedAt: v.number(),
  }).index("by_eventId", ["eventId"])
    .index("by_contractId", ["contractId"]),
    
  proposals: defineTable({
    eventId: v.id("events"),
    providerCompanyId: v.id("companies"),
    value: v.number(),
    description: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected")),
    createdAt: v.number(),
  }).index("by_eventId", ["eventId"])
    .index("by_providerCompanyId", ["providerCompanyId"]),

  activityLog: defineTable({
    userId: v.id("users"),
    companyId: v.optional(v.id("companies")), // The company of the acting user
    action: v.string(), // e.g. "CREATED_EVENT", "UPDATED_CONSUMPTION"
    entityId: v.optional(v.string()),
    entityType: v.string(), // e.g. "event", "consumption", "financial"
    details: v.any(),
    createdAt: v.number(),
  }).index("by_companyId", ["companyId"]),
});
