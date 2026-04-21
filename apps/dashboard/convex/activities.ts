import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";

export const getRecentActivities = query({
  args: { 
    userEmail: v.optional(v.string()),
    limit: v.optional(v.number()),
    entityType: v.optional(v.string()),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    if (!args.userEmail) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();

    if (!user) return [];

    let activitiesQuery;

    // RBAC: Admins and Operators see everything
    if (user.role === "admin" || user.role === "operator") {
      activitiesQuery = ctx.db.query("activityLog");
    } else {
      // Others see only their company's activity
      if (!user.companyId) return [];
      activitiesQuery = ctx.db
        .query("activityLog")
        .withIndex("by_companyId", (q) => q.eq("companyId", user.companyId));
    }

    const activities = await activitiesQuery
      .order("desc")
      .collect();

    // Secondary filters
    let filtered = activities;
    
    if (args.entityType) {
      filtered = filtered.filter(a => a.entityType === args.entityType);
    }
    
    if (args.userId) {
      filtered = filtered.filter(a => a.userId === args.userId);
    }

    const limited = filtered.slice(0, args.limit || 20);

    const activitiesWithUsers = await Promise.all(
      limited.map(async (activity) => {
        const actingUser = await ctx.db.get(activity.userId);
        return {
          ...activity,
          userName: actingUser?.name || "Sistema",
          userEmail: actingUser?.email || "",
        };
      })
    );

    return activitiesWithUsers;
  },
});

export const clearOldActivities = internalMutation({
  args: { daysToKeep: v.number() },
  handler: async (ctx, args) => {
    const threshold = Date.now() - (args.daysToKeep * 24 * 60 * 60 * 1000);
    const oldActivities = await ctx.db
      .query("activityLog")
      .filter((q) => q.lt(q.field("createdAt"), threshold))
      .collect();

    for (const activity of oldActivities) {
      await ctx.db.delete(activity._id);
    }
    return oldActivities.length;
  },
});

export const logActivityHelper = async (
  ctx: { db: any },
  args: {
    userId: any;
    companyId?: any; // Optional, will be fetched if missing
    action: string;
    entityId?: string;
    entityType: string;
    details: any;
  }
) => {
  let companyId = args.companyId;
  
  if (!companyId) {
    const user = await ctx.db.get(args.userId);
    companyId = user?.companyId;
  }

  return await ctx.db.insert("activityLog", {
    userId: args.userId,
    companyId,
    action: args.action,
    entityId: args.entityId,
    entityType: args.entityType,
    details: args.details,
    createdAt: Date.now(),
  });
};

export const logActivity = internalMutation({
  args: {
    userId: v.id("users"),
    companyId: v.optional(v.id("companies")),
    action: v.string(),
    entityId: v.optional(v.string()),
    entityType: v.string(),
    details: v.any(),
  },
  handler: async (ctx, args) => {
    return await logActivityHelper(ctx, args);
  },
});
