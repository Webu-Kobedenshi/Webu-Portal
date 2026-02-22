import { AccountProfileForm } from "@/components/organisms/account-profile-form";
import { fetchMyProfile } from "@/graphql/account";
export default async function InitialSetupPage() {
  const { profile } = await fetchMyProfile();

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-10">
      <section className="liquid-glass w-full rounded-2xl p-6">
        <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">初期設定</h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
          最初に必要なプロフィール情報（名前・学籍番号・入学年度・年制・学科）を入力してください。
        </p>

        <AccountProfileForm
          initialProfile={profile}
          initialName={profile?.name}
          title="初期プロフィール入力"
          description="入力内容はアカウントページからいつでも編集・更新できます。"
          showPublicProfileFields={false}
          showLinkedGmailField={false}
          redirectOnSuccess="/"
        />
      </section>
    </main>
  );
}
