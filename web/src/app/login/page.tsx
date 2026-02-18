"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const error = searchParams.get("error");
  const accountDeleted = searchParams.get("accountDeleted");

  const errorMessage =
    error === "OAuthSignin"
      ? "Google OAuth設定が不足しています。GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET を設定してください。"
      : error === "AccessDenied"
        ? "このアカウントはログイン許可対象外です。許可ドメイン（既定: @st.kobedenshi.ac.jp）でログインしてください。"
        : null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <section className="w-full rounded-xl border border-zinc-200 p-6 shadow-sm dark:border-zinc-800">
        <h1 className="text-xl font-semibold">ログイン</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          神戸電子のGoogleアカウント（@st.kobedenshi.ac.jp）でログインしてください。
        </p>

        {errorMessage ? (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {errorMessage}
          </p>
        ) : null}

        {accountDeleted ? (
          <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            アカウントを削除しました。
          </p>
        ) : null}

        <div className="mt-6">
          <button
            type="button"
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            onClick={() => signIn("google", { callbackUrl })}
          >
            Googleでログイン
          </button>
        </div>
      </section>
    </main>
  );
}
