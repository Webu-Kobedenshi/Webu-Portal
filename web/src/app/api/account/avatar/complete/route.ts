import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Body = {
  url?: string;
};

type GraphQlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

const updateAvatarMutation = `
  mutation UpdateAvatar($url: String!) {
    updateAvatar(url: $url) {
      id
      avatarUrl
    }
  }
`;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const serviceToken = session?.serviceToken;

  if (!serviceToken) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Body;
  const url = body.url?.trim();

  if (!url) {
    return NextResponse.json({ ok: false, message: "url is required" }, { status: 400 });
  }

  const endpoint = process.env.GRAPHQL_ENDPOINT ?? "http://localhost:4000/graphql";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${serviceToken}`,
    },
    body: JSON.stringify({
      query: updateAvatarMutation,
      variables: { url },
    }),
    cache: "no-store",
  });

  const result = (await response.json()) as GraphQlResponse<{
    updateAvatar: {
      id: string;
      avatarUrl: string | null;
    };
  }>;

  if (!response.ok || result.errors?.length || !result.data?.updateAvatar) {
    return NextResponse.json(
      {
        ok: false,
        message: result.errors?.map((item) => item.message).join(", ") || "Failed to update avatar",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    avatarUrl: result.data.updateAvatar.avatarUrl,
  });
}
