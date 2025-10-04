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
import type * as admin from "../admin.js";
import type * as adminAPI from "../adminAPI.js";
import type * as blog from "../blog.js";
import type * as cleanupDuplicates from "../cleanupDuplicates.js";
import type * as content from "../content.js";
import type * as debug from "../debug.js";
import type * as gameHttpActions from "../gameHttpActions.js";
import type * as http from "../http.js";
import type * as liveGameActions from "../liveGameActions.js";
import type * as migrations from "../migrations.js";
import type * as schema_enhanced from "../schema_enhanced.js";
import type * as sports from "../sports.js";
import type * as updateGameVideos from "../updateGameVideos.js";
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
  admin: typeof admin;
  adminAPI: typeof adminAPI;
  blog: typeof blog;
  cleanupDuplicates: typeof cleanupDuplicates;
  content: typeof content;
  debug: typeof debug;
  gameHttpActions: typeof gameHttpActions;
  http: typeof http;
  liveGameActions: typeof liveGameActions;
  migrations: typeof migrations;
  schema_enhanced: typeof schema_enhanced;
  sports: typeof sports;
  updateGameVideos: typeof updateGameVideos;
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
