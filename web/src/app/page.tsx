import { AlumniListTemplate } from "@/components/templates/alumni-list-template";
import { fetchAlumniList } from "@/graphql/alumni";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: PageProps) {
  const params: Record<string, string | string[] | undefined> = (await searchParams) ?? {};
  const departmentParam = params.department;
  const pageParam = params.page;
  const pageSizeParam = params.pageSize;

  const department =
    (Array.isArray(departmentParam) ? departmentParam[0] : departmentParam)?.trim() ?? "";

  const parsedPage = Number((Array.isArray(pageParam) ? pageParam[0] : pageParam)?.trim() ?? "1");
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;
  const parsedPageSize = Number(
    (Array.isArray(pageSizeParam) ? pageSizeParam[0] : pageSizeParam)?.trim() ?? "20",
  );
  const pageSize = [10, 20, 50].includes(parsedPageSize) ? parsedPageSize : 20;
  const offset = (currentPage - 1) * pageSize;

  const { alumniList, totalCount, hasNextPage, error } = await fetchAlumniList({
    department: department || undefined,
    limit: pageSize,
    offset,
  });

  return (
    <AlumniListTemplate
      alumni={alumniList}
      initialDepartment={department}
      totalCount={totalCount}
      currentPage={currentPage}
      pageSize={pageSize}
      hasNextPage={hasNextPage}
      error={error}
    />
  );
}
