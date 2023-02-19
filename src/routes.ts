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

  app.get("/day", async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date(),
    });

    const { date } = getDayParams.parse(request.query);

    const parsedDate = dayjs(date).add(3, "h");
    const weekDay = dayjs(parsedDate).get("day");

    const possibleHabits = await prisma.habit.findMany({
      where: {
        createdAt: { lte: date },
        habitWeekDays: { some: { weekDay: weekDay } },
      },
    });

    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate(),
      },
      include: {
        dayHabit: true,
      },
    });

    const completedHabits = day?.dayHabit.map((d) => d.habitId);

    return { possibleHabits, completedHabits };
  });
}
