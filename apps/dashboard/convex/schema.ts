import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("admin"),
      v.literal("event_company"),
      v.literal("provider"),
      v.literal("operator")
    ),
    companyId: v.optional(v.id("companies")),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  companies: defineTable({
    name: v.string(),
    type: v.union(v.literal("client"), v.literal("provider")),
    cnpj: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    region: v.optional(v.string()),
    capacity: v.optional(v.string()),
    rating: v.optional(v.number()),
    category: v.optional(v.string()), // e.g. "Solar", "Wind"
    createdAt: v.number(),
  }),

  events: defineTable({
    name: v.string(),
    status: v.union(
      v.literal("planning"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    startDate: v.number(),
    endDate: v.number(),
    location: v.string(),
    expectedAttendees: v.number(),
    estimatedConsumption: v.number(), // in kWh
    toleranceKwh: v.optional(v.number()), // Configurable tolerance
    companyId: v.id("companies"), // The event organizing company
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
    ratePerKwh: v.number(), // The agreed rate per kWh for this contract
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
  }).index("by_eventId", ["eventId"]),

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
});
