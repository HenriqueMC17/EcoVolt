import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { logActivityHelper } from "./activities";

export const getCompanies = query({
  args: {
    userEmail: v.string(),
    type: v.optional(v.union(v.literal("client"), v.literal("provider")))
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();

    if (!user) {
      throw new Error("Unauthorized: User not found");
    }

    let companies = await ctx.db.query("companies").collect();
    
    if (args.type) {
      companies = companies.filter(c => c.type === args.type);
    }
    
    return companies;
  },
});

export const createCompany = mutation({
  args: {
    userEmail: v.string(),
    name: v.string(),
    type: v.union(v.literal("client"), v.literal("provider")),
    cnpj: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    region: v.optional(v.string()),
    capacity: v.optional(v.string()),
    rating: v.optional(v.number()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can create companies");
    }

    const { userEmail, ...companyData } = args;
    const companyId = await ctx.db.insert("companies", {
      ...companyData,
      createdAt: Date.now(),
    });

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "CREATE_COMPANY",
      entityId: companyId,
      entityType: "companies",
      details: {
        summary: `Nova empresa cadastrada: ${args.name} (${args.type}).`,
        data: { ...companyData }
      },
    });

    return companyId;
  },
});

export const updateCompany = mutation({
  args: {
    userEmail: v.string(),
    id: v.id("companies"),
    name: v.optional(v.string()),
    type: v.optional(v.union(v.literal("client"), v.literal("provider"))),
    cnpj: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
    region: v.optional(v.string()),
    capacity: v.optional(v.string()),
    rating: v.optional(v.number()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can update companies");
    }

    const { id, userEmail: _, ...updates } = args;
    const previousState = await ctx.db.get(id);
    
    await ctx.db.patch(id, updates);

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "UPDATE_COMPANY",
      entityId: id,
      entityType: "companies",
      details: {
        summary: `Empresa editada: ${args.name || previousState?.name || 'ID ' + id}.`,
        previous: previousState,
        updated: updates
      },
    });
  },
});

export const removeCompany = mutation({
  args: { 
    userEmail: v.string(),
    id: v.id("companies") 
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can remove companies");
    }

    const company = await ctx.db.get(args.id);
    await ctx.db.delete(args.id);

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "REMOVE_COMPANY",
      entityId: args.id,
      entityType: "companies",
      details: {
        summary: `Empresa removida: ${company?.name || args.id}.`,
        deletedRecord: company
      },
    });
  },
});
