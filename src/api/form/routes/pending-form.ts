/**
 * form router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::form.pending-form", {
  config: { create: { auth: false } },
});
