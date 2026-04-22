import "dotenv/config";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  try {
    // 1. Create a Student
    await prisma.user.upsert({
      where: { email: "student@checkout.com" },
      update: {},
      create: {
        name: "Alex Rivera",
        email: "student@checkout.com",
        role: UserRole.STUDENT,
        bio: "Final year CS student looking for internship nodes.",
        domains: ["Tech", "SaaS"],
        location: "Indiranagar Hub",
      },
    });

    // 2. Create a Business
    await prisma.user.upsert({
      where: { email: "corp@zigma.com" },
      update: {},
      create: {
        name: "Zigma Corp",
        email: "corp@zigma.com",
        role: UserRole.BUSINESS,
        bio: "Regional logistics and supply chain aggregator.",
        domains: ["Logistics", "Operations"],
        location: "Technopark Node",
      },
    });

    // 3. Create a Professional
    await prisma.user.upsert({
      where: { email: "sarah@pro.com" },
      update: {},
      create: {
        name: "Sarah Chen",
        email: "sarah@pro.com",
        role: UserRole.PROFESSIONAL,
        bio: "Senior Strategy Consultant with 10+ years in Fintech.",
        domains: ["Strategy", "Fintech"],
        location: "Virtual Hub",
      },
    });

    // 4. Create an Advisor
    await prisma.user.upsert({
      where: { email: "expert@advisor.com" },
      update: {},
      create: {
        name: "Marcus Aurelius",
        email: "expert@advisor.com",
        role: UserRole.ADVISOR,
        bio: "Vetted scaling advisor for Series A startups.",
        domains: ["Venture Capital", "Scaling"],
        location: "Global Node",
      },
    });

    console.log("✅ Seeding complete.");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
