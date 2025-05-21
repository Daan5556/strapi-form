/**
 * `rateLimiter` middleware
 */

import type { Core } from "@strapi/strapi";
import { RateLimit } from "koa2-ratelimit";

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    return RateLimit.middleware({
      interval: { min: 1 }, // 5 minute
      max: 1, // limit each IP to 100 requests per minute
      message: "Too many requests, please try again later.",
      headers: true,
    })(ctx, next);
  };
};
