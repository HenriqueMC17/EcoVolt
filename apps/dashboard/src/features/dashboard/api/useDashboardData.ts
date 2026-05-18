import { useQuery } from "@/shared/lib/convex";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

export const useDashboardData = (userId?: string) => {
  // Use a hardcoded ID for dev if none provided, or fetch first user
  const stats = useQuery(api.metrics.getGlobalStats, { 
    userId: (userId || "k173z269f80ghf8fayte8q4s9s76527q") as Id<"users"> 
  });
  
  const chartData = useQuery(api.metrics.getGlobalChartData, { 
    userId: (userId || "k173z269f80ghf8fayte8q4s9s76527q") as Id<"users"> 
  });

  return {
    stats,
    chartData,
    isLoading: !stats || !chartData
  };
};
