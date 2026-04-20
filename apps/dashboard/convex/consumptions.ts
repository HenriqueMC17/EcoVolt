import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getConsumptions = query({
  args: { userEmail: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    if (!user) return [];

    let consumptions;
    if (user.role === "admin" || user.role === "operator") {
      consumptions = await ctx.db.query("consumptions").order("desc").collect();
    } else if (user.role === "event_company") {
      // Find events for this company
      const events = await ctx.db
        .query("events")
        .withIndex("by_companyId", (q) => q.eq("companyId", user.companyId))
        .collect();
      
      const consumptionsList = await Promise.all(
        events.map(event => 
          ctx.db
            .query("consumptions")
            .withIndex("by_eventId", (q) => q.eq("eventId", event._id))
            .collect()
        )
      );
      consumptions = consumptionsList.flat().sort((a, b) => b.createdAt - a.createdAt);
    } else if (user.role === "provider") {
      // Find contracts for this provider to get event IDs
      const contracts = await ctx.db
        .query("contracts")
        .withIndex("by_providerCompanyId", (q) => q.eq("providerCompanyId", user.companyId))
        .collect();
      
      const consumptionsList = await Promise.all(
        contracts.map(contract => 
          ctx.db
            .query("consumptions")
            .withIndex("by_eventId", (q) => q.eq("eventId", contract.eventId))
            .collect()
        )
      );
      consumptions = consumptionsList.flat().sort((a, b) => b.createdAt - a.createdAt);
    } else {
      return [];
    }
    
    // Enrich with event data
    return Promise.all(consumptions.map(async (cons) => {
      const event = await ctx.db.get(cons.eventId);
      const tolerance = event?.toleranceKwh ?? 5;
      
      const difference = cons.actualKwh ? cons.actualKwh - cons.predictedKwh : 0;
      let status = "Dentro da Tolerância";
      let action = "Pronto para fechar";
      
      if (difference > tolerance) {
        status = "Consumo Excedente";
        action = "Cobrança adicional";
      } else if (difference < -tolerance) {
        status = "Consumo Inferior";
        action = "Reembolso pendente";
      }

      return { 
        ...cons, 
        eventName: event ? event.name : "Desconhecido",
        difference,
        status,
        action,
        isReconciled: cons.isReconciled ?? false
      };
    }));
  },
});

export const createConsumption = mutation({
  args: {
    eventId: v.id("events"),
    predictedKwh: v.number(),
    actualKwh: v.optional(v.number()),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    if (!user || (user.role !== "admin" && user.role !== "operator")) {
      throw new Error("Apenas administradores e operadores podem registrar consumo.");
    }

    return await ctx.db.insert("consumptions", {
      eventId: args.eventId,
      predictedKwh: args.predictedKwh,
      actualKwh: args.actualKwh,
      recordedAt: Date.now(),
      createdAt: Date.now(),
    });
  }
});

export const updateActualConsumption = mutation({
  args: {
    consumptionId: v.id("consumptions"),
    actualKwh: v.number(),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    if (!user || (user.role !== "admin" && user.role !== "operator")) {
      throw new Error("Apenas administradores e operadores podem atualizar o consumo real.");
    }

    return await ctx.db.patch(args.consumptionId, { actualKwh: args.actualKwh, recordedAt: Date.now() });
  }
});

export const updateConsumption = mutation({
  args: {
    id: v.id("consumptions"),
    predictedKwh: v.optional(v.number()),
    actualKwh: v.optional(v.number()),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    if (!user || (user.role !== "admin" && user.role !== "operator")) {
      throw new Error("Apenas administradores e operadores podem editar registros de consumo.");
    }

    const { id, userEmail, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const removeConsumption = mutation({
  args: { 
    id: v.id("consumptions"),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    if (!user || user.role !== "admin") {
      throw new Error("Apenas administradores podem excluir registros de consumo.");
    }

    await ctx.db.delete(args.id);
  },
});

export const getConsumptionChartData = query({
  args: { userEmail: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    if (!user) return [];

    let consumptions;
    if (user.role === "admin" || user.role === "operator") {
      consumptions = await ctx.db.query("consumptions").order("desc").collect();
    } else if (user.role === "event_company") {
      const events = await ctx.db
        .query("events")
        .withIndex("by_companyId", (q) => q.eq("companyId", user.companyId))
        .collect();
      const consumptionsList = await Promise.all(
        events.map(event => 
          ctx.db
            .query("consumptions")
            .withIndex("by_eventId", (q) => q.eq("eventId", event._id))
            .collect()
        )
      );
      consumptions = consumptionsList.flat();
    } else if (user.role === "provider") {
      const contracts = await ctx.db
        .query("contracts")
        .withIndex("by_providerCompanyId", (q) => q.eq("providerCompanyId", user.companyId))
        .collect();
      const consumptionsList = await Promise.all(
        contracts.map(contract => 
          ctx.db
            .query("consumptions")
            .withIndex("by_eventId", (q) => q.eq("eventId", contract.eventId))
            .collect()
        )
      );
      consumptions = consumptionsList.flat();
    } else {
      return [];
    }

    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const monthlyMap: Record<string, { previsto: number; realizado: number }> = {};

    consumptions.forEach(c => {
      const date = new Date(c.createdAt);
      const monthName = months[date.getMonth()];
      if (!monthlyMap[monthName]) {
        monthlyMap[monthName] = { previsto: 0, realizado: 0 };
      }
      monthlyMap[monthName].previsto += c.predictedKwh;
      monthlyMap[monthName].realizado += c.actualKwh ?? 0;
    });

    return Object.entries(monthlyMap).map(([name, data]) => ({
      name,
      ...data
    })).reverse(); 
  }
});
