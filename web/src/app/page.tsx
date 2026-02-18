import { AlumniListTemplate } from "@/components/templates/alumni-list-template";
import { fetchAlumniList } from "@/graphql/alumni";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: PageProps) {
  const params: Record<string, string | string[] | undefined> =
    (await searchParams) ?? {};
  const q = params.q;
  const departmentParam = params.department;

  const keyword = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
  const department =
    (Array.isArray(departmentParam)
      ? departmentParam[0]
      : departmentParam
    )?.trim() ?? "";

  const { alumniList, error } = await fetchAlumniList({
    search: keyword || undefined,
    department: department || undefined,
  });

  return (
    <AlumniListTemplate
      alumni={alumniList}
      initialKeyword={keyword}
      initialDepartment={department}
      error={error}
    />
  );
}
