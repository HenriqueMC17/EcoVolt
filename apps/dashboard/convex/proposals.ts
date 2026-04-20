import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getProposals = query({
  args: { 
    eventId: v.optional(v.id("events")),
    providerCompanyId: v.optional(v.id("companies")),
    userEmail: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    let proposals;

    if (args.userEmail) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.userEmail!))
        .unique();
      
      if (!user) return [];

      if (user.role === "admin") {
        proposals = await ctx.db.query("proposals").order("desc").collect();
      } else if (user.role === "provider") {
        proposals = await ctx.db
          .query("proposals")
          .withIndex("by_providerCompanyId", (q) => q.eq("providerCompanyId", user.companyId))
          .order("desc")
          .collect();
      } else if (user.role === "event_company") {
        // Find events owned by this company
        const events = await ctx.db
          .query("events")
          .withIndex("by_companyId", (q) => q.eq("companyId", user.companyId))
          .collect();
        
        const eventIds = events.map(e => e._id);
        
        // This is a bit expensive in Convex without a direct "by_eventId_list" index, 
        // but for now we'll collect and filter or query per event if small.
        // Better: Query all proposals and filter by event ownership.
        const allProposals = await ctx.db.query("proposals").collect();
        proposals = allProposals.filter(p => eventIds.includes(p.eventId));
      } else {
        return [];
      }
    } else {
      let proposalsQuery = ctx.db.query("proposals");

      if (args.eventId) {
        proposalsQuery = ctx.db.query("proposals").withIndex("by_eventId", q => q.eq("eventId", args.eventId!));
      } else if (args.providerCompanyId) {
        proposalsQuery = ctx.db.query("proposals").withIndex("by_providerCompanyId", q => q.eq("providerCompanyId", args.providerCompanyId!));
      }
      proposals = await proposalsQuery.collect();
    }
    
    // Join with related data
    return await Promise.all(proposals.map(async (p) => {
      const event = await ctx.db.get(p.eventId);
      const provider = await ctx.db.get(p.providerCompanyId);
      return {
        ...p,
        eventName: event?.name || "Desconhecido",
        providerName: provider?.name || "Desconhecido",
      };
    }));
  },
});

export const createProposal = mutation({
  args: {
    eventId: v.id("events"),
    providerCompanyId: v.id("companies"),
    value: v.number(),
    description: v.optional(v.string()),
    userEmail: v.string(), // For mock validation
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    if (!user || user.role !== "provider") {
      throw new Error("Apenas provedores de energia podem enviar propostas.");
    }

    if (user.companyId !== args.providerCompanyId) {
      throw new Error("Usuário não pertence à empresa provedora informada.");
    }

    return await ctx.db.insert("proposals", {
      eventId: args.eventId,
      providerCompanyId: args.providerCompanyId,
      value: args.value,
      description: args.description,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const acceptProposal = mutation({
  args: { 
    proposalId: v.id("proposals"),
    userEmail: v.string(), // For mock validation
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    if (!user || (user.role !== "event_company" && user.role !== "admin")) {
      throw new Error("Permissão negada para aceitar propostas.");
    }

    const proposal = await ctx.db.get(args.proposalId);
    if (!proposal) throw new Error("Proposta não encontrada");
    if (proposal.status !== "pending") throw new Error("Apenas propostas pendentes podem ser aceitas");

    const event = await ctx.db.get(proposal.eventId);
    if (!event) throw new Error("Evento não encontrado");

    // Validate that the user belongs to the company organizing the event
    if (user.role === "event_company" && user.companyId !== event.companyId) {
      throw new Error("Você só pode aceitar propostas para os seus próprios eventos.");
    }

    // Update proposal status
    await ctx.db.patch(args.proposalId, { status: "accepted" });

    // Reject all other proposals for this event
    const otherProposals = await ctx.db
      .query("proposals")
      .withIndex("by_eventId", (q) => q.eq("eventId", proposal.eventId))
      .collect();
    
    for (const p of otherProposals) {
      if (p._id !== args.proposalId && p.status === "pending") {
        await ctx.db.patch(p._id, { status: "rejected" });
      }
    }

    // Create contract
    return await ctx.db.insert("contracts", {
      eventId: proposal.eventId,
      providerCompanyId: proposal.providerCompanyId,
      clientCompanyId: event.companyId,
      status: "draft",
      value: proposal.value,
      createdAt: Date.now(),
    });
  },
});

export const rejectProposal = mutation({
  args: { 
    proposalId: v.id("proposals"),
    userEmail: v.string(), 
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    if (!user || (user.role !== "event_company" && user.role !== "admin")) {
      throw new Error("Permissão negada para recusar propostas.");
    }

    const proposal = await ctx.db.get(args.proposalId);
    if (!proposal) throw new Error("Proposta não encontrada");

    const event = await ctx.db.get(proposal.eventId);
    if (!event && user.role !== "admin") throw new Error("Evento não encontrado");

    if (user.role === "event_company" && event && user.companyId !== event.companyId) {
      throw new Error("Você só pode recusar propostas para os seus próprios eventos.");
    }

    await ctx.db.patch(args.proposalId, { status: "rejected" });
  },
});

