/**
 * form controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::form.form", () => ({
  async index(ctx, next) {
    // called by GET /hello
    ctx.body = "Hello World!"; // we could also send a JSON
  },
}));
