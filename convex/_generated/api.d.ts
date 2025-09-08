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
import type * as gameHttpActions from "../gameHttpActions.js";
import type * as http from "../http.js";
import type * as sports from "../sports.js";
import type * as users from "../users.js";
import type * as webhooks from "../webhooks.js";

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
  gameHttpActions: typeof gameHttpActions;
  http: typeof http;
  sports: typeof sports;
  users: typeof users;
  webhooks: typeof webhooks;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
