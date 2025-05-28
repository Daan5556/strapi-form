import { z } from "zod/v4";

export default () => ({
  formSubmitRequest({ body }) {
    return formData.safeParse(body);
  },

  confirmRequest({ body }) {
    return confirmData.safeParse(body);
  },
});

const formData = z.object({
  name: z.string(),
  email: z.email(),
  gRecaptchaToken: z.string(),
});

const confirmData = z.object({
  token: z.string(),
});
