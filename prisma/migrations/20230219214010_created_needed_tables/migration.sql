-- CreateTable
CREATE TABLE "habit_week_days" (
    "id" TEXT NOT NULL,
    "habit_id" TEXT NOT NULL,
    "weekDay" INTEGER NOT NULL,

    CONSTRAINT "habit_week_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "days" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "day_habit" (
    "id" TEXT NOT NULL,
    "day_id" TEXT NOT NULL,
    "habit_id" TEXT NOT NULL,

    CONSTRAINT "day_habit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "habit_week_days_habit_id_weekDay_key" ON "habit_week_days"("habit_id", "weekDay");

-- CreateIndex
CREATE UNIQUE INDEX "days_date_key" ON "days"("date");

-- CreateIndex
CREATE UNIQUE INDEX "day_habit_day_id_habit_id_key" ON "day_habit"("day_id", "habit_id");

-- AddForeignKey
ALTER TABLE "habit_week_days" ADD CONSTRAINT "habit_week_days_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "day_habit" ADD CONSTRAINT "day_habit_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "days"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "day_habit" ADD CONSTRAINT "day_habit_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
