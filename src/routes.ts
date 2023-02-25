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

    let parsedDate = dayjs(date).startOf("day");
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

    const completedHabits = day?.dayHabit.map((d) => d.habitId) ?? [];

    return { possibleHabits, completedHabits };
  });

  app.patch("/habits/:id/toggle", async (request) => {
    const toggleHabitParams = z.object({
      id: z.string().uuid(),
    });

    const { id } = toggleHabitParams.parse(request.params);

    const today = dayjs().startOf("day").toDate();

    let day = await prisma.day.findUnique({
      where: { date: today },
    });

    if (!day) {
      day = await prisma.day.create({
        data: { date: today },
      });
    }

    const habitIsAlreadyCompleted = await prisma.dayHabit.findUnique({
      where: {
        dayId_habitId: {
          dayId: day.id,
          habitId: id,
        },
      },
    });

    if (habitIsAlreadyCompleted) {
      await prisma.dayHabit.delete({
        where: { id: habitIsAlreadyCompleted.id },
      });
    } else {
      await prisma.dayHabit.create({
        data: { dayId: day.id, habitId: id },
      });
    }
  });

  app.get("/summary", async (request) => {
    const summary = await prisma.$queryRaw`
      SELECT 
        d.id,
        d.date,
        (
          SELECT cast(COUNT(*) as float) 
          FROM day_habit dh 
          WHERE dh.day_id = d.id
        ) as completed,
        (
          SELECT
            cast(COUNT(*) as float)
          FROM habit_week_days hwd
          JOIN habits h
          ON h.id = hwd.habit_id
          WHERE hwd."weekDay" = EXTRACT(DOW FROM d.date)::int
          AND h.created_at <= d.date
        ) as amount
      FROM days d;
    `;

    return summary;
  });
}
