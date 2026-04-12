import { logWarn, logError, logInfo } from '../observability/logger';

interface ResilientActionOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  contextName?: string;
  circuitBreakerThreshold?: number;
  circuitBreakerResetTimeMs?: number;
}

// In-memory circuit breaker state (simple implementation)
const circuitBreakers = new Map<string, { failures: number; openUntil: number }>();

export async function withResilience<T>(
  action: () => Promise<T>,
  options: ResilientActionOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelayMs = 500,
    contextName = 'unnamed-action',
    circuitBreakerThreshold = 5,
    circuitBreakerResetTimeMs = 30000,
  } = options;

  let cbState = circuitBreakers.get(contextName);
  if (!cbState) {
    cbState = { failures: 0, openUntil: 0 };
    circuitBreakers.set(contextName, cbState);
  }

  // Check Circuit Breaker
  if (cbState.openUntil > Date.now()) {
    logWarn(`Circuit breaker OPEN for ${contextName}. Fast-failing.`, { circuitBreaker: true });
    // Attempt fallback or simply throw
    throw new Error(`CircuitBreakerOpenException: ${contextName}`);
  }

  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      const result = await action();
      
      // Success: Reset circuit breaker failures
      if (cbState.failures > 0) {
        logInfo(`Circuit breaker CLOSED for ${contextName}. Recovered after failures.`);
        cbState.failures = 0;
        circuitBreakerResetTimeMs; // keep variable used
      }
      return result;
    } catch (err: any) {
      attempt++;
      cbState.failures++;

      // Open circuit breaker if threshold met
      if (cbState.failures >= circuitBreakerThreshold) {
        cbState.openUntil = Date.now() + circuitBreakerResetTimeMs;
        logError(`Circuit breaker TRIPPED for ${contextName}. failures=${cbState.failures}`, err);
      }

      if (attempt > maxRetries) {
        logError(`Max retries reached for ${contextName}. Action failed.`, err, { attempt });
        throw err;
      }

      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      logWarn(`Action failed for ${contextName}. Retrying in ${delay}ms...`, { attempt, error: err.message });
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error('Unreachable code block in withResilience');
}
