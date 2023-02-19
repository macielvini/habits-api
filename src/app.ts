import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
dotenv.config();

const app = Fastify();

app.register(cors);

app.get("/health", () => {
  return "Health Check";
});

export default app;
