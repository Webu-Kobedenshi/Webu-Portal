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

export function AlumniCard({ alumni }: AlumniCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{alumni.nickname ?? "匿名"}</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {alumni.graduationYear}年卒 / {departmentLabel[alumni.department]}
          </p>
        </div>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs dark:bg-zinc-800">公開中</span>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <p>
          <span className="font-medium">表示名:</span> {alumni.nickname ?? "未設定"}
        </p>
        <p>
          <span className="font-medium">勤務先:</span> {alumni.companyName}
        </p>
        {alumni.remarks ? (
          <p className="text-zinc-700 dark:text-zinc-300">{alumni.remarks}</p>
        ) : (
          <p className="text-zinc-500 dark:text-zinc-400">備考は未登録です。</p>
        )}
      </div>
    </Card>
  );
}
