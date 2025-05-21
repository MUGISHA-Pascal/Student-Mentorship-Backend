import cron from "node-cron";
import { PrismaClient, CohortStatus } from "@prisma/client";

const prisma = new PrismaClient();

// Cron: runs every minute
cron.schedule("*/1 * * * *", async () => {
  const now = new Date();

  try {
    // 1. Mark cohorts as COMPLETED if endDate < now
    await prisma.cohort.updateMany({
      where: {
        endDate: { lt: now },
        status: { not: CohortStatus.COMPLETED },
      },
      data: {
        status: CohortStatus.COMPLETED,
      },
    });

    // 2. Mark cohorts as ONGOING if now is between startDate and endDate
    await prisma.cohort.updateMany({
      where: {
        startDate: { lte: now },
        endDate: { gte: now },
        status: { not: CohortStatus.ONGOING },
      },
      data: {
        status: CohortStatus.ONGOING,
      },
    });

    // 3. Mark cohorts as UPCOMING if startDate > now
    await prisma.cohort.updateMany({
      where: {
        startDate: { gt: now },
        status: { not: CohortStatus.UPCOMING },
      },
      data: {
        status: CohortStatus.UPCOMING,
      },
    });

    console.log(`[${now.toISOString()}]  Cohort statuses updated.`);
  } catch (error) {
    console.error("Error updating cohort statuses:", error);
  }
});
