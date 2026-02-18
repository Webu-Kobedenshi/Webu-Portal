import type { MyAccountProfile } from "@/graphql/types";
import Link from "next/link";

type AccountBadgeProps = {
  account: MyAccountProfile;
};

const roleLabel: Record<MyAccountProfile["role"], string> = {
  STUDENT: "在校生",
  ALUMNI: "卒業生",
  ADMIN: "管理者",
};

export function AccountBadge({ account }: AccountBadgeProps) {
  const initial = (account.name || account.email || "U").slice(0, 1).toUpperCase();

  return (
    <Link
      href="/account"
      className="inline-flex items-center gap-2 rounded-xl border border-stone-200/80 bg-white/80 px-2.5 py-2 text-left transition-all hover:bg-white dark:border-stone-700/60 dark:bg-stone-900/60 dark:hover:bg-stone-900"
      aria-label="アカウントページ"
    >
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white">
        {initial}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[12px] font-semibold text-stone-800 dark:text-stone-200">
          {account.name}
        </span>
        <span className="block text-[10px] text-stone-500 dark:text-stone-400">
          {roleLabel[account.role]}
        </span>
      </span>
    </Link>
  );
}
