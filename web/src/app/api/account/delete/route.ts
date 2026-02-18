import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type GraphQlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

const deleteMyAccountMutation = `
  mutation DeleteMyAccount {
    deleteMyAccount
  }
`;

export async function POST() {
  const session = await getServerSession(authOptions);
  const serviceToken = session?.serviceToken;

  if (!serviceToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const endpoint = process.env.GRAPHQL_ENDPOINT ?? "http://localhost:4000/graphql";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${serviceToken}`,
    },
    body: JSON.stringify({
      query: deleteMyAccountMutation,
    }),
    cache: "no-store",
  });

  const result = (await response.json()) as GraphQlResponse<{ deleteMyAccount: boolean }>;

  if (!response.ok || result.errors?.length || !result.data?.deleteMyAccount) {
    return NextResponse.json(
      {
        ok: false,
        message:
          result.errors?.map((item) => item.message).join(", ") || "アカウント削除に失敗しました",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
