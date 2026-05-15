import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";

export const getRecentActivities = query({
  args: { 
    userEmail: v.optional(v.string()),
    limit: v.optional(v.number()),
    entityType: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, args) => {
    if (!args.userEmail) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();

    if (!user) return [];

    let activitiesQuery;

    if (args.projectId) {
      activitiesQuery = ctx.db
        .query("auditLogs")
        .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId));
    } else {
      activitiesQuery = ctx.db.query("auditLogs");
    }

    const activities = await activitiesQuery
      .order("desc")
      .collect();

    // ... (rest of filtering logic)
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
          createdAt: activity.timestamp, // Map for UI compatibility
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
      .query("auditLogs")
      .filter((q) => q.lt(q.field("timestamp"), threshold))
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
    projectId?: any;
    action: string;
    entityId?: string;
    entityType: string;
    details: any;
  }
) => {
  return await ctx.db.insert("auditLogs", {
    userId: args.userId,
    projectId: args.projectId,
    action: args.action,
    details: args.details,
    timestamp: Date.now(),
  });
};

export const logActivity = mutation({
  args: {
    userId: v.id("users"),
    projectId: v.optional(v.id("projects")),
    action: v.string(),
    details: v.any(),
  },
  handler: async (ctx, args) => {
    return await logActivityHelper(ctx, {
      ...args,
      entityType: "audit", // Default for direct calls
    });
  },
});
