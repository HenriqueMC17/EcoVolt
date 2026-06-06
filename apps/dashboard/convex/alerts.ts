import { query } from "./_generated/server";
import { v } from "convex/values";

export const getOperationalAlerts = query({
  args: { userEmail: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();

    if (!user) return [];

    const alerts = [];

    // 1. Check for consumption deviations (only for active events)
    const activeEvents = await ctx.db
      .query("events")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    for (const event of activeEvents) {
      // Security check: only show if admin/operator or user's company
      if (user.role === "event_company" && user.companyId !== event.companyId) continue;
      
      const consumption = await ctx.db
        .query("consumptions")
        .withIndex("by_eventId", (q) => q.eq("eventId", event._id))
        .first();

      if (consumption && consumption.actualKwh) {
        const diff = Math.abs(consumption.actualKwh - consumption.predictedKwh);
        const tolerance = (event as any).toleranceKwh ?? (event.estimatedConsumption * 0.1); // 10% default tolerance

        if (diff > tolerance) {
          alerts.push({
            id: `dev-${event._id}`,
            type: "error",
            title: "Desvio de Consumo Detectado",
            description: `O evento "${event.name}" apresenta um desvio de ${diff.toFixed(1)} kWh fora da tolerância.`,
            category: "deviation",
            severity: "high",
            link: "/consumo"
          });
        }
      }
    }

    // 2. Check for overdue financials
    const overdueFinancials = await ctx.db
      .query("financials")
      .withIndex("by_status", (q) => q.eq("status", "overdue"))
      .collect();

    for (const fin of overdueFinancials) {
      // Permission check
      if (user.role === "admin" || user.role === "operator") {
        alerts.push({
          id: `fin-${fin._id}`,
          type: "error",
          title: "Pagamento Atrasado",
          description: `A transação de R$ ${fin.amount.toFixed(2)} (${fin.category}) está vencida.`,
          category: "overdue_payment",
          severity: "high",
          link: "/financeiro"
        });
      }
    }

    // 3. Check for upcoming contract renewals/completions (within 7 days)
    // Note: Events have endDate, we can use that if contracts don't have explicit end dates
    const soonEvents = await ctx.db
      .query("events")
      .withIndex("by_status_endDate", (q) => 
        q.eq("status", "active")
         .lte("endDate", Date.now() + 7 * 24 * 60 * 60 * 1000)
      )
      .collect();

    for (const event of soonEvents) {
      if (user.role === "event_company" && user.companyId !== event.companyId) continue;
      
      alerts.push({
        id: `expiry-${event._id}`,
        type: "warning",
        title: "Evento Próximo do Fim",
        description: `O evento "${event.name}" termina em breve. Prepare o fechamento financeiro.`,
        category: "expiry",
        severity: "medium",
        link: "/eventos"
      });
    }

    // 4. Pending Documents
    if (user.role === "admin" || user.role === "operator") {
      const pendingDocs = await ctx.db
        .query("documents")
        .withIndex("by_status", (q) => q.eq("status", "pending_validation"))
        .collect();

      if (pendingDocs.length > 0) {
        alerts.push({
          id: "pending-docs",
          type: "warning",
          title: "Documentos Pendentes",
          description: `Existem ${pendingDocs.length} documentos aguardando validação técnica.`,
          category: "pending_doc",
          severity: "medium",
          link: "/documentos"
        });
      }
    }

    return alerts;
  },
});

export const getAlertsByEventId = query({
  args: { 
    eventId: v.id("events"),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    if (!user) throw new Error("Unauthorized");

    const event = await ctx.db.get(args.eventId);
    if (!event) return [];

    if (user.role === "event_company" && user.companyId !== event.companyId) {
      return [];
    }

    const alerts = [];

    // 1. Consumption Deviation
    const consumptions = await ctx.db
      .query("consumptions")
      .withIndex("by_eventId", (q) => q.eq("eventId", args.eventId))
      .collect();

    for (const cons of consumptions) {
      if (cons.actualKwh) {
        const diff = cons.actualKwh - cons.predictedKwh;
        const tolerance = 5; // Fixed for now or get from event if added to schema
        if (Math.abs(diff) > tolerance) {
          alerts.push({
            id: `dev-${cons._id}`,
            type: diff > 0 ? "error" : "warning",
            title: diff > 0 ? "Excesso de Consumo" : "Sub-consumo Detectado",
            description: `Desvio de ${Math.abs(diff).toFixed(1)} kWh em relação ao previsto.`,
            timestamp: cons.recordedAt
          });
        }
      }
    }

    // 2. Financial Overdue
    const financials = await ctx.db
      .query("financials")
      .withIndex("by_eventId", (q) => q.eq("eventId", args.eventId))
      .filter((q) => q.eq(q.field("status"), "overdue"))
      .collect();

    for (const fin of financials) {
      alerts.push({
        id: `fin-${fin._id}`,
        type: "error",
        title: "Pagamento Pendente",
        description: `Vencimento em ${new Date(fin.dueDate).toLocaleDateString()} no valor de R$ ${fin.amount.toLocaleString()}.`,
        timestamp: fin.dueDate
      });
    }

    return alerts.sort((a, b) => b.timestamp - a.timestamp);
  },
});
