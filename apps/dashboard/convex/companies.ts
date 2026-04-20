import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
    return await ctx.db.insert("companies", {
      ...companyData,
      createdAt: Date.now(),
    });
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
    await ctx.db.patch(id, updates);
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

    await ctx.db.delete(args.id);
  },
});
