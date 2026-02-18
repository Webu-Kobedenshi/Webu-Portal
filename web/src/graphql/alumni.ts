import type { Alumni, Department } from "./types";

type AlumniListData = {
  alumniList: Alumni[];
};

type GraphQlResponse<TData> = {
  data?: TData;
  errors?: Array<{ message: string }>;
};

const alumniListQuery = `
  query AlumniList($search: String, $department: Department) {
    alumniList(search: $search, department: $department) {
      id
      name
      graduationYear
      department
      company
      message
      contactEmail
      isContactable
      isPublic
      createdAt
      updatedAt
    }
  }
`;

export async function fetchAlumniList(params: { search?: string; department?: string }) {
  const endpoint = process.env.GRAPHQL_ENDPOINT ?? "http://localhost:4000/graphql";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        query: alumniListQuery,
        variables: {
          search: params.search,
          department: params.department as Department | undefined,
        },
      }),
    });

    const json = (await response.json()) as GraphQlResponse<AlumniListData>;

    if (json.errors?.length) {
      return {
        alumniList: [] satisfies Alumni[],
        error: json.errors.map((item) => item.message).join(", "),
      };
    }

    return {
      alumniList: json.data?.alumniList ?? [],
      error: "",
    };
  } catch (error) {
    return {
      alumniList: [] satisfies Alumni[],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
