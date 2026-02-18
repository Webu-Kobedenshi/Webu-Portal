import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Select } from "@/components/atoms/select";

type SearchFieldProps = {
  initialKeyword: string;
  initialDepartment: string;
};

export function SearchField({ initialKeyword, initialDepartment }: SearchFieldProps) {
  return (
    <form className="grid gap-3 md:grid-cols-[1fr_220px_auto]" method="get">
      <Input name="q" placeholder="企業名・氏名で検索" defaultValue={initialKeyword} />

      <Select name="department" defaultValue={initialDepartment}>
        <option value="">学科を選択</option>
        <option value="GAME">ゲーム</option>
        <option value="IT">IT</option>
        <option value="DESIGN">デザイン</option>
        <option value="CG">CG</option>
        <option value="SOUND">サウンド</option>
        <option value="OTHER">その他</option>
      </Select>

      <Button className="w-full md:w-auto" type="submit">
        検索
      </Button>
    </form>
  );
}
