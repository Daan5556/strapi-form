/**
 * form service
 */
import crypto from "crypto";

export default {
  async createPendingForm({ formData }) {
    const token = crypto.randomBytes(32).toString("hex");

    await strapi.documents("api::form.pending-form").create({
      data: {
        token: token,
        data: formData,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // + 1 hour
      },
    });
  },
};
