import { SearchField } from "@/components/molecules/search-field";
import { AlumniCard } from "@/components/organisms/alumni-card";
import type { Alumni } from "@/graphql/types";

type AlumniListTemplateProps = {
  alumni: Alumni[];
  initialKeyword: string;
  initialDepartment: string;
  error?: string;
};

export function AlumniListTemplate({
  alumni,
  initialKeyword,
  initialDepartment,
  error,
}: AlumniListTemplateProps) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl p-6 md:p-10">
      <header>
        <h1 className="text-2xl font-semibold md:text-3xl">神戸電子 OB/OG ポータル</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          卒業生の就職実績やメッセージを検索できます。
        </p>
      </header>

      <section className="mt-6">
        <SearchField initialKeyword={initialKeyword} initialDepartment={initialDepartment} />
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
    </main>
  );
}
