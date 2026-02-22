"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export function LoginPageClient() {
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
          Googleアカウントでログインしてください。
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

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <button
              type="button"
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              onClick={() => signIn("google", { callbackUrl })}
            >
              在校生はこちら
            </button>
            <p className="text-center text-[11px] text-zinc-500 dark:text-zinc-400">
              @st.kobedenshi.ac.jp アカウントを使用推奨
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
                あるいは
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              className="inline-flex h-10 w-full items-center justify-center rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
              onClick={() => signIn("google", { callbackUrl })}
            >
              卒業生はこちら
            </button>
            <p className="text-center text-[11px] text-zinc-500 dark:text-zinc-400">
              Gmailアカウントでログインしてください
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-blue-50 p-4 text-xs leading-relaxed text-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
          <strong className="block font-semibold">⚠️ 在校生の方へ重要なお知らせ</strong>
          <p className="mt-1">
            学校のアカウント（@st.kobedenshi.ac.jp）は卒業後に失効します。卒業後もプロフィールにアクセスできるよう、
            <strong>在学中にログイン後、アカウント設定から「引き継ぎGmail」の登録</strong>
            をお願いします。
          </p>
        </div>
      </section>
    </main>
  );
}
