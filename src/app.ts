import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import { appRoutes } from "./routes";
dotenv.config();

const app = Fastify();

app.register(cors);
app.register(appRoutes);

export default app;
