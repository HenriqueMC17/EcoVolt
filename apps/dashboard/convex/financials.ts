import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { logActivityHelper } from "./activities";

export const getFinancials = query({
  args: { userEmail: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();

    if (!user) throw new Error("Unauthorized: User not found");

    let financialsQuery = ctx.db.query("financials").order("desc");
    let financials;

    if (user.role === "admin" || user.role === "operator") {
      financials = await financialsQuery.collect();
    } else if (user.role === "event_company") {
      // Filter by events owned by the user's company
      const events = await ctx.db
        .query("events")
        .withIndex("by_companyId", (q) => q.eq("companyId", user.companyId!))
        .collect();
      
      const eventIds = events.map(e => e._id);
      const financialsList = [];
      for (const eventId of eventIds) {
        const eventFins = await ctx.db
          .query("financials")
          .withIndex("by_eventId", (q) => q.eq("eventId", eventId))
          .collect();
        financialsList.push(...eventFins);
      }
      // Sort by createdAt desc as we collected them separately
      financials = financialsList.sort((a, b) => b.createdAt - a.createdAt);
    } else if (user.role === "provider") {
      // Filter by contracts where the user's company is the provider
      const contracts = await ctx.db
        .query("contracts")
        .withIndex("by_providerCompanyId", (q) => q.eq("providerCompanyId", user.companyId!))
        .collect();
      
      const contractIds = contracts.map(c => c._id);
      const financialsList = [];
      for (const contractId of contractIds) {
        const contractFins = await ctx.db
          .query("financials")
          .withIndex("by_contractId", (q) => q.eq("contractId", contractId))
          .collect();
        financialsList.push(...contractFins);
      }
      financials = financialsList.sort((a, b) => b.createdAt - a.createdAt);
    } else {
      return [];
    }
    
    // Enrich with event names and format data for UI
    const enrichedFinancials = await Promise.all(
      financials.map(async (fin) => {
        let eventName = "N/A";
        let contractRef = "N/A";

        if (fin.eventId) {
          const event = await ctx.db.get(fin.eventId);
          if (event) eventName = event.name;
        }

        if (fin.contractId) {
          contractRef = `CTR-${new Date(fin.createdAt).getFullYear()}-${fin.contractId.substring(fin.contractId.length - 4).toUpperCase()}`;
        }

        return {
          ...fin,
          event: eventName,
          contract: contractRef,
        };
      })
    );
    
    return enrichedFinancials;
  },
});

export const createFinancialTransaction = mutation({
  args: {
    userEmail: v.string(),
    eventId: v.optional(v.id("events")),
    contractId: v.optional(v.id("contracts")),
    type: v.union(v.literal("income"), v.literal("expense")),
    category: v.string(),
    amount: v.number(),
    status: v.union(v.literal("pending"), v.literal("paid"), v.literal("overdue"), v.literal("cancelled")),
    dueDate: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();

    if (!user || (user.role !== "admin" && user.role !== "operator")) {
      throw new Error("Unauthorized: Only admins and operators can create transactions");
    }

    const { userEmail, ...transactionData } = args;
    const financialId = await ctx.db.insert("financials", {
      ...transactionData,
      createdAt: Date.now(),
      paidAt: args.status === "paid" ? Date.now() : undefined,
    });

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "CREATE_FINANCIAL_TRANSACTION",
      entityId: financialId,
      entityType: "financials",
      details: {
        type: args.type,
        amount: args.amount,
        category: args.category,
        status: args.status,
        dueDate: args.dueDate,
        summary: `Nova transação de ${args.type}: R$ ${args.amount.toFixed(2)} (${args.category}).`
      },
    });

    return financialId;
  },
});

export const updateFinancialStatus = mutation({
  args: {
    userEmail: v.string(),
    financialId: v.id("financials"),
    status: v.union(v.literal("pending"), v.literal("paid"), v.literal("overdue"), v.literal("cancelled")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();

    if (!user || (user.role !== "admin" && user.role !== "operator")) {
      throw new Error("Unauthorized: Only admins and operators can update status");
    }

    const oldFinancial = await ctx.db.get(args.financialId);
    await ctx.db.patch(args.financialId, { 
      status: args.status,
      paidAt: args.status === "paid" ? Date.now() : undefined
    });

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "UPDATE_FINANCIAL_STATUS",
      entityId: args.financialId,
      entityType: "financials",
      details: {
        previousStatus: oldFinancial?.status,
        newStatus: args.status,
        summary: `Status da transação alterado de ${oldFinancial?.status} para ${args.status}.`,
      },
    });
  },
});

export const updateFinancial = mutation({
  args: {
    userEmail: v.string(),
    id: v.id("financials"),
    eventId: v.optional(v.id("events")),
    contractId: v.optional(v.id("contracts")),
    type: v.optional(v.union(v.literal("income"), v.literal("expense"))),
    category: v.optional(v.string()),
    amount: v.optional(v.number()),
    status: v.optional(v.union(v.literal("pending"), v.literal("paid"), v.literal("overdue"), v.literal("cancelled"))),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();

    if (!user || (user.role !== "admin" && user.role !== "operator")) {
      throw new Error("Unauthorized: Only admins and operators can update transactions");
    }

    const oldFinancial = await ctx.db.get(id);
    const { id: _, userEmail: __, ...updates } = args;
    await ctx.db.patch(id, updates);

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "UPDATE_FINANCIAL",
      entityId: id,
      entityType: "financials",
      details: {
        updates,
        summary: "Transação financeira editada.",
      },
    });
  },
});

export const removeFinancial = mutation({
  args: { 
    userEmail: v.string(),
    id: v.id("financials") 
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();

    if (!user || (user.role !== "admin" && user.role !== "operator")) {
      throw new Error("Unauthorized: Only admins and operators can remove transactions");
    }

    const oldFinancial = await ctx.db.get(args.id);
    await ctx.db.delete(args.id);

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "REMOVE_FINANCIAL",
      entityId: args.id,
      entityType: "financials",
      details: {
        deletedRecord: oldFinancial,
        summary: `Transação financeira de R$ ${oldFinancial?.amount.toFixed(2)} removida.`,
      },
    });
  },
});


export const processReconciliation = mutation({
  args: {
    userEmail: v.string(),
    consumptionId: v.id("consumptions"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();

    if (!user || (user.role !== "admin" && user.role !== "operator")) {
      throw new Error("Unauthorized: Only admins and operators can process reconciliation");
    }

    const consumption = await ctx.db.get(args.consumptionId);
    if (!consumption || !consumption.actualKwh) {
      throw new Error("Medição não encontrada ou incompleta.");
    }
    if (consumption.isReconciled) {
      throw new Error("Esta reconciliação já foi processada.");
    }

    const event = await ctx.db.get(consumption.eventId);
    if (!event) throw new Error("Evento não encontrado.");

    // Find the active contract for this event to link the transaction
    const contract = await ctx.db
      .query("contracts")
      .withIndex("by_eventId", (q) => q.eq("eventId", consumption.eventId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    const difference = consumption.actualKwh - consumption.predictedKwh;
    const tolerance = event.toleranceKwh ?? 5;

    // Only process if outside tolerance
    if (Math.abs(difference) <= tolerance) {
      await ctx.db.patch(args.consumptionId, { isReconciled: true });
      return { success: true, message: "Dentro da tolerância. Nenhuma transação gerada." };
    }

    const rate = contract?.ratePerKwh ?? 1.5; // Use contract rate or fallback to default
    const amount = Math.abs(difference) * rate;
    
    // If consumption exceeded: income (client pays more)
    // If consumption saved: expense (platform/provider refunds/credits client)
    const type = difference > 0 ? "income" : "expense"; 
    
    const financialId = await ctx.db.insert("financials", {
      eventId: consumption.eventId,
      contractId: contract?._id,
      type: type,
      category: difference > 0 ? "Faturamento Excedente" : "Estorno por Economia",
      amount: amount,
      status: "pending",
      dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
      createdAt: Date.now(),
    });

    await ctx.db.patch(args.consumptionId, { isReconciled: true });

    await logActivityHelper(ctx, {
      userId: user._id,
      action: "PROCESS_RECONCILIATION",
      entityId: args.consumptionId,
      entityType: "consumptions",
      details: `Reconciliação processada para o consumo ${args.consumptionId}. Diferença: ${difference.toFixed(2)}kWh.`,
    });

    return { 
      success: true, 
      financialId, 
      amount, 
      type,
      message: `Transação de R$ ${amount.toFixed(2)} gerada com sucesso.`
    };
  },
});

export const getFinancialStats = query({
  args: { userEmail: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();

    if (!user) throw new Error("Unauthorized");

    // Re-use logic from getFinancials to get the correct subset of transactions for stats
    // In a real app, you might want to optimize this to not fetch everything if not needed
    // But for now, let's keep it simple and consistent with the visible list.
    
    // Actually, for stats, we might want to restrict this to admin/operator only for the global view
    // or provide limited stats for event companies/providers.
    // Let's restrict global stats to admin/operator for now.
    
    if (user.role !== "admin" && user.role !== "operator") {
      // Return zeroed stats or company-specific stats
      // For now, let's just return what they have access to
    }

    // Reuse filtering logic
    let financialsQuery = ctx.db.query("financials");
    let transactions;

    if (user.role === "admin" || user.role === "operator") {
      transactions = await financialsQuery.collect();
    } else if (user.role === "event_company") {
      const events = await ctx.db
        .query("events")
        .withIndex("by_companyId", (q) => q.eq("companyId", user.companyId!))
        .collect();
      
      const eventIds = events.map(e => e._id);
      const transactionsList = [];
      for (const eventId of eventIds) {
        const eventFins = await ctx.db
          .query("financials")
          .withIndex("by_eventId", (q) => q.eq("eventId", eventId))
          .collect();
        transactionsList.push(...eventFins);
      }
      transactions = transactionsList;
    } else if (user.role === "provider") {
      const contracts = await ctx.db
        .query("contracts")
        .withIndex("by_providerCompanyId", (q) => q.eq("providerCompanyId", user.companyId!))
        .collect();
      
      const contractIds = contracts.map(c => c._id);
      const transactionsList = [];
      for (const contractId of contractIds) {
        const contractFins = await ctx.db
          .query("financials")
          .withIndex("by_contractId", (q) => q.eq("contractId", contractId))
          .collect();
        transactionsList.push(...contractFins);
      }
      transactions = transactionsList;
    } else {
      transactions = [];
    }

    const stats = {
      totalIncome: 0,
      totalExpenses: 0,
      totalPending: 0,
      monthlyData: [] as { name: string; income: number; expenses: number }[],
    };

    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const monthlyMap: Record<string, { income: number; expenses: number }> = {};

    transactions.forEach(trx => {
      if (trx.status === "paid") {
        if (trx.type === "income") stats.totalIncome += trx.amount;
        else stats.totalExpenses += trx.amount;
      } else if (trx.status === "pending") {
        stats.totalPending += trx.amount;
      }

      // Group by month
      const date = new Date(trx.createdAt);
      const monthName = months[date.getMonth()];
      if (!monthlyMap[monthName]) {
        monthlyMap[monthName] = { income: 0, expenses: 0 };
      }
      if (trx.type === "income") monthlyMap[monthName].income += trx.amount;
      else monthlyMap[monthName].expenses += trx.amount;
    });

    stats.monthlyData = Object.entries(monthlyMap).map(([name, data]) => ({
      name,
      ...data
    }));

    return stats;
  },
});
