import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Select } from "@/components/atoms/select";

type SearchFieldProps = {
  initialDepartment: string;
  initialCompany: string;
  initialPageSize: number;
};

export function SearchField({
  initialDepartment,
  initialCompany,
  initialPageSize,
}: SearchFieldProps) {
  return (
    <form className="liquid-glass rounded-2xl p-4" method="get">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_120px_auto]">
        <label htmlFor="search-department" className="space-y-1.5">
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
            学科で絞り込む
          </span>
          <Select
            id="search-department"
            name="department"
            defaultValue={initialDepartment || ""}
          >
            <option value="">すべての学科</option>
            <option value="IT_EXPERT">ITエキスパート</option>
            <option value="IT_SPECIALIST">ITスペシャリスト</option>
            <option value="INFORMATION_PROCESS">情報処理</option>
            <option value="PROGRAMMING">プログラミング</option>
            <option value="AI_SYSTEM">AIシステム開発</option>
            <option value="ADVANCED_STUDIES">総合研究科</option>
            <option value="INFO_BUSINESS">情報ビジネス</option>
            <option value="INFO_ENGINEERING">情報工学</option>
            <option value="GAME_RESEARCH">ゲーム開発研究</option>
            <option value="GAME_ENGINEER">ゲームエンジニア</option>
            <option value="GAME_SOFTWARE">ゲーム制作</option>
            <option value="ESPORTS">esportsエンジニア</option>
            <option value="CG_ANIMATION">CGアニメーション</option>
            <option value="DIGITAL_ANIME">デジタルアニメ</option>
            <option value="GRAPHIC_DESIGN">グラフィックデザイン</option>
            <option value="INDUSTRIAL_DESIGN">インダストリアルデザイン</option>
            <option value="ARCHITECTURAL">建築</option>
            <option value="SOUND_CREATE">サウンドクリエイト</option>
            <option value="SOUND_TECHNIQUE">サウンドテクニック</option>
            <option value="VOICE_ACTOR">声優</option>
            <option value="INTERNATIONAL_COMM">国際コミュニケーション</option>
            <option value="OTHERS">その他</option>
          </Select>
        </label>

        <label htmlFor="search-company" className="space-y-1.5">
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
            企業名で検索
          </span>
          <Input
            id="search-company"
            name="company"
            defaultValue={initialCompany}
            placeholder="例: 株式会社○○"
          />
        </label>

        <label htmlFor="search-page-size" className="space-y-1.5">
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
            表示件数
          </span>
          <Select
            id="search-page-size"
            name="pageSize"
            defaultValue={String(initialPageSize)}
          >
            <option value="10">10件</option>
            <option value="20">20件</option>
            <option value="50">50件</option>
          </Select>
        </label>

        <div className="flex items-end gap-2">
          <Button type="submit" className="w-full sm:w-auto">
            検索
          </Button>
        </div>
      </div>
    </form>
  );
}
