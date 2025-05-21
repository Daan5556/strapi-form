/**
 * form controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::form.form", () => ({
  async find(ctx, next) {
    ctx.body = "Hello World!";
  },
}));
