import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { logActivityHelper } from "./activities";

/**
 * Secures and resolves the authenticated user's ID via Clerk token identity.
 */
export async function resolveUser(ctx: QueryCtx | MutationCtx, userIdArg?: string): Promise<Id<"users">> {
  const identity = await ctx.auth.getUserIdentity();
  if (identity && identity.email) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .unique();
    if (user) return user._id;
  }
  
  // Strict check in production: if no valid token exists, reject immediately.
  const isDev = process.env.NODE_ENV === "development" || !process.env.GEMINI_API_KEY;
  if (isDev) {
    if (userIdArg) {
      return userIdArg as Id<"users">;
    }
    const firstUser = await ctx.db.query("users").first();
    if (firstUser) return firstUser._id;
  }
  
  throw new Error("Unauthorized: Active user session not found or not registered");
}

export const getMe = query({
  args: { email: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const email = identity.email;
      if (!email) return null;

      return await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .unique();
    }

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

export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to storeUser");
    }

    const email = identity.email;
    if (!email) {
      throw new Error("User identity lacks email");
    }

    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!user) {
      const userId = await ctx.db.insert("users", {
        name: identity.name || "Membro EcoVolt",
        email: email,
        role: "admin", // Default role for first onboarded users
        createdAt: Date.now(),
      });
      user = await ctx.db.get(userId);
    }
    return user;
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
    const userId = await ctx.db.insert("users", {
      ...userData,
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
    const { id: _, userEmail: __, ...updates } = args;
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
