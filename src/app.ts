import Fastify from "fastify";
import dotenv from "dotenv";
dotenv.config();

const app = Fastify();

app.get("/health", () => {
  return "Health Check";
});

export default app;
