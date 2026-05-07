import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { logActivityHelper } from "./activities";

/**
 * Controller Layer: Public endpoints for project management.
 */

export const list = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getById = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    const metrics = await ctx.db
      .query("metrics")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .first();
    
    return { ...project, latestMetrics: metrics };
  },
});

export const create = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    category: v.union(v.literal("Solar"), v.literal("Wind"), v.literal("Hydro"), v.literal("Biomass")),
    location: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const projectId = await ctx.db.insert("projects", {
      userId: args.userId,
      name: args.name,
      category: args.category,
      location: args.location,
      description: args.description,
      status: "in_analysis",
      createdAt: Date.now(),
    });

    await logActivityHelper(ctx, {
      userId: args.userId,
      action: "CREATE_PROJECT",
      entityId: projectId,
      entityType: "projects",
      details: { name: args.name, category: args.category },
    });

    // Initialize empty metrics
    await ctx.db.insert("metrics", {
      projectId,
      energyConsumption: 0,
      savings: 0,
      environmentalImpact: 0,
      timestamp: Date.now(),
    });

    return projectId;
  },
});

export const updateStatus = mutation({
  args: {
    projectId: v.id("projects"),
    status: v.union(v.literal("active"), v.literal("in_analysis"), v.literal("completed")),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");

    await ctx.db.patch(args.projectId, { status: args.status });

    await logActivityHelper(ctx, {
      userId: project.userId,
      action: "UPDATE_STATUS",
      entityId: args.projectId,
      entityType: "projects",
      details: { oldStatus: project.status, newStatus: args.status },
    });
  },
});

export const remove = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");

    // Delete metrics first
    const metrics = await ctx.db
      .query("metrics")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();
    
    for (const m of metrics) {
      await ctx.db.delete(m._id);
    }

    await ctx.db.delete(args.projectId);

    await logActivityHelper(ctx, {
      userId: project.userId,
      action: "DELETE_PROJECT",
      entityId: args.projectId,
      entityType: "projects",
      details: { name: project.name },
    });
  },
});
