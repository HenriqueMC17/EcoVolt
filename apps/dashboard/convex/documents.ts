import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getDocuments = query({
  args: {
    eventId: v.optional(v.id("events")),
    contractId: v.optional(v.id("contracts")),
  },
  handler: async (ctx, args) => {
    const docs = await (
      args.eventId 
        ? ctx.db.query("documents").withIndex("by_eventId", (q) => q.eq("eventId", args.eventId))
        : args.contractId
        ? ctx.db.query("documents").withIndex("by_contractId", (q) => q.eq("contractId", args.contractId))
        : ctx.db.query("documents")
    ).order("desc").collect();
    
    // Enrich with event data
    return Promise.all(docs.map(async (doc) => {
      let eventName = "-";
      if (doc.eventId) {
        const event = await ctx.db.get(doc.eventId);
        eventName = event ? event.name : "Desconhecido";
      } else if (doc.contractId) {
        const contract = await ctx.db.get(doc.contractId);
        if (contract && contract.eventId) {
          const event = await ctx.db.get(contract.eventId);
          eventName = event ? event.name : "Desconhecido";
        }
      }
      return { ...doc, eventName };
    }));
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const createDocument = mutation({
  args: {
    name: v.string(),
    type: v.string(), // "Jurídico", "Financeiro", "Operacional", "Regulatório"
    url: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    eventId: v.optional(v.id("events")),
    contractId: v.optional(v.id("contracts")),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const currentUser = users[0];
    
    if (!currentUser) throw new Error("Usuário não encontrado");

    let finalUrl = args.url || "";
    if (args.storageId) {
      const storageUrl = await ctx.storage.getUrl(args.storageId);
      if (storageUrl) {
        finalUrl = storageUrl;
      }
    }

    if (!finalUrl) throw new Error("O URL do documento é obrigatório");

    const docId = await ctx.db.insert("documents", {
      name: args.name,
      type: args.type,
      url: finalUrl,
      eventId: args.eventId,
      contractId: args.contractId,
      status: "pending_validation",
      uploadedBy: currentUser._id,
      uploadedAt: Date.now(),
    });

    // If a document is tied to a contract and is "Jurídico", we might auto-update contract status
    // For this prototype, we'll assume uploading a contract document transitions a 'pending_signatures' to 'active'
    if (args.contractId && args.type === "Jurídico") {
      const contract = await ctx.db.get(args.contractId);
      if (contract && contract.status === "pending_signatures") {
        await ctx.db.patch(args.contractId, {
          status: "active",
          signedAt: Date.now()
        });
      }
    }

    return docId;
  }
});

export const updateDocumentStatus = mutation({
  args: {
    documentId: v.id("documents"),
    status: v.union(v.literal("pending_validation"), v.literal("valid"), v.literal("rejected")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.documentId, { status: args.status });
  }
});export const removeDocument = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
