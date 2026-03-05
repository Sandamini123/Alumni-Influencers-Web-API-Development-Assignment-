import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Alumni Influencer API", version: "1.0.0" },
    servers: [{ url: "http://localhost:4000" }],
    components: {
      securitySchemes: {
        BearerAuth: { type: "http", scheme: "bearer" },      // user JWT
        ClientBearer: { type: "http", scheme: "bearer" },    // api key bearer
      },
    },
  },
  apis: [], // keep simple (or add jsdoc later)
});