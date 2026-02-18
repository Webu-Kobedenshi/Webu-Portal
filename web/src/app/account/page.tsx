import { AccountActions } from "@/app/account/account-actions";
import { authOptions } from "@/auth";
import { AccountProfileForm } from "@/components/organisms/account-profile-form";
import { fetchMyProfile } from "@/graphql/account";
import { getServerSession } from "next-auth";
import Link from "next/link";

const roleLabel: Record<"STUDENT" | "ALUMNI" | "ADMIN", string> = {
  STUDENT: "在校生",
  ALUMNI: "卒業生",
  ADMIN: "管理者",
};

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  const { profile } = await fetchMyProfile();
  const role = (profile?.role ?? session?.user?.role) as "STUDENT" | "ALUMNI" | "ADMIN" | undefined;

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-6 py-8">
      <section className="liquid-glass rounded-2xl p-6">
        <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">アカウント</h1>

        <dl className="mt-5 space-y-3 text-sm">
          <div>
            <dt className="text-stone-500 dark:text-stone-400">ロール</dt>
            <dd className="font-medium text-stone-800 dark:text-stone-200">
              {role ? roleLabel[role] : "-"}
            </dd>
          </div>
        </dl>

        <AccountProfileForm
          initialProfile={profile}
          initialName={profile?.name ?? session?.user?.name}
          initialEmail={profile?.email ?? session?.user?.email}
        />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-xl border border-stone-200/80 px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 dark:border-stone-700/60 dark:text-stone-300 dark:hover:bg-stone-800/60"
          >
            一覧へ戻る
          </Link>

          <AccountActions />
        </div>
      </section>
    </main>
  );
}
