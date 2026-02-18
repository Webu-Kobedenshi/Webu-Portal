import { Card } from "@/components/atoms/card";
import type { Alumni } from "@/graphql/types";

type AlumniCardProps = {
  alumni: Alumni;
};

const departmentLabel: Record<Alumni["department"], string> = {
  GAME: "ゲーム",
  IT: "IT",
  DESIGN: "デザイン",
  CG: "CG",
  SOUND: "サウンド",
  OTHER: "その他",
};

export function AlumniCard({ alumni }: AlumniCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{alumni.name}</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {alumni.graduationYear}年卒 / {departmentLabel[alumni.department]}
          </p>
        </div>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs dark:bg-zinc-800">公開中</span>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <p>
          <span className="font-medium">勤務先:</span> {alumni.company}
        </p>
        {alumni.message ? (
          <p className="text-zinc-700 dark:text-zinc-300">{alumni.message}</p>
        ) : (
          <p className="text-zinc-500 dark:text-zinc-400">メッセージは未登録です。</p>
        )}
      </div>
    </Card>
  );
}
