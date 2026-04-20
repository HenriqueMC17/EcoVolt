import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
      contracts = await ctx.db
        .query("contracts")
        .withIndex("by_clientCompanyId", (q) => q.eq("clientCompanyId", user.companyId))
        .order("desc")
        .collect();
    } else if (user.role === "provider") {
      contracts = await ctx.db
        .query("contracts")
        .withIndex("by_providerCompanyId", (q) => q.eq("providerCompanyId", user.companyId))
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

    return await ctx.db.insert("contracts", {
      eventId: args.eventId,
      providerCompanyId: args.providerCompanyId,
      clientCompanyId: args.clientCompanyId,
      value: args.value,
      ratePerKwh: args.ratePerKwh,
      status: args.status,
      createdAt: Date.now(),
    });
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

    return await ctx.db.patch(args.contractId, { status: args.status });
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
    const { contractId, userEmail, ...updateFields } = args;
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    const contract = await ctx.db.get(contractId);
    if (!contract) throw new Error("Contrato não encontrado");

    const isAuthorized = user && (
      user.role === "admin" || 
      user.role === "operator" || 
      user.companyId === contract.clientCompanyId
    );

    if (!isAuthorized) {
      throw new Error("Apenas o contratante, administrador ou operador pode editar os termos do contrato.");
    }

    return await ctx.db.patch(contractId, updateFields);
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

    return await ctx.db.delete(args.contractId);
  },
});

