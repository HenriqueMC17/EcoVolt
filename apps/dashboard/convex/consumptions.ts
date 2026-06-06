import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { logActivityHelper } from "./activities";

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
        .withIndex("by_companyId", (q) => q.eq("companyId", user.companyId!))
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
        .withIndex("by_providerCompanyId", (q) => q.eq("providerCompanyId", user.companyId!))
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
      const tolerance = (event as Record<string, unknown> & { toleranceKwh?: number })?.toleranceKwh ?? 5;
      
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
        eventName: event ? (event as Record<string, unknown> & { name?: string }).name ?? "Desconhecido" : "Desconhecido",
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

    if (args.predictedKwh < 0) {
      throw new Error("O consumo previsto não pode ser negativo.");
    }
    if (args.actualKwh !== undefined && args.actualKwh < 0) {
      throw new Error("O consumo real não pode ser negativo.");
    }

    const consumptionId = await ctx.db.insert("consumptions", {
      eventId: args.eventId,
      predictedKwh: args.predictedKwh,
      actualKwh: args.actualKwh,
      isReconciled: false,
      recordedAt: Date.now(),
      createdAt: Date.now(),
    });

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "CREATE_CONSUMPTION",
      entityId: consumptionId,
      entityType: "consumptions",
      details: {
        eventId: args.eventId,
        predictedKwh: args.predictedKwh,
        actualKwh: args.actualKwh,
        summary: `Novo registro de consumo para o evento ${args.eventId}. Previsto: ${args.predictedKwh}kWh.`,
      },
    });

    return consumptionId;
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

    if (args.actualKwh < 0) {
      throw new Error("O consumo real não pode ser negativo.");
    }

    const oldConsumption = await ctx.db.get(args.consumptionId);
    await ctx.db.patch(args.consumptionId, { actualKwh: args.actualKwh, recordedAt: Date.now() });

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "UPDATE_ACTUAL_CONSUMPTION",
      entityId: args.consumptionId,
      entityType: "consumptions",
      details: {
        previousActual: oldConsumption?.actualKwh,
        newActual: args.actualKwh,
        summary: `Consumo real atualizado de ${oldConsumption?.actualKwh ?? 0}kWh para ${args.actualKwh}kWh.`,
      },
    });
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
    const updates = { ...args };
    delete (updates as Record<string, unknown>).id;
    delete (updates as Record<string, unknown>).userEmail;
    await ctx.db.patch(args.id, updates);

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "UPDATE_CONSUMPTION",
      entityId: args.id,
      entityType: "consumptions",
      details: {
        updates,
        summary: "Registro de consumo editado.",
      },
    });
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

    const oldConsumption = await ctx.db.get(args.id);
    await ctx.db.delete(args.id);

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "REMOVE_CONSUMPTION",
      entityId: args.id,
      entityType: "consumptions",
      details: {
        deletedRecord: oldConsumption,
        summary: "Registro de consumo removido.",
      },
    });
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
        .withIndex("by_companyId", (q) => q.eq("companyId", user.companyId!))
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
        .withIndex("by_providerCompanyId", (q) => q.eq("providerCompanyId", user.companyId!))
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

export const getConsumptionByEventId = query({
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

    // Check permissions
    if (user.role === "event_company" && user.companyId !== event.companyId) {
      throw new Error("Permissão negada.");
    }

    const consumptions = await ctx.db
      .query("consumptions")
      .withIndex("by_eventId", (q) => q.eq("eventId", args.eventId))
      .order("asc")
      .collect();
    
    return consumptions.map(c => ({
      ...c,
      day: new Date(c.recordedAt).toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' }),
    }));
  },
});
