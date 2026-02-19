"use client";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Select } from "@/components/atoms/select";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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
  const router = useRouter();
  const pathname = usePathname();

  const [department, setDepartment] = useState(initialDepartment || "");
  const [pageSize, setPageSize] = useState(String(initialPageSize));
  const [companyInput, setCompanyInput] = useState(initialCompany);
  const [company, setCompany] = useState(initialCompany);
  const canReset = Boolean(department || companyInput || pageSize !== "20");

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

    if (pageSize !== "20") {
      query.set("pageSize", pageSize);
    }

    const serialized = query.toString();
    return serialized ? `${pathname}?${serialized}` : pathname;
  }, [company, department, pageSize, pathname]);

  useEffect(() => {
    router.replace(nextHref, { scroll: false });
  }, [nextHref, router]);

  const handleReset = () => {
    setDepartment("");
    setCompanyInput("");
    setCompany("");
    setPageSize("20");
    router.replace(pathname, { scroll: false });
  };

  return (
    <form className="liquid-glass rounded-2xl p-4" onSubmit={(event) => event.preventDefault()}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_120px_auto]">
        <label htmlFor="search-department" className="space-y-1.5">
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
            学科で絞り込む
          </span>
          <Select
            id="search-department"
            name="department"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
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
            value={companyInput}
            onChange={(event) => setCompanyInput(event.target.value)}
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
            value={pageSize}
            onChange={(event) => setPageSize(event.target.value)}
          >
            <option value="10">10件</option>
            <option value="20">20件</option>
            <option value="50">50件</option>
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
