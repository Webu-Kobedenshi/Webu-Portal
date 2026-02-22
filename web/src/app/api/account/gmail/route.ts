import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type GraphQlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

const linkGmailMutation = `
  mutation LinkGmail($gmail: String!) {
    linkGmail(gmail: $gmail) {
      id
      linkedGmail
    }
  }
`;

const unlinkGmailMutation = `
  mutation UnlinkGmail {
    unlinkGmail {
      id
      linkedGmail
    }
  }
`;

async function executeGraphql<T>(serviceToken: string, query: string, variables?: unknown) {
  const endpoint = process.env.GRAPHQL_ENDPOINT ?? "http://localhost:4000/graphql";
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${serviceToken}`,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });

    const text = await response.text();
    if (!text) {
      return { errors: [{ message: "Empty response from service" }] } as GraphQlResponse<T>;
    }

    return JSON.parse(text) as GraphQlResponse<T>;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to connect to service";
    return { errors: [{ message }] } as GraphQlResponse<T>;
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const serviceToken = session?.serviceToken;

    if (!serviceToken) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const { gmail } = await request.json();
    if (!gmail || typeof gmail !== "string" || !gmail.endsWith("@gmail.com")) {
      return NextResponse.json(
        { ok: false, message: "有効な @gmail.com アドレスを指定してください" },
        { status: 400 },
      );
    }

    const result = await executeGraphql<{ linkGmail: { id: string } }>(
      serviceToken,
      linkGmailMutation,
      { gmail: gmail.trim().toLowerCase() },
    );

    if (result.errors?.length || !result.data?.linkGmail) {
      return NextResponse.json(
        {
          ok: false,
          message: result.errors?.map((item) => item.message).join(", ") || "Registration failed",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: true, message: "Gmail account linked successfully" });
  } catch (err) {
    console.error("[POST /api/account/gmail] Unexpected error:", err);
    return NextResponse.json(
      { ok: false, message: "サーバーエラーが発生しました。" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    const serviceToken = session?.serviceToken;

    if (!serviceToken) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const result = await executeGraphql<{ unlinkGmail: { id: string } }>(
      serviceToken,
      unlinkGmailMutation,
    );

    if (result.errors?.length || !result.data?.unlinkGmail) {
      return NextResponse.json(
        {
          ok: false,
          message: result.errors?.map((item) => item.message).join(", ") || "Unlink failed",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: true, message: "Gmail account unlinked successfully" });
  } catch (err) {
    console.error("[DELETE /api/account/gmail] Unexpected error:", err);
    return NextResponse.json(
      { ok: false, message: "サーバーエラーが発生しました。" },
      { status: 500 },
    );
  }
}
