import { mutation } from "./_generated/server";

export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing data for a clean seed
    const allEvents = await ctx.db.query("events").collect();
    for (const e of allEvents) await ctx.db.delete(e._id);
    const allDocs = await ctx.db.query("documents").collect();
    for (const d of allDocs) await ctx.db.delete(d._id);
    const allCons = await ctx.db.query("consumptions").collect();
    for (const c of allCons) await ctx.db.delete(c._id);
    const allUsers = await ctx.db.query("users").collect();
    for (const u of allUsers) await ctx.db.delete(u._id);
    const allCompanies = await ctx.db.query("companies").collect();
    for (const c of allCompanies) await ctx.db.delete(c._id);

    const companyId = await ctx.db.insert("companies", {
      name: "Vibe Events",
      type: "client",
      status: "active",
      createdAt: Date.now(),
    });

    const providerId = await ctx.db.insert("companies", {
      name: "SolarTech Energias",
      type: "provider",
      status: "active",
      region: "Sudeste / Sul",
      capacity: "500 MWh/mês",
      rating: 4.9,
      category: "Solar Fotovoltaica",
      createdAt: Date.now(),
    });

    await ctx.db.insert("companies", {
      name: "EcoEnergy Ltda",
      type: "provider",
      status: "active",
      region: "Nacional",
      capacity: "1.2 GWh/mês",
      rating: 4.8,
      category: "Mix Sustentável",
      createdAt: Date.now(),
    });

    const event1 = await ctx.db.insert("events", {
      name: "Festival Solarize 2026",
      status: "active",
      startDate: new Date("2026-04-25").getTime(),
      endDate: new Date("2026-04-27").getTime(),
      location: "São Paulo, SP",
      expectedAttendees: 15000,
      estimatedConsumption: 45200,
      companyId: companyId,
      createdAt: Date.now(),
    });

    const event2 = await ctx.db.insert("events", {
      name: "Arena Verão",
      status: "completed",
      startDate: new Date("2026-04-10").getTime(),
      endDate: new Date("2026-04-12").getTime(),
      location: "Rio de Janeiro, RJ",
      expectedAttendees: 20000,
      estimatedConsumption: 120500,
      companyId: companyId,
      createdAt: Date.now(),
    });

    const event3 = await ctx.db.insert("events", {
      name: "Congresso EcoTech",
      status: "planning",
      startDate: new Date("2026-05-02").getTime(),
      endDate: new Date("2026-05-04").getTime(),
      location: "Curitiba, PR",
      expectedAttendees: 3000,
      estimatedConsumption: 12800,
      companyId: companyId,
      createdAt: Date.now(),
    });

    const allProjects = await ctx.db.query("projects").collect();
    for (const p of allProjects) await ctx.db.delete(p._id);
    const allMetrics = await ctx.db.query("metrics").collect();
    for (const m of allMetrics) await ctx.db.delete(m._id);
    const allLogs = await ctx.db.query("auditLogs").collect();
    for (const l of allLogs) await ctx.db.delete(l._id);

    // ... (existing company and event seeds) ...

    const adminId = await ctx.db.insert("users", {
      name: "Henrique Admin",
      email: "henrique@ecovolt.com",
      role: "admin",
      createdAt: Date.now(),
    });

    // Seed Projects
    const project1 = await ctx.db.insert("projects", {
      userId: adminId,
      name: "Fazenda Solar Atibaia",
      category: "Solar",
      status: "active",
      location: "Atibaia, SP",
      description: "Usina fotovoltaica de médio porte para suprir sede administrativa.",
      createdAt: Date.now(),
    });

    const project2 = await ctx.db.insert("projects", {
      userId: adminId,
      name: "Complexo Eólico Ventos do Sul",
      category: "Wind",
      status: "in_analysis",
      location: "Osório, RS",
      description: "Expansão de parque eólico existente com novas turbinas de 5MW.",
      createdAt: Date.now(),
    });

    // Seed Metrics for Project 1
    const baseTime = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days ago
    for (let i = 0; i < 30; i++) {
      await ctx.db.insert("metrics", {
        projectId: project1,
        energyConsumption: 450 + Math.random() * 100,
        savings: 1200 + Math.random() * 300,
        environmentalImpact: 85 + Math.random() * 20,
        timestamp: baseTime + (i * 24 * 60 * 60 * 1000),
      });
    }

    // Seed Audit Logs
    await ctx.db.insert("auditLogs", {
      projectId: project1,
      userId: adminId,
      action: "CREATE_PROJECT",
      details: { name: "Fazenda Solar Atibaia" },
      timestamp: Date.now(),
    });

    return "Data seeded successfully with projects and metrics!";
  },
});
