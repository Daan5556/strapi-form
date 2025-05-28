import { z } from "zod/v4";

export default () => ({
  formSubmitRequest({ body }) {
    return formData.safeParse(body);
  },
});

const formData = z.object({
  name: z.string(),
  email: z.email(),
  gRecaptchaToken: z.string(),
});
