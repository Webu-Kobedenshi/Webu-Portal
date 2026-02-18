import { PrismaPg } from "@prisma/adapter-pg";
import { Department, PrismaClient, Role, UserStatus } from "@prisma/client";
import { Pool } from "pg";

const TOTAL_SEED_USERS = 100;
const SEED_EMAIL_DOMAIN = "seed.kdps.ac.jp";

const departments: Department[] = [
  Department.IT_EXPERT,
  Department.IT_SPECIALIST,
  Department.INFORMATION_PROCESS,
  Department.PROGRAMMING,
  Department.AI_SYSTEM,
  Department.ADVANCED_STUDIES,
  Department.INFO_BUSINESS,
  Department.INFO_ENGINEERING,
  Department.GAME_RESEARCH,
  Department.GAME_ENGINEER,
  Department.GAME_SOFTWARE,
  Department.ESPORTS,
  Department.CG_ANIMATION,
  Department.DIGITAL_ANIME,
  Department.GRAPHIC_DESIGN,
  Department.INDUSTRIAL_DESIGN,
  Department.ARCHITECTURAL,
  Department.SOUND_CREATE,
  Department.SOUND_TECHNIQUE,
  Department.VOICE_ACTOR,
  Department.INTERNATIONAL_COMM,
  Department.OTHERS,
];

function pickDepartment(index: number): Department {
  return departments[index % departments.length];
}

async function main() {
  const connectionString =
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/webu_portal?schema=public";

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log(`Seeding ${TOTAL_SEED_USERS} alumni users...`);

    const seedEmails = Array.from(
      { length: TOTAL_SEED_USERS },
      (_, index) => `seed.alumni.${String(index + 1).padStart(3, "0")}@${SEED_EMAIL_DOMAIN}`,
    );

    await prisma.alumniProfile.deleteMany({
      where: {
        user: {
          email: {
            in: seedEmails,
          },
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        email: {
          in: seedEmails,
        },
      },
    });

    await prisma.user.createMany({
      data: seedEmails.map((email, index) => {
        const enrollmentYear = 2016 + (index % 8);
        const durationYears = 2 + (index % 3);

        return {
          email,
          name: `Seed User ${index + 1}`,
          studentId: `S${String(100000 + index + 1)}`,
          enrollmentYear,
          durationYears,
          department: pickDepartment(index),
          role: Role.ALUMNI,
          status: UserStatus.GRADUATED,
        };
      }),
    });

    const users = await prisma.user.findMany({
      where: {
        email: {
          in: seedEmails,
        },
      },
      select: {
        id: true,
        email: true,
      },
      orderBy: {
        email: "asc",
      },
    });

    await prisma.alumniProfile.createMany({
      data: users.map((user, index) => {
        const department = pickDepartment(index);

        return {
          userId: user.id,
          nickname: `OB${String(index + 1).padStart(3, "0")}`,
          graduationYear: 2020 + (index % 6),
          department,
          companyName: `Seed Company ${String((index % 25) + 1).padStart(2, "0")}`,
          remarks:
            index % 5 === 0
              ? "在校生向けに就活アドバイス対応可"
              : "卒業生プロフィール（seed data）",
          contactEmail: user.email,
          isPublic: true,
          acceptContact: index % 4 !== 0,
        };
      }),
    });

    console.log(`Seed completed: ${users.length} users + ${users.length} alumni profiles.`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
