/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as blog from "../blog.js";
import type * as content from "../content.js";
import type * as debug from "../debug.js";
import type * as migrations from "../migrations.js";
import type * as resetAndSeed from "../resetAndSeed.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";
import type * as watchlist from "../watchlist.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  blog: typeof blog;
  content: typeof content;
  debug: typeof debug;
  migrations: typeof migrations;
  resetAndSeed: typeof resetAndSeed;
  seed: typeof seed;
  users: typeof users;
  watchlist: typeof watchlist;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
