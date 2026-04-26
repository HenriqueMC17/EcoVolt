/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as activities from "../activities.js";
import type * as alerts from "../alerts.js";
import type * as companies from "../companies.js";
import type * as consumptions from "../consumptions.js";
import type * as contracts from "../contracts.js";
import type * as crons from "../crons.js";
import type * as documents from "../documents.js";
import type * as events from "../events.js";
import type * as external_weather from "../external/weather.js";
import type * as financials from "../financials.js";
import type * as metrics from "../metrics.js";
import type * as projects from "../projects.js";
import type * as proposals from "../proposals.js";
import type * as seed from "../seed.js";
import type * as services_energy from "../services/energy.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  activities: typeof activities;
  alerts: typeof alerts;
  companies: typeof companies;
  consumptions: typeof consumptions;
  contracts: typeof contracts;
  crons: typeof crons;
  documents: typeof documents;
  events: typeof events;
  "external/weather": typeof external_weather;
  financials: typeof financials;
  metrics: typeof metrics;
  projects: typeof projects;
  proposals: typeof proposals;
  seed: typeof seed;
  "services/energy": typeof services_energy;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
