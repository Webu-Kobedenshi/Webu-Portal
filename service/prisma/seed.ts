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

const familyNames = [
  "佐藤",
  "鈴木",
  "高橋",
  "田中",
  "伊藤",
  "渡辺",
  "山本",
  "中村",
  "小林",
  "加藤",
  "吉田",
  "山田",
  "佐々木",
  "山口",
  "松本",
  "井上",
  "木村",
  "林",
  "清水",
  "斎藤",
] as const;

const givenNames = [
  "陽翔",
  "湊",
  "蓮",
  "蒼",
  "樹",
  "結衣",
  "凛",
  "美咲",
  "葵",
  "紬",
  "悠斗",
  "大和",
  "颯太",
  "菜月",
  "杏奈",
  "琴音",
  "晴",
  "柚葉",
  "奏",
  "優奈",
] as const;

const nicknamePool = [
  "たくみ",
  "みなと",
  "れん",
  "あおい",
  "ゆい",
  "りん",
  "みさき",
  "そうた",
  "かなで",
  "ゆな",
  "haru",
  "natsu",
  "koto",
  "yamato",
  "itsuki",
] as const;

const companyPool = [
  "LINEヤフー株式会社",
  "楽天グループ株式会社",
  "株式会社サイバーエージェント",
  "株式会社メルカリ",
  "株式会社ディー・エヌ・エー",
  "株式会社ミクシィ",
  "GMOインターネットグループ株式会社",
  "Sansan株式会社",
  "freee株式会社",
  "株式会社MIXI",
  "チームラボ株式会社",
  "株式会社Cygames",
  "株式会社スクウェア・エニックス",
  "株式会社バンダイナムコスタジオ",
  "株式会社セガ",
  "株式会社カプコン",
  "Sky株式会社",
  "SCSK株式会社",
  "TIS株式会社",
  "富士ソフト株式会社",
  "株式会社オービック",
  "株式会社大塚商会",
  "株式会社NTTデータ",
  "株式会社日立ソリューションズ",
  "日本アイ・ビー・エム株式会社",
  "アクセンチュア株式会社",
  "株式会社野村総合研究所",
  "株式会社電通総研",
  "株式会社ゆめみ",
  "株式会社MonotaRO",
] as const;

function pickFullName(index: number): string {
  const family = familyNames[index % familyNames.length];
  const given = givenNames[(index * 3) % givenNames.length];
  return `${family} ${given}`;
}

function pickNickname(index: number): string {
  const base = nicknamePool[index % nicknamePool.length];
  return `${base}${String((index % 9) + 1)}`;
}

function pickCompanies(index: number): string[] {
  const first = companyPool[index % companyPool.length];
  const second = companyPool[(index + 7) % companyPool.length];

  return index % 4 === 0 ? [first, second] : [first];
}

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
          name: pickFullName(index),
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
          nickname: pickNickname(index),
          graduationYear: 2020 + (index % 6),
          department,
          remarks:
            index % 5 === 0
              ? "ポートフォリオ添削や面接対策の相談歓迎です。"
              : "現場で使う技術スタックや就活体験を共有できます。",
          contactEmail: user.email,
          isPublic: true,
          acceptContact: index % 4 !== 0,
        };
      }),
    });

    const profiles = await prisma.alumniProfile.findMany({
      where: {
        user: {
          email: {
            in: seedEmails,
          },
        },
      },
      select: {
        id: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    await prisma.alumniCompany.createMany({
      data: profiles.flatMap((profile, index) => {
        return pickCompanies(index).map((companyName) => ({
          alumniProfileId: profile.id,
          companyName,
        }));
      }),
      skipDuplicates: true,
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
