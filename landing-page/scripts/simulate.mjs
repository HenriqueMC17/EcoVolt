import { execSync } from "child_process";

const machines = ["generator-alpha", "grid-beta", "solar-gamma"];

console.log("⚡ EcoVolt Energy Simulator Started...");
console.log("Press Ctrl+C to stop.\n");

setInterval(() => {
  const machineId = machines[Math.floor(Math.random() * machines.length)];
  const voltage = parseFloat((220 + (Math.random() * 10 - 5)).toFixed(2));
  const current = parseFloat((50 + (Math.random() * 20 - 10)).toFixed(2));
  const power = parseFloat((voltage * current).toFixed(2));
  const status = voltage < 216 ? "Warning" : "Normal";

  const data = JSON.stringify({
    machineId,
    voltage,
    current,
    power,
    status
  });

  try {
    // Run the convex mutation
    execSync(`npx convex run energy:insertEnergyData --data '${data}'`, { 
      stdio: 'ignore' 
    });
    
    // Also ping health
    const latency = Math.floor(Math.random() * 30 + 10);
    execSync(`npx convex run health:updateHealth --data '{"service":"edge-node-${machineId}","status":"Operational","latencyMs":${latency}}'`, { stdio: 'ignore' });

    console.log(`[Inserted] ${machineId} | ${voltage}V | ${power}W | Status: ${status}`);
  } catch(e) {
    console.error("Error inserting data (make sure convex dev is running or deployed).");
  }
}, 3000); // Sends data every 3 seconds
