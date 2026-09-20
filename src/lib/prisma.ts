import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const basePrisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = basePrisma;
}

export const prisma = basePrisma.$extends({
  query: {
    user: {
      async create({ args, query }) {
        // Count how many early adopters already exist in the database
        const earlyAdopterCount = await basePrisma.user.count({
          where: { isEarlyAdopter: true },
        });

        // Determine user registration order
        const totalCount = await basePrisma.user.count();
        const order = totalCount + 1;
        args.data.registrationOrder = order;

        // Strict limit: only the first 5 early adopters receive PRO free for 6 months
        if (earlyAdopterCount < 5) {
          args.data.isEarlyAdopter = true;
          args.data.plan = "PRO";

          const now = new Date();
          args.data.premiumStartedAt = now;

          const expiryDate = new Date(now);
          expiryDate.setMonth(expiryDate.getMonth() + 6);
          args.data.premiumExpiresAt = expiryDate;
        } else {
          args.data.isEarlyAdopter = false;
        }

        return query(args);
      },
    },
  },
});
