/**
 * `send-mail` middleware
 */

import type { Core } from "@strapi/strapi";

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    strapi.log.info("**Formatting and sending mail**");

    await next();
  };
};
