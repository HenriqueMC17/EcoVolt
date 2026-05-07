import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { logActivityHelper } from "./activities";
import { Id } from "./_generated/dataModel";

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

    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      role: args.role,
      companyId: args.companyId,
      createdAt: Date.now(),
    });

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "CREATE_USER",
      entityId: userId,
      entityType: "users",
      details: {
        name: args.name,
        email: args.email,
        role: args.role,
        companyId: args.companyId,
        summary: `Novo usuário criado: ${args.name} (${args.email}) com perfil ${args.role}.`,
      },
    });

    return userId;
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

    const targetUser = await ctx.db.get(args.id);
    const updates: {
      name?: string;
      email?: string;
      role?: "admin" | "event_company" | "provider" | "operator";
      companyId?: Id<"companies">;
    } = {};

    if (args.name !== undefined) updates.name = args.name;
    if (args.email !== undefined) updates.email = args.email;
    if (args.role !== undefined) updates.role = args.role;
    if (args.companyId !== undefined) updates.companyId = args.companyId;

    await ctx.db.patch(args.id, updates);

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "UPDATE_USER",
      entityId: args.id,
      entityType: "users",
      details: {
        updates,
        targetUser: targetUser?.email,
        summary: `Usuário editado: ${targetUser?.name} (${targetUser?.email}).`,
      },
    });
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

    const oldUser = await ctx.db.get(args.id);
    await ctx.db.delete(args.id);

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "REMOVE_USER",
      entityId: args.id,
      entityType: "users",
      details: {
        deletedUser: oldUser?.email,
        summary: `Usuário ${oldUser?.name} (${oldUser?.email}) removido do sistema.`,
      },
    });
  },
});
