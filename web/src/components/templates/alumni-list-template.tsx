import { Badge } from "@/components/atoms/badge";
import { SearchField } from "@/components/molecules/search-field";
import { AccountBadge } from "@/components/organisms/account-badge";
import { AlumniCard } from "@/components/organisms/alumni-card";
import type { AlumniProfile, MyAccountProfile } from "@/graphql/types";
import Link from "next/link";

type AlumniListTemplateProps = {
  alumni: AlumniProfile[];
  initialDepartment: string;
  initialCompany: string;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  account: MyAccountProfile;
  error?: string;
};

export function AlumniListTemplate({
  alumni,
  initialDepartment,
  initialCompany,
  totalCount,
  currentPage,
  pageSize,
  hasNextPage,
  account,
  error,
}: AlumniListTemplateProps) {
  const hasPrevPage = currentPage > 1;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentShownCount = alumni.length;

  const buildPageHref = (page: number) => {
    const query = new URLSearchParams();
    if (initialDepartment) {
      query.set("department", initialDepartment);
    }
    if (initialCompany) {
      query.set("company", initialCompany);
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
    <main className="mx-auto min-h-screen w-full max-w-[1400px] px-4 py-6 md:px-8 md:py-8">
      <header className="liquid-glass-strong rounded-2xl p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
              <p className="text-[11px] font-semibold tracking-[0.12em] text-violet-600 dark:text-violet-400">
                We部運営
              </p>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-stone-900 md:text-2xl dark:text-stone-100">
              神戸電子専門学校 OB/OG一覧
            </h1>
            <p className="mt-1 text-[13px] text-stone-500 dark:text-stone-400">
              あの企業に就職した先輩に話が聞けるかも！？
            </p>
          </div>
          <div className="hidden lg:block">
            <AccountBadge account={account} />
          </div>
        </div>
      </header>

      <section className="mt-4">
        <SearchField
          initialDepartment={initialDepartment}
          initialCompany={initialCompany}
          initialPageSize={pageSize}
        />
      </section>

      <section className="mt-4 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-stone-600 dark:text-stone-400">
          <span className="tabular-nums font-semibold text-stone-900 dark:text-stone-200">
            {totalCount}
          </span>
          <span>件</span>
        </div>
        <div className="h-3.5 w-px bg-stone-200 dark:bg-stone-700" />
        {initialDepartment ? (
          <Badge variant="default">学科で絞り込み中</Badge>
        ) : (
          <Badge variant="secondary">全学科</Badge>
        )}
        {initialCompany ? <Badge variant="default">企業: {initialCompany}</Badge> : null}
      </section>

      {error ? (
        <section className="mt-4 rounded-xl border border-rose-200/80 bg-rose-50/80 p-4 text-[13px] font-medium text-rose-700 backdrop-blur dark:border-rose-800/50 dark:bg-rose-950/30 dark:text-rose-300">
          {error}
        </section>
      ) : null}

      <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {alumni.length > 0 ? (
          alumni.map((item) => <AlumniCard key={item.id} alumni={item} />)
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300/80 py-16 dark:border-stone-700/60">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800" />
            <p className="mt-4 text-[13px] font-medium text-stone-600 dark:text-stone-400">
              条件に一致するOB/OGが見つかりませんでした
            </p>
            <p className="mt-1 text-[12px] text-stone-400 dark:text-stone-500">
              学科フィルタを解除するか、検索条件を変えてお試しください
            </p>
          </div>
        )}
      </section>

      {totalCount > 0 && (
        <section className="mt-8 flex items-center justify-center gap-1.5">
          {hasPrevPage ? (
            <Link
              href={buildPageHref(currentPage - 1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200/80 bg-white/80 text-stone-600 transition-all hover:bg-stone-50 hover:text-stone-900 active:scale-95 dark:border-stone-700/60 dark:bg-stone-900/60 dark:text-stone-400 dark:hover:bg-stone-800/80 dark:hover:text-stone-200"
              aria-label="前のページ"
            >
              <span>‹</span>
            </Link>
          ) : (
            <span className="inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-xl border border-stone-200/50 text-stone-300 dark:border-stone-800/50 dark:text-stone-700">
              ‹
            </span>
          )}

          <span className="px-3 text-[13px] tabular-nums text-stone-600 dark:text-stone-400">
            <span className="font-semibold text-stone-900 dark:text-stone-200">{currentPage}</span>
            <span className="mx-1 text-stone-300 dark:text-stone-600">/</span>
            <span>{totalPages}</span>
          </span>

          {hasNextPage ? (
            <Link
              href={buildPageHref(currentPage + 1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200/80 bg-white/80 text-stone-600 transition-all hover:bg-stone-50 hover:text-stone-900 active:scale-95 dark:border-stone-700/60 dark:bg-stone-900/60 dark:text-stone-400 dark:hover:bg-stone-800/80 dark:hover:text-stone-200"
              aria-label="次のページ"
            >
              <span>›</span>
            </Link>
          ) : (
            <span className="inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-xl border border-stone-200/50 text-stone-300 dark:border-stone-800/50 dark:text-stone-700">
              ›
            </span>
          )}
        </section>
      )}
    </main>
  );
}
