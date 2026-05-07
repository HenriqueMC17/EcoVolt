import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { logActivityHelper } from "./activities";

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
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    if (!user) throw new Error("Usuário não encontrado");

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
      uploadedBy: user._id,
      uploadedAt: Date.now(),
    });

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "CREATE_DOCUMENT",
      entityId: docId,
      entityType: "document",
      details: {
        name: args.name,
        type: args.type,
        eventId: args.eventId,
        contractId: args.contractId,
        summary: `Fez upload do documento "${args.name}" (${args.type})`,
      },
    });

    if (args.contractId && args.type === "Jurídico") {
      const contract = await ctx.db.get(args.contractId);
      if (contract && contract.status === "pending_signatures") {
        await ctx.db.patch(args.contractId, {
          status: "active",
          signedAt: Date.now()
        });

        await logActivityHelper(ctx, {
          userId: user._id,
          action: "UPDATE_CONTRACT_STATUS",
          entityId: args.contractId,
          entityType: "contract",
          details: `Contrato ativado automaticamente via upload de documento jurídico`,
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
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    if (!user) throw new Error("Unauthorized");

    const doc = await ctx.db.get(args.documentId);
    if (!doc) throw new Error("Documento não encontrado");

    await ctx.db.patch(args.documentId, { status: args.status });

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "UPDATE_DOCUMENT_STATUS",
      entityId: args.documentId,
      entityType: "document",
      details: {
        previousStatus: doc.status,
        newStatus: args.status,
        summary: `Alterou o status do documento "${doc.name}" de ${doc.status} para ${args.status}`,
      },
    });
  }
});

export const removeDocument = mutation({
  args: { 
    id: v.id("documents"),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    if (!user) throw new Error("Unauthorized");

    const doc = await ctx.db.get(args.id);
    if (!doc) throw new Error("Documento não encontrado");

    await ctx.db.delete(args.id);

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "REMOVE_DOCUMENT",
      entityId: args.id,
      entityType: "document",
      details: {
        summary: `Removeu o documento "${doc.name}" (ID: ${args.id})`,
      },
    });
  },
});
