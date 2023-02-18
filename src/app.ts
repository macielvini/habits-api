import Fastify from "fastify";

const app = Fastify();

app.get("/health", () => {
  return "Connected";
});

app.listen({
  port: 5000,
});
