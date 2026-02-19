import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Body = {
  fileName?: string;
  contentType?: string;
};

type GraphQlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

const getUploadUrlMutation = `
  mutation GetUploadUrl($fileName: String!, $contentType: String!) {
    getUploadUrl(fileName: $fileName, contentType: $contentType) {
      uploadUrl
      fileUrl
      key
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
  const fileName = body.fileName?.trim();
  const contentType = body.contentType?.trim();

  if (!fileName || !contentType) {
    return NextResponse.json(
      { ok: false, message: "fileName and contentType are required" },
      { status: 400 },
    );
  }

  if (!contentType.startsWith("image/")) {
    return NextResponse.json(
      { ok: false, message: "contentType must be image/*" },
      { status: 400 },
    );
  }

  const endpoint = process.env.GRAPHQL_ENDPOINT ?? "http://localhost:4000/graphql";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${serviceToken}`,
    },
    body: JSON.stringify({
      query: getUploadUrlMutation,
      variables: {
        fileName,
        contentType,
      },
    }),
    cache: "no-store",
  });

  const result = (await response.json()) as GraphQlResponse<{
    getUploadUrl: {
      uploadUrl: string;
      fileUrl: string;
      key: string;
    };
  }>;

  if (!response.ok || result.errors?.length || !result.data?.getUploadUrl) {
    return NextResponse.json(
      {
        ok: false,
        message:
          result.errors?.map((item) => item.message).join(", ") || "Failed to get upload url",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    ...result.data.getUploadUrl,
  });
}
