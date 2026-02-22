"use client";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type SearchFieldProps = {
  initialDepartment: string;
  initialCompany: string;
  initialGraduationYear: string;
  initialPageSize: number;
};

export function SearchField({
  initialDepartment,
  initialCompany,
  initialGraduationYear,
  initialPageSize,
}: SearchFieldProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [department, setDepartment] = useState(initialDepartment || "");
  const [graduationYear, setGraduationYear] = useState(initialGraduationYear || "");
  const [pageSize, setPageSize] = useState(String(initialPageSize));
  const [companyInput, setCompanyInput] = useState(initialCompany);
  const [company, setCompany] = useState(initialCompany);
  const canReset = Boolean(department || companyInput || graduationYear || pageSize !== "10");

  useEffect(() => {
    const timer = setTimeout(() => {
      setCompany(companyInput.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [companyInput]);

  const nextHref = useMemo(() => {
    const query = new URLSearchParams();

    if (department) {
      query.set("department", department);
    }

    if (company) {
      query.set("company", company);
    }

    if (graduationYear) {
      query.set("graduationYear", graduationYear);
    }

    if (pageSize !== "10") {
      query.set("pageSize", pageSize);
    }

    const serialized = query.toString();
    return serialized ? `${pathname}?${serialized}` : pathname;
  }, [company, department, graduationYear, pageSize, pathname]);

  useEffect(() => {
    router.replace(nextHref, { scroll: false });
  }, [nextHref, router]);

  const handleReset = () => {
    setDepartment("");
    setCompanyInput("");
    setCompany("");
    setGraduationYear("");
    setPageSize("20");
    router.replace(pathname, { scroll: false });
  };

  return (
    <form className="liquid-glass rounded-2xl p-4" onSubmit={(event) => event.preventDefault()}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_120px_auto]">
        <label htmlFor="search-department" className="space-y-1.5">
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
            学科で絞り込む
          </span>
          <Select
            value={department || "ALL"}
            onValueChange={(val) => setDepartment(val === "ALL" ? "" : val)}
          >
            <SelectTrigger id="search-department">
              <SelectValue placeholder="すべての学科" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">すべての学科</SelectItem>
              <SelectItem value="IT_EXPERT">ITエキスパート</SelectItem>
              <SelectItem value="IT_SPECIALIST">ITスペシャリスト</SelectItem>
              <SelectItem value="INFORMATION_PROCESS">情報処理</SelectItem>
              <SelectItem value="PROGRAMMING">プログラミング</SelectItem>
              <SelectItem value="AI_SYSTEM">AIシステム開発</SelectItem>
              <SelectItem value="ADVANCED_STUDIES">総合研究科</SelectItem>
              <SelectItem value="INFO_BUSINESS">情報ビジネス</SelectItem>
              <SelectItem value="INFO_ENGINEERING">情報工学</SelectItem>
              <SelectItem value="GAME_RESEARCH">ゲーム開発研究</SelectItem>
              <SelectItem value="GAME_ENGINEER">ゲームエンジニア</SelectItem>
              <SelectItem value="GAME_SOFTWARE">ゲーム制作</SelectItem>
              <SelectItem value="ESPORTS">esportsエンジニア</SelectItem>
              <SelectItem value="CG_ANIMATION">CGアニメーション</SelectItem>
              <SelectItem value="DIGITAL_ANIME">デジタルアニメ</SelectItem>
              <SelectItem value="GRAPHIC_DESIGN">グラフィックデザイン</SelectItem>
              <SelectItem value="INDUSTRIAL_DESIGN">インダストリアルデザイン</SelectItem>
              <SelectItem value="ARCHITECTURAL">建築</SelectItem>
              <SelectItem value="SOUND_CREATE">サウンドクリエイト</SelectItem>
              <SelectItem value="SOUND_TECHNIQUE">サウンドテクニック</SelectItem>
              <SelectItem value="VOICE_ACTOR">声優</SelectItem>
              <SelectItem value="INTERNATIONAL_COMM">国際コミュニケーション</SelectItem>
              <SelectItem value="OTHERS">その他</SelectItem>
            </SelectContent>
          </Select>
        </label>

        <label htmlFor="search-graduation-year" className="space-y-1.5">
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
            卒業年度で絞り込む
          </span>
          <Input
            id="search-graduation-year"
            name="graduationYear"
            type="number"
            inputMode="numeric"
            min={1900}
            max={2100}
            value={graduationYear}
            onChange={(event) => setGraduationYear(event.target.value.trim())}
            placeholder="例: 2026"
          />
        </label>

        <label htmlFor="search-company" className="space-y-1.5">
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
            企業名で検索
          </span>
          <Input
            id="search-company"
            name="company"
            value={companyInput}
            onChange={(event) => setCompanyInput(event.target.value)}
            placeholder="例: 株式会社○○"
          />
        </label>

        <label htmlFor="search-page-size" className="space-y-1.5">
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
            表示件数
          </span>
          <Select value={pageSize} onValueChange={setPageSize}>
            <SelectTrigger id="search-page-size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10件</SelectItem>
              <SelectItem value="20">20件</SelectItem>
              <SelectItem value="50">50件</SelectItem>
            </SelectContent>
          </Select>
        </label>

        <div className="flex items-end">
          <Button
            type="button"
            onClick={handleReset}
            disabled={!canReset}
            className="w-full bg-stone-200 text-stone-800 hover:bg-stone-300 disabled:opacity-50 dark:bg-stone-700 dark:text-stone-100 dark:hover:bg-stone-600"
          >
            リセット
          </Button>
        </div>
      </div>
    </form>
  );
}
