import { mcpConvexTransport } from './mcp-convex-client';
import { withResilience } from './resilience';
import { logInfo, logError } from '../observability/logger';

// Temporary fallback cache mechanism if Circuit Breaker opens or Convex is unreachable
const fallbackCache = new Map<string, any>();

export const dbService = {
  /**
   * Resilient Query execution
   */
  async query<T>(queryName: string, args: Record<string, any> = {}): Promise<T> {
    const contextName = `query:${queryName}`;
    const cacheKey = `${queryName}-${JSON.stringify(args)}`;

    try {
      const result = await withResilience<T>(
        async () => {
          logInfo(`Executing Convex Query: ${queryName}`, { args });
          return await mcpConvexTransport.query(queryName as any, args);
        },
        {
          contextName,
          baseDelayMs: 200,
          maxRetries: 3,
        }
      );

      // Update cache on success
      fallbackCache.set(cacheKey, result);
      return result;
    } catch (error) {
      logError(`Failed to execute query ${queryName}, attempting fallback cache`, error);
      if (fallbackCache.has(cacheKey)) {
        logInfo(`Serving STALE data from fallback cache for ${queryName}`);
        return fallbackCache.get(cacheKey) as T;
      }
      throw error;
    }
  },

  /**
   * Resilient Mutation execution
   */
  async mutation<T>(mutationName: string, args: Record<string, any> = {}): Promise<T> {
    const contextName = `mutation:${mutationName}`;

    return await withResilience<T>(
      async () => {
        logInfo(`Executing Convex Mutation: ${mutationName}`, { args });
        return await mcpConvexTransport.mutation(mutationName as any, args);
      },
      {
        contextName,
        baseDelayMs: 300,
        maxRetries: 2, // Fewer retries for mutations to prevent duplicates if idempotency isn't strict
      }
    );
  },
};
