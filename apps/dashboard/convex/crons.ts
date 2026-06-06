import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Clean up old activity logs every month (keeps last 90 days)
crons.monthly(
  "cleanup-old-activities",
  { day: 1, hourUTC: 0, minuteUTC: 0 },
  internal.activities.clearOldActivities,
  { daysToKeep: 90 }
);

export default crons;
