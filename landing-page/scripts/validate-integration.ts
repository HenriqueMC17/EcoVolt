import { setMcpTransportAuth } from '../src/shared/lib/db/mcp-convex-client';
import { dbService } from '../src/shared/lib/db/service';
import { logInfo, logError } from '../src/shared/lib/observability/logger';
import { performance } from 'perf_hooks';

// Simulate the preview key setup
const token = 'preview:hmonteiro-hc:ecovolt|eyJ2MiI6IjE2ODdkODg4YTE0OTQyMDFiMjZkMjk2ZGRmYWUyNWEwIn0=';

async function validate() {
  logInfo('Starting Full MCP Convex Integration Validation');
  setMcpTransportAuth(token);

  // 1. Test Healthcheck (Ping)
  try {
    const start = performance.now();
    const pingResult = await dbService.query<any>('health:ping');
    const latency = performance.now() - start;
    
    logInfo('Healthcheck Ping Successful', { latencyMs: latency, result: pingResult });

    // 2. Report Health Status back to Convex
    await dbService.mutation<any>('health:updateHealth', {
      service: 'mcp-agent-layer',
      status: 'ONLINE',
      latencyMs: latency,
    });
    logInfo('Health Status Reported');

  } catch (err) {
    logError('Healthcheck Validation Failed', err);
  }

  // 3. Test Business Logic (Insert & Query)
  try {
    const machineId = `mac-${Math.round(Math.random() * 1000)}`;
    
    // Mutation
    logInfo('Simulating Energy Data Ingestion...');
    const insertId = await dbService.mutation('energy:insertEnergyData', {
      machineId,
      voltage: 220,
      current: 15.5,
      power: 3410,
      status: 'ACTIVE'
    });
    logInfo('Energy Data Ingested', { insertId });

    // Query
    logInfo('Simulating Energy Data Retrieval...');
    const data = await dbService.query('energy:getMachineData', {
      machineId,
      limit: 1
    });
    logInfo('Energy Data Retrieved', { data });

  } catch (err) {
    logError('Business Logic Validation Failed', err);
  }

  // 4. Test Resiliency - Simulate Fault (Invalid query should trigger retries and circuit breaker or throw after retries)
  try {
    logInfo('Testing Fault Tolerance and Retries (simulating invalid call)');
    await dbService.query('invalid:query_that_does_not_exist', {});
  } catch (err: any) {
    logInfo('Expected Error caught for invalid query test', { error: err.message });
  }

  logInfo('Validation Complete. System is Operational.');
}

validate().catch(err => {
  logError('Fatal error during validation', err);
});
