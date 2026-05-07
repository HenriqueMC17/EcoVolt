import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { logActivityHelper } from "./activities";

export const getContracts = query({
  args: { userEmail: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    if (!user) return [];

    let contracts;
    if (user.role === "admin" || user.role === "operator") {
      contracts = await ctx.db.query("contracts").order("desc").collect();
    } else if (user.role === "event_company") {
      const companyId = user.companyId;
      if (!companyId) return [];
      contracts = await ctx.db
        .query("contracts")
        .withIndex("by_clientCompanyId", (q) => q.eq("clientCompanyId", companyId))
        .order("desc")
        .collect();
    } else if (user.role === "provider") {
      const companyId = user.companyId;
      if (!companyId) return [];
      contracts = await ctx.db
        .query("contracts")
        .withIndex("by_providerCompanyId", (q) => q.eq("providerCompanyId", companyId))
        .order("desc")
        .collect();
    } else {
      return [];
    }
    
    // Enrich with event and provider details
    const enrichedContracts = await Promise.all(
      contracts.map(async (contract) => {
        const event = await ctx.db.get(contract.eventId);
        const provider = await ctx.db.get(contract.providerCompanyId);
        
        return {
          ...contract,
          event: event ? event.name : "Desconhecido",
          provider: provider ? provider.name : "Desconhecido",
          energy: event ? `${event.estimatedConsumption} kWh` : "-",
        };
      })
    );
    
    return enrichedContracts;
  },
});

export const getContractByEventId = query({
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

    const contract = await ctx.db
      .query("contracts")
      .withIndex("by_eventId", (q) => q.eq("eventId", args.eventId))
      .unique();
    
    if (!contract) return null;

    // Check permissions
    if (user.role === "event_company" && user.companyId !== contract.clientCompanyId) {
      throw new Error("Permissão negada.");
    }
    
    const event = await ctx.db.get(contract.eventId);
    const provider = await ctx.db.get(contract.providerCompanyId);
    
    return {
      ...contract,
      eventName: event ? event.name : "Desconhecido",
      providerName: provider ? provider.name : "Desconhecido",
    };
  },
});

export const createContract = mutation({
  args: {
    eventId: v.id("events"),
    providerCompanyId: v.id("companies"),
    clientCompanyId: v.id("companies"),
    value: v.number(),
    ratePerKwh: v.number(),
    status: v.union(
      v.literal("draft"),
      v.literal("pending_signatures"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("terminated")
    ),
    userEmail: v.string(), 
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    if (!user || (user.role !== "event_company" && user.role !== "admin" && user.role !== "operator")) {
      throw new Error("Apenas administradores, operadores ou organizadores podem criar contratos.");
    }

    const contractId = await ctx.db.insert("contracts", {
      eventId: args.eventId,
      providerCompanyId: args.providerCompanyId,
      clientCompanyId: args.clientCompanyId,
      value: args.value,
      ratePerKwh: args.ratePerKwh,
      status: args.status,
      createdAt: Date.now(),
    });

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "CREATE_CONTRACT",
      entityId: contractId,
      entityType: "contracts",
      details: {
        eventId: args.eventId,
        providerCompanyId: args.providerCompanyId,
        value: args.value,
        ratePerKwh: args.ratePerKwh,
        summary: `Novo contrato criado para o evento ${args.eventId}. Valor: R$ ${args.value.toFixed(2)}.`,
      },
    });

    return contractId;
  },
});

export const updateContractStatus = mutation({
  args: {
    contractId: v.id("contracts"),
    status: v.union(
      v.literal("draft"),
      v.literal("pending_signatures"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("terminated")
    ),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    const contract = await ctx.db.get(args.contractId);
    if (!contract) throw new Error("Contrato não encontrado");

    const isAuthorized = user && (
      user.role === "admin" || 
      user.role === "operator" || 
      user.companyId === contract.clientCompanyId || 
      user.companyId === contract.providerCompanyId
    );

    if (!isAuthorized) {
      throw new Error("Permissão negada.");
    }

    await ctx.db.patch(args.contractId, { status: args.status });

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "UPDATE_CONTRACT_STATUS",
      entityId: args.contractId,
      entityType: "contracts",
      details: {
        previousStatus: contract.status,
        newStatus: args.status,
        summary: `Status do contrato alterado de ${contract.status} para ${args.status}.`,
      },
    });
  },
});

export const updateContract = mutation({
  args: {
    contractId: v.id("contracts"),
    eventId: v.id("events"),
    providerCompanyId: v.id("companies"),
    clientCompanyId: v.id("companies"),
    value: v.number(),
    ratePerKwh: v.number(),
    status: v.union(
      v.literal("draft"),
      v.literal("pending_signatures"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("terminated")
    ),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const contract = await ctx.db.get(args.contractId);
    if (!contract) throw new Error("Contrato não encontrado");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    if (!user) throw new Error("Usuário não encontrado");

    const isAuthorized = 
      user.role === "admin" || 
      user.role === "operator" || 
      user.companyId === contract.clientCompanyId;

    if (!isAuthorized) {
      throw new Error("Apenas o contratante, administrador ou operador pode editar os termos do contrato.");
    }

    await ctx.db.patch(args.contractId, {
      eventId: args.eventId,
      providerCompanyId: args.providerCompanyId,
      clientCompanyId: args.clientCompanyId,
      value: args.value,
      ratePerKwh: args.ratePerKwh,
      status: args.status,
    });

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "UPDATE_CONTRACT",
      entityId: args.contractId,
      entityType: "contracts",
      details: {
        summary: `Termos do contrato editados. Valor: R$ ${args.value.toFixed(2)}. Status: ${args.status}.`,
      },
    });
  },
});

export const removeContract = mutation({
  args: { 
    contractId: v.id("contracts"),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    if (!user || (user.role !== "admin" && user.role !== "operator")) {
      throw new Error("Apenas administradores ou operadores podem excluir contratos.");
    }

    const oldContract = await ctx.db.get(args.contractId);
    await ctx.db.delete(args.contractId);

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "REMOVE_CONTRACT",
      entityId: args.contractId,
      entityType: "contracts",
      details: {
        summary: `Contrato removido do sistema (Evento ID: ${oldContract?.eventId}).`,
      },
    });
  },
});

