/**
 * form controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::form.form", () => ({
  async create(ctx, next) {
    const { data } = ctx.request.body;

    const formData: { name: string; email: string } = {
      name: data.name,
      email: data.email,
    };

    const reCaptchaToken = data.gRecaptchaToken;

    if (verifyRecaptcha(reCaptchaToken)) {
      strapi.documents("api::form.form").create({
        data: { data: formData },
      });

      return { ok: true, confirmed: true, data: formData };
    }

    strapi.documents("api::form.pending-form").create({
      data: {
        token: reCaptchaToken,
        data: formData,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // + 1 hour
      },
    });

    console.log(
      `Sending mail to ${data.email} content: Click to confirm: <a href=\"http://frontend.net/aanvragen/confirm?token=${reCaptchaToken}\"`
    );

    return { ok: true, confirmed: false, data: formData };
  },
}));

const verifyRecaptcha = (token: string) => {
  return token === "1234";
};
