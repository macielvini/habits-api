import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "./config/database";
import dayjs from "dayjs";

export async function appRoutes(app: FastifyInstance) {
  app.get("/health", () => {
    return "Health Check";
  });

  app.post("/habits", async (request) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(6)),
    });

    const { title, weekDays } = createHabitBody.parse(request.body);

    const today = dayjs().startOf("day").toDate();

    await prisma.habit.create({
      data: {
        title,
        createdAt: today,
        habitWeekDays: {
          create: weekDays.map((d) => {
            return { weekDay: d };
          }),
        },
      },
    });
  });
}
