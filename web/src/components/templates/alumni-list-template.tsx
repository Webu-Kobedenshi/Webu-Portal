import { SearchField } from "@/components/molecules/search-field";
import { AlumniCard } from "@/components/organisms/alumni-card";
import type { AlumniProfile } from "@/graphql/types";
import Link from "next/link";

type AlumniListTemplateProps = {
  alumni: AlumniProfile[];
  initialDepartment: string;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  error?: string;
};

export function AlumniListTemplate({
  alumni,
  initialDepartment,
  totalCount,
  currentPage,
  pageSize,
  hasNextPage,
  error,
}: AlumniListTemplateProps) {
  const hasPrevPage = currentPage > 1;
  const start = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = totalCount === 0 ? 0 : Math.min(start + alumni.length - 1, totalCount);

  const buildPageHref = (page: number) => {
    const query = new URLSearchParams();
    if (initialDepartment) {
      query.set("department", initialDepartment);
    }
    if (pageSize !== 20) {
      query.set("pageSize", String(pageSize));
    }
    if (page > 1) {
      query.set("page", String(page));
    }

    const serialized = query.toString();
    return serialized ? `/?${serialized}` : "/";
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl p-6 md:p-10">
      <header>
        <h1 className="text-2xl font-semibold md:text-3xl">神戸電子 OB/OG ポータル</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          学科で絞り込み、卒業生情報を閲覧できます。
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">該当件数: {totalCount}件</p>
      </header>

      <section className="mt-6">
        <SearchField initialDepartment={initialDepartment} initialPageSize={pageSize} />
      </section>

      {error ? (
        <section className="mt-6 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </section>
      ) : null}

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {alumni.length > 0 ? (
          alumni.map((item) => <AlumniCard key={item.id} alumni={item} />)
        ) : (
          <p className="rounded-lg border border-dashed border-zinc-300 p-5 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            条件に一致するOB/OGが見つかりませんでした。
          </p>
        )}
      </section>

      <section className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-zinc-200 pt-4 text-sm text-zinc-600 md:flex-row dark:border-zinc-800 dark:text-zinc-300">
        <p>
          {start}〜{end} / 全{totalCount}件
        </p>
        <div className="flex items-center gap-2">
          {hasPrevPage ? (
            <Link
              href={buildPageHref(currentPage - 1)}
              className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 px-3 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              前へ
            </Link>
          ) : (
            <span className="inline-flex h-9 cursor-not-allowed items-center justify-center rounded-md border border-zinc-200 px-3 text-zinc-400 dark:border-zinc-800 dark:text-zinc-600">
              前へ
            </span>
          )}

          <span className="px-2 text-zinc-500 dark:text-zinc-400">{currentPage}ページ</span>

          {hasNextPage ? (
            <Link
              href={buildPageHref(currentPage + 1)}
              className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 px-3 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              次へ
            </Link>
          ) : (
            <span className="inline-flex h-9 cursor-not-allowed items-center justify-center rounded-md border border-zinc-200 px-3 text-zinc-400 dark:border-zinc-800 dark:text-zinc-600">
              次へ
            </span>
          )}
        </div>
      </section>
    </main>
  );
}
