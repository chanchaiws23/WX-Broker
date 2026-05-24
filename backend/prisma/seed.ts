import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Password123!", 10);

  await prisma.user.upsert({
    where: { email: "demo@woxa.test" },
    update: {
      fullName: "Demo User",
      password,
      deletedAt: null,
    },
    create: {
      fullName: "Demo User",
      email: "demo@woxa.test",
      password,
    },
  });

  const brokers = [
    {
      name: "Exness",
      slug: "exness",
      description: "Leading forex and CFD broker with competitive spreads and fast execution.",
      logoUrl: "https://logo.clearbit.com/exness.com",
      website: "https://www.exness.com",
      brokerType: "cfd",
    },
    {
      name: "Interactive Brokers",
      slug: "interactive-brokers",
      description: "Professional trading platform for stocks, options, futures, and bonds.",
      logoUrl: "https://logo.clearbit.com/interactivebrokers.com",
      website: "https://www.interactivebrokers.com",
      brokerType: "stock",
    },
    {
      name: "Binance",
      slug: "binance",
      description: "Large cryptocurrency exchange with broad digital asset coverage.",
      logoUrl: "https://logo.clearbit.com/binance.com",
      website: "https://www.binance.com",
      brokerType: "crypto",
    },
  ];

  for (const broker of brokers) {
    await prisma.broker.upsert({
      where: { slug: broker.slug },
      update: broker,
      create: broker,
    });
  }

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
