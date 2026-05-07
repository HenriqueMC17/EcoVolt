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

    const companyId = await ctx.db.insert("companies", {
      name: args.name,
      type: args.type,
      cnpj: args.cnpj,
      status: args.status,
      region: args.region,
      capacity: args.capacity,
      rating: args.rating,
      category: args.category,
      createdAt: Date.now(),
    });

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "CREATE_COMPANY",
      entityId: companyId,
      entityType: "companies",
      details: {
        summary: `Nova empresa cadastrada: ${args.name} (${args.type}).`,
        data: {
          name: args.name,
          type: args.type,
          cnpj: args.cnpj,
          status: args.status,
          region: args.region,
          capacity: args.capacity,
          rating: args.rating,
          category: args.category,
        }
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

    const updates: {
      name?: string;
      type?: "client" | "provider";
      cnpj?: string;
      status?: "active" | "inactive";
      region?: string;
      capacity?: string;
      rating?: number;
      category?: string;
    } = {};

    if (args.name !== undefined) updates.name = args.name;
    if (args.type !== undefined) updates.type = args.type;
    if (args.cnpj !== undefined) updates.cnpj = args.cnpj;
    if (args.status !== undefined) updates.status = args.status;
    if (args.region !== undefined) updates.region = args.region;
    if (args.capacity !== undefined) updates.capacity = args.capacity;
    if (args.rating !== undefined) updates.rating = args.rating;
    if (args.category !== undefined) updates.category = args.category;

    const previousState = await ctx.db.get(args.id);
    
    await ctx.db.patch(args.id, updates);

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "UPDATE_COMPANY",
      entityId: args.id,
      entityType: "companies",
      details: {
        summary: `Empresa editada: ${args.name || previousState?.name || 'ID ' + args.id}.`,
        data: { updates }
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
      },
    });
  },
});
