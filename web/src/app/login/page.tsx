import { Suspense } from "react";
import { LoginPageClient } from "./login-page-client";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageClient />
    </Suspense>
  );
}

function LoginPageFallback() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <section className="w-full rounded-xl border border-zinc-200 p-6 shadow-sm dark:border-zinc-800">
        <h1 className="text-xl font-semibold">ログイン</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          神戸電子のGoogleアカウント（@st.kobedenshi.ac.jp）でログインしてください。
        </p>

        <div className="mt-6">
          <button
            type="button"
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            disabled
          >
            Googleでログイン
          </button>
        </div>
      </section>
    </main>
  );
}
