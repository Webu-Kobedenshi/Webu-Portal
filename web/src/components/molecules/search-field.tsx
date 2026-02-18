import { Button } from "@/components/atoms/button";
import { Select } from "@/components/atoms/select";

type SearchFieldProps = {
  initialDepartment: string;
  initialPageSize: number;
};

export function SearchField({ initialDepartment, initialPageSize }: SearchFieldProps) {
  return (
    <form className="grid gap-3 md:grid-cols-[220px_140px_auto]" method="get">
      <Select name="department" defaultValue={initialDepartment}>
        <option value="">学科を選択</option>
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

      <Select name="pageSize" defaultValue={String(initialPageSize)}>
        <option value="10">10件表示</option>
        <option value="20">20件表示</option>
        <option value="50">50件表示</option>
      </Select>

      <Button className="w-full md:w-auto" type="submit">
        検索
      </Button>
    </form>
  );
}
