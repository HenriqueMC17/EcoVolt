export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN || "https://clerk.ecovolt.com",
      applicationID: "convex",
    },
  ],
};
