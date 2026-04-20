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

    const adminId = await ctx.db.insert("users", {
      name: "Henrique Admin",
      email: "henrique@ecovolt.com",
      role: "admin",
      createdAt: Date.now(),
    });

    await ctx.db.insert("users", {
      name: "Mariana Eventos",
      email: "mariana@vibe.com",
      role: "event_company",
      companyId: companyId,
      createdAt: Date.now(),
    });

    await ctx.db.insert("users", {
      name: "João Provedor",
      email: "joao@solartech.com",
      role: "provider",
      companyId: providerId,
      createdAt: Date.now(),
    });

    await ctx.db.insert("users", {
      name: "Carlos Jurídico",
      email: "carlos@ecovolt.com",
      role: "operator",
      createdAt: Date.now(),
    });

    // Seed initial consumptions
    await ctx.db.insert("consumptions", {
      eventId: event2, // Arena Verão (completed)
      predictedKwh: 120500,
      actualKwh: 121000, // Slightly over
      recordedAt: Date.now(),
      createdAt: Date.now(),
    });

    // Create active contracts for reconciliation testing
    await ctx.db.insert("contracts", {
      eventId: event1,
      providerCompanyId: providerId,
      clientCompanyId: companyId,
      status: "active",
      value: 75000,
      createdAt: Date.now(),
    });

    await ctx.db.insert("contracts", {
      eventId: event2,
      providerCompanyId: providerId,
      clientCompanyId: companyId,
      status: "active",
      value: 150000,
      createdAt: Date.now(),
    });

    return "Data seeded successfully with users, consumptions, and contracts!";
  },
});
