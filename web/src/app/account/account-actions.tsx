"use client";

import { Button } from "@/components/atoms/button";
import { signOut } from "next-auth/react";
import { useState } from "react";

export function AccountActions() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("本当にアカウントを削除しますか？この操作は元に戻せません。")) {
      return;
    }

    setIsDeleting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/account/delete", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("アカウント削除に失敗しました");
      }

      await signOut({ callbackUrl: "/login?accountDeleted=1" });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "削除に失敗しました");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {message ? (
        <p className="mb-3 rounded-xl border border-rose-200/80 bg-rose-50/80 px-3 py-2 text-xs text-rose-700 dark:border-rose-800/50 dark:bg-rose-950/30 dark:text-rose-300">
          {message}
        </p>
      ) : null}

      <div className="flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="!bg-gradient-to-r !from-rose-600 !to-pink-600 hover:!from-rose-500 hover:!to-pink-500"
        >
          ログアウト
        </Button>
        <Button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="!bg-gradient-to-r !from-rose-600 !to-pink-600 hover:!from-rose-500 hover:!to-pink-500"
        >
          {isDeleting ? "削除中..." : "アカウント削除"}
        </Button>
      </div>
    </div>
  );
}
