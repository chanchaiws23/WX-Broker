import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.broker.deleteMany();

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
      description: "World's largest cryptocurrency exchange with a wide range of digital assets.",
      logoUrl: "https://logo.clearbit.com/binance.com",
      website: "https://www.binance.com",
      brokerType: "crypto",
    },
  ];

  for (const broker of brokers) {
    await prisma.broker.create({ data: broker });
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
