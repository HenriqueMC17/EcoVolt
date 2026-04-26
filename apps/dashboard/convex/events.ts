import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { logActivityHelper } from "./activities";

export const getEvents = query({
  args: { userEmail: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    if (!user) return [];

    let events;
    if (user.role === "admin" || user.role === "operator") {
      events = await ctx.db.query("events").order("desc").collect();
    } else if (user.role === "event_company") {
      events = await ctx.db
        .query("events")
        .withIndex("by_companyId", (q) => q.eq("companyId", user.companyId))
        .order("desc")
        .collect();
    } else if (user.role === "provider") {
      // Providers can see events they have contracts for, or all if we want them to see opportunities
      // For now, let's keep it simple: see all if active/planning
      events = await ctx.db.query("events").order("desc").collect();
    } else {
      return [];
    }
    
    // Enrich with company name
    return await Promise.all(
      events.map(async (event) => {
        const company = await ctx.db.get(event.companyId);
        return {
          ...event,
          companyName: company ? company.name : "Desconhecida",
        };
      })
    );
  },
});

export const getEventById = query({
  args: { 
    eventId: v.id("events"),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    if (!user) throw new Error("Unauthorized");

    const event = await ctx.db.get(args.eventId);
    if (!event) return null;

    if (user.role === "event_company" && user.companyId !== event.companyId) {
      throw new Error("Permissão negada para este evento.");
    }
    
    // Add logic for provider if needed (e.g. must have contract)
    
    return event;
  },
});

export const createEvent = mutation({
  args: {
    name: v.string(),
    status: v.union(v.literal("planning"), v.literal("active"), v.literal("completed"), v.literal("cancelled")),
    startDate: v.number(),
    endDate: v.number(),
    location: v.string(),
    expectedAttendees: v.number(),
    estimatedConsumption: v.number(),
    toleranceKwh: v.optional(v.number()),
    companyId: v.id("companies"),
    userEmail: v.string(), 
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    if (!user || (user.role !== "event_company" && user.role !== "admin" && user.role !== "operator")) {
      throw new Error("Permissão negada para criar eventos.");
    }

    if (user.role === "event_company" && user.companyId !== args.companyId) {
      throw new Error("Você só pode criar eventos para a sua própria empresa.");
    }

    if (args.startDate >= args.endDate) {
      throw new Error("A data de início deve ser anterior à data de término.");
    }

    if (args.expectedAttendees <= 0) {
      throw new Error("O número de participantes esperados deve ser maior que zero.");
    }

    if (args.estimatedConsumption <= 0) {
      throw new Error("O consumo estimado deve ser maior que zero.");
    }

    const eventId = await ctx.db.insert("events", {
      name: args.name,
      status: args.status,
      startDate: args.startDate,
      endDate: args.endDate,
      location: args.location,
      expectedAttendees: args.expectedAttendees,
      estimatedConsumption: args.estimatedConsumption,
      toleranceKwh: args.toleranceKwh,
      companyId: args.companyId,
      createdAt: Date.now(),
    });

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "CREATE_EVENT",
      entityId: eventId,
      entityType: "event",
      details: {
        name: args.name,
        status: args.status,
        startDate: args.startDate,
        endDate: args.endDate,
        summary: `Criou o evento "${args.name}"`,
      },
    });

    return eventId;
  },
});

export const updateEventStatus = mutation({
  args: {
    eventId: v.id("events"),
    status: v.union(v.literal("planning"), v.literal("active"), v.literal("completed"), v.literal("cancelled")),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Evento não encontrado");

    if (!user || (user.role !== "event_company" && user.role !== "admin" && user.role !== "operator")) {
      throw new Error("Permissão negada.");
    }

    if (user.role === "event_company" && user.companyId !== event.companyId) {
      throw new Error("Permissão negada para este evento.");
    }

    await ctx.db.patch(args.eventId, { status: args.status });

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "UPDATE_EVENT_STATUS",
      entityId: args.eventId,
      entityType: "event",
      details: {
        previousStatus: event.status,
        newStatus: args.status,
        summary: `Alterou o status do evento "${event.name}" de ${event.status} para ${args.status}`,
      },
    });
  },
});

export const updateEvent = mutation({
  args: {
    eventId: v.id("events"),
    name: v.string(),
    status: v.union(v.literal("planning"), v.literal("active"), v.literal("completed"), v.literal("cancelled")),
    startDate: v.number(),
    endDate: v.number(),
    location: v.string(),
    expectedAttendees: v.number(),
    estimatedConsumption: v.number(),
    toleranceKwh: v.optional(v.number()),
    companyId: v.id("companies"),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const { eventId, userEmail, ...updateFields } = args;
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    const event = await ctx.db.get(eventId);
    if (!event) throw new Error("Evento não encontrado");

    if (!user || (user.role !== "event_company" && user.role !== "admin" && user.role !== "operator")) {
      throw new Error("Permissão negada.");
    }

    if (user.role === "event_company" && user.companyId !== event.companyId) {
      throw new Error("Permissão negada para este evento.");
    }

    if (updateFields.startDate >= updateFields.endDate) {
      throw new Error("A data de início deve ser anterior à data de término.");
    }

    if (updateFields.expectedAttendees <= 0) {
      throw new Error("O número de participantes esperados deve ser maior que zero.");
    }

    if (updateFields.estimatedConsumption <= 0) {
      throw new Error("O consumo estimado deve ser maior que zero.");
    }

    await ctx.db.patch(eventId, updateFields);

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "UPDATE_EVENT",
      entityId: eventId,
      entityType: "event",
      details: {
        updates: updateFields,
        summary: `Atualizou os dados do evento "${updateFields.name}"`,
      },
    });

    return eventId;
  },
});


export const removeEvent = mutation({
  args: { 
    eventId: v.id("events"),
    userEmail: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Evento não encontrado");

    if (!user || (user.role !== "admin" && user.role !== "operator" && (user.role !== "event_company" || user.companyId !== event.companyId))) {
      throw new Error("Permissão negada para excluir este evento.");
    }

    const contracts = await ctx.db
      .query("contracts")
      .withIndex("by_eventId", (q) => q.eq("eventId", args.eventId))
      .collect();
    
    if (contracts.length > 0) {
      throw new Error("Não é possível excluir um evento que possui contratos vinculados.");
    }

    await ctx.db.delete(args.eventId);

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "REMOVE_EVENT",
      entityId: args.eventId,
      entityType: "event",
      details: {
        deletedRecord: event,
        summary: `Removeu o evento "${event.name}"`,
      },
    });

    return args.eventId;
  },
});

export const getEventStats = query({
  args: { userEmail: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    if (!user) throw new Error("Unauthorized");

    let events;
    if (user.role === "admin" || user.role === "operator") {
      events = await ctx.db.query("events").collect();
    } else if (user.role === "event_company") {
      events = await ctx.db
        .query("events")
        .withIndex("by_companyId", (q) => q.eq("companyId", user.companyId))
        .collect();
    } else if (user.role === "provider") {
      events = await ctx.db.query("events").collect(); // Or filter by active contracts
    } else {
      return { planning: 0, active: 0, completed: 0, cancelled: 0, total: 0 };
    }

    const stats: Record<string, number> = {
      planning: 0,
      active: 0,
      completed: 0,
      cancelled: 0,
    };
    
    events.forEach(event => {
      stats[event.status]++;
    });
    
    return {
      ...stats,
      total: events.length
    };
  },
});
