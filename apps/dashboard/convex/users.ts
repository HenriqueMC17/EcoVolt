import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getMe = query({
  args: { email: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.email) {
      return await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email!))
        .unique();
    }
    // Fallback for dev/unauthenticated if needed, but in prod we expect email
    return null;
  },
});

export const getUsers = query({
  args: { userEmail: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can list users");
    }

    return await ctx.db.query("users").collect();
  },
});

export const createUser = mutation({
  args: {
    userEmail: v.string(), // Authenticated user performing the action
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("admin"),
      v.literal("event_company"),
      v.literal("provider"),
      v.literal("operator")
    ),
    companyId: v.optional(v.id("companies")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can create users");
    }

    const { userEmail, ...userData } = args;
    return await ctx.db.insert("users", {
      ...userData,
      createdAt: Date.now(),
    });
  },
});

export const updateUser = mutation({
  args: {
    userEmail: v.string(),
    id: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.union(
      v.literal("admin"),
      v.literal("event_company"),
      v.literal("provider"),
      v.literal("operator")
    )),
    companyId: v.optional(v.id("companies")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can update users");
    }

    const { id, userEmail: _, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const removeUser = mutation({
  args: { 
    userEmail: v.string(),
    id: v.id("users") 
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can remove users");
    }

    await ctx.db.delete(args.id);
  },
});
