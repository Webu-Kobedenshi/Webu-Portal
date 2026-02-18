import { AlumniListTemplate } from "@/components/templates/alumni-list-template";
import { fetchMyProfile } from "@/graphql/account";
import { fetchAlumniList } from "@/graphql/alumni";
import { redirect } from "next/navigation";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: PageProps) {
  const { profile, error: profileError } = await fetchMyProfile();

  if (profileError === "Authentication required") {
    redirect("/login?callbackUrl=/");
  }

  if (!profile && !profileError) {
    redirect("/initial-setup");
  }

  if (!profile || profileError) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6 py-10">
        <section className="w-full rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          プロフィール取得に失敗しました。時間をおいて再読み込みしてください。
          <p className="mt-2 text-xs opacity-80">詳細: {profileError}</p>
        </section>
      </main>
    );
  }

  if (
    !profile.studentId ||
    !profile.enrollmentYear ||
    !profile.durationYears ||
    !profile.department
  ) {
    redirect("/initial-setup");
  }

  const params: Record<string, string | string[] | undefined> = (await searchParams) ?? {};
  const departmentParam = params.department;
  const companyParam = params.company;
  const pageParam = params.page;
  const pageSizeParam = params.pageSize;

  const department =
    (Array.isArray(departmentParam) ? departmentParam[0] : departmentParam)?.trim() ?? "";
  const company = (Array.isArray(companyParam) ? companyParam[0] : companyParam)?.trim() ?? "";

  const parsedPage = Number((Array.isArray(pageParam) ? pageParam[0] : pageParam)?.trim() ?? "1");
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;
  const parsedPageSize = Number(
    (Array.isArray(pageSizeParam) ? pageSizeParam[0] : pageSizeParam)?.trim() ?? "20",
  );
  const pageSize = [10, 20, 50].includes(parsedPageSize) ? parsedPageSize : 20;
  const offset = (currentPage - 1) * pageSize;

  const { alumniList, totalCount, hasNextPage, error } = await fetchAlumniList({
    department: department || undefined,
    company: company || undefined,
    limit: pageSize,
    offset,
  });

  const account = {
    id: profile.id,
    name: profile.name ?? "ユーザー",
    email: profile.email,
    role: profile.role,
  };

  return (
    <AlumniListTemplate
      alumni={alumniList}
      initialDepartment={department}
      initialCompany={company}
      totalCount={totalCount}
      currentPage={currentPage}
      pageSize={pageSize}
      hasNextPage={hasNextPage}
      account={account}
      error={error}
    />
  );
}
