import { Card } from "@/components/atoms/card";
import type { AlumniProfile } from "@/graphql/types";

type AlumniCardProps = {
  alumni: AlumniProfile;
};

const departmentLabel: Record<AlumniProfile["department"], string> = {
  IT_EXPERT: "ITエキスパート",
  IT_SPECIALIST: "ITスペシャリスト",
  INFORMATION_PROCESS: "情報処理",
  PROGRAMMING: "プログラミング",
  AI_SYSTEM: "AIシステム開発",
  ADVANCED_STUDIES: "総合研究科",
  INFO_BUSINESS: "情報ビジネス",
  INFO_ENGINEERING: "情報工学",
  GAME_RESEARCH: "ゲーム開発研究",
  GAME_ENGINEER: "ゲームエンジニア",
  GAME_SOFTWARE: "ゲーム制作",
  ESPORTS: "esportsエンジニア",
  CG_ANIMATION: "CGアニメーション",
  DIGITAL_ANIME: "デジタルアニメ",
  GRAPHIC_DESIGN: "グラフィックデザイン",
  INDUSTRIAL_DESIGN: "インダストリアルデザイン",
  ARCHITECTURAL: "建築",
  SOUND_CREATE: "サウンドクリエイト",
  SOUND_TECHNIQUE: "サウンドテクニック",
  VOICE_ACTOR: "声優",
  INTERNATIONAL_COMM: "国際コミュニケーション",
  OTHERS: "その他",
};

const departmentGradient: Partial<Record<AlumniProfile["department"], string>> =
  {
    IT_EXPERT: "from-violet-500 to-indigo-500",
    IT_SPECIALIST: "from-blue-500 to-cyan-500",
    INFORMATION_PROCESS: "from-sky-500 to-blue-500",
    PROGRAMMING: "from-emerald-500 to-teal-500",
    AI_SYSTEM: "from-purple-500 to-violet-500",
    ADVANCED_STUDIES: "from-amber-500 to-orange-500",
    INFO_BUSINESS: "from-cyan-500 to-blue-500",
    INFO_ENGINEERING: "from-indigo-500 to-blue-500",
    GAME_RESEARCH: "from-rose-500 to-pink-500",
    GAME_ENGINEER: "from-red-500 to-rose-500",
    GAME_SOFTWARE: "from-pink-500 to-fuchsia-500",
    ESPORTS: "from-lime-500 to-green-500",
    CG_ANIMATION: "from-fuchsia-500 to-purple-500",
    DIGITAL_ANIME: "from-pink-500 to-rose-500",
    GRAPHIC_DESIGN: "from-orange-500 to-amber-500",
    INDUSTRIAL_DESIGN: "from-teal-500 to-emerald-500",
    ARCHITECTURAL: "from-stone-500 to-zinc-500",
    SOUND_CREATE: "from-yellow-500 to-amber-500",
    SOUND_TECHNIQUE: "from-amber-500 to-yellow-500",
    VOICE_ACTOR: "from-rose-400 to-pink-400",
    INTERNATIONAL_COMM: "from-blue-500 to-indigo-500",
    OTHERS: "from-gray-500 to-slate-500",
  };

export function AlumniCard({ alumni }: AlumniCardProps) {
  const initial = (alumni.nickname ?? "匿")[0];
  const gradient =
    departmentGradient[alumni.department] ?? "from-gray-500 to-slate-500";
  const companyNames =
    alumni.companyNames.length > 0 ? alumni.companyNames : ["未設定"];

  return (
    <Card className="group relative overflow-hidden border-amber-200/80 bg-gradient-to-br from-amber-50/95 via-orange-50/80 to-rose-50/75 p-0 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/15 dark:border-amber-600/45 dark:from-amber-800/45 dark:via-orange-800/35 dark:to-rose-800/35 dark:hover:shadow-amber-300/15">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_0%_0%,rgba(251,191,36,0.22),transparent_60%),radial-gradient(100%_60%_at_100%_0%,rgba(251,146,60,0.18),transparent_65%),radial-gradient(120%_80%_at_50%_100%,rgba(244,114,182,0.12),transparent_70%)] dark:bg-[radial-gradient(120%_70%_at_0%_0%,rgba(253,230,138,0.18),transparent_60%),radial-gradient(100%_60%_at_100%_0%,rgba(253,186,116,0.16),transparent_65%),radial-gradient(120%_80%_at_50%_100%,rgba(251,113,133,0.12),transparent_70%)]"
      />

      {/* Department accent bar */}
      <div
        className={`h-1 w-full bg-gradient-to-r ${gradient} opacity-50 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div className="relative p-4">
        <p className="mb-2 inline-flex items-center gap-1 rounded-full border border-amber-200/80 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 px-2.5 py-1 text-[10px] font-semibold tracking-[0.06em] text-amber-700 dark:border-amber-600/50 dark:from-amber-800/45 dark:via-yellow-800/35 dark:to-orange-800/45 dark:text-amber-200">
          <span aria-hidden>🎉</span>
          内定おめでとう！
        </p>

        {/* Company name — hero element */}
        <div className="mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-rose-500 dark:text-rose-300">
            内定先・勤務先
          </p>
          <ul className="mt-1 space-y-1">
            {companyNames.slice(0, 3).map((companyName) => (
              <li
                key={companyName}
                className="line-clamp-1 text-sm font-bold leading-snug tracking-tight text-stone-900 dark:text-stone-100"
              >
                {companyName}
              </li>
            ))}
          </ul>
        </div>

        {/* Divider */}
        <div className="mb-3 h-px bg-amber-200/70 dark:bg-amber-800/40" />

        {/* Person info row */}
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-[11px] font-bold text-white shadow-sm`}
          >
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-stone-800 dark:text-stone-200">
              {alumni.nickname ?? "匿名"}
            </p>
            <p className="text-[11px] text-amber-700/80 dark:text-amber-300/75">
              {alumni.graduationYear}年卒
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-amber-200/80 bg-white/65 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:border-amber-600/50 dark:bg-amber-900/40 dark:text-amber-200">
            {departmentLabel[alumni.department]}
          </span>
        </div>

        {/* Contact & Remarks */}
        <div className="mt-3 space-y-2">
          {alumni.acceptContact && alumni.contactEmail ? (
            <a
              href={`mailto:${alumni.contactEmail}`}
              className="flex items-center gap-1.5 rounded-lg border border-amber-200/80 bg-amber-50/80 px-2.5 py-1.5 text-[11px] font-medium text-amber-700 transition-colors hover:bg-amber-100/80 dark:border-amber-600/40 dark:bg-amber-800/35 dark:text-amber-200 dark:hover:bg-amber-700/45"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>メール</title>
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span className="truncate">{alumni.contactEmail}</span>
            </a>
          ) : null}

          {alumni.remarks ? (
            <p className="line-clamp-2 rounded-lg bg-orange-50/70 px-2.5 py-1.5 text-[11px] leading-relaxed text-amber-900/75 dark:bg-orange-800/30 dark:text-amber-200/75">
              {alumni.remarks}
            </p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
