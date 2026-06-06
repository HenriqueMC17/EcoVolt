import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// Periodically generate telemetry to ensure the dashboard always has live data
crons.interval(
  "generate-random-telemetry",
  { minutes: 1 }, // Convex standard crons run at minimum 1-minute intervals
  api.energy.generateMockTelemetry,
  {
    machineId: "generator-alpha",
    voltage: 220 + Math.floor(Math.random() * 10) - 5,
    current: 15 + Math.floor(Math.random() * 4) - 2,
    power: 3300 + Math.floor(Math.random() * 400) - 200,
    status: "Optimal",
  }
);

export default crons;
