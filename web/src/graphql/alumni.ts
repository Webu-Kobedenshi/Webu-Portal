import type { AlumniConnection, AlumniProfile, Department } from "./types";

type AlumniListData = {
  getAlumniList: AlumniConnection;
};

type GraphQlResponse<TData> = {
  data?: TData;
  errors?: Array<{ message: string }>;
};

const alumniListQuery = `
  query GetAlumniList($department: Department, $limit: Int!, $offset: Int!) {
    getAlumniList(department: $department, limit: $limit, offset: $offset) {
      items {
        id
        userId
        nickname
        graduationYear
        department
        companyName
        remarks
        contactEmail
        isPublic
        acceptContact
        createdAt
        updatedAt
      }
      totalCount
      hasNextPage
    }
  }
`;

export async function fetchAlumniList(params: {
  department?: string;
  limit?: number;
  offset?: number;
}) {
  const endpoint = process.env.GRAPHQL_ENDPOINT ?? "http://localhost:4000/graphql";
  const limit = params.limit ?? 20;
  const offset = params.offset ?? 0;

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
          department: params.department as Department | undefined,
          limit,
          offset,
        },
      }),
    });

    const json = (await response.json()) as GraphQlResponse<AlumniListData>;

    if (json.errors?.length) {
      return {
        alumniList: [] satisfies AlumniProfile[],
        totalCount: 0,
        hasNextPage: false,
        error: json.errors.map((item) => item.message).join(", "),
      };
    }

    return {
      alumniList: json.data?.getAlumniList.items ?? [],
      totalCount: json.data?.getAlumniList.totalCount ?? 0,
      hasNextPage: json.data?.getAlumniList.hasNextPage ?? false,
      error: "",
    };
  } catch (error) {
    return {
      alumniList: [] satisfies AlumniProfile[],
      totalCount: 0,
      hasNextPage: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
