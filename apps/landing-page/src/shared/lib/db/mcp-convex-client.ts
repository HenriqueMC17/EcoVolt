import { ConvexHttpClient } from 'convex/browser';
import { logInfo, logError } from '../observability/logger';

// Use environment variables for the deployment connection
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL || 'https://dummy-url.convex.cloud';

if (!CONVEX_URL) {
  logError('Convex URL is not defined in environment variables. Connection will fail.');
}

/**
 * Singleton client for pure server/service-side interactions with Convex, acting 
 * as the underlying transport layer for the MCP orchestrator.
 */
export const mcpConvexTransport = new ConvexHttpClient(CONVEX_URL);

/**
 * Sets authorization using the preview key or proper token
 */
export const setMcpTransportAuth = (token: string) => {
  mcpConvexTransport.setAuth(token);
  logInfo('MCP Transport Auth token configured.');
};
