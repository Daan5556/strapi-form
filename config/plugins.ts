export default () => ({
  email:
    process.env.NODE_ENV === "development"
      ? {
          config: {
            provider: "sendmail",
            providerOptions: {
              smtpHost: "localhost",
              smtpPort: 1025,
              ignoreTLS: true,
            },
            settings: {
              defaultFrom: "egdaan@example.com",
              defaultReplyTo: "egdaan@example.com",
            },
          },
        }
      : {},
});
