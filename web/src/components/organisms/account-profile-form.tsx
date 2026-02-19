"use client";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Select } from "@/components/atoms/select";
import type { AlumniProfile, Department, UserStatus } from "@/graphql/types";
import { useMemo, useRef, useState } from "react";

type Role = "STUDENT" | "ALUMNI" | "ADMIN";

type InitialProfile = {
  id: string;
  email: string;
  name: string | null;
  studentId: string | null;
  role: Role;
  status: UserStatus;
  enrollmentYear: number | null;
  durationYears: number | null;
  department: Department | null;
  alumniProfile: AlumniProfile | null;
} | null;

type AccountProfileFormProps = {
  initialProfile?: InitialProfile;
  initialName?: string | null;
  initialEmail?: string | null;
  title?: string;
  description?: string;
  showPublicProfileFields?: boolean;
};

type AccountProfileFormState = {
  name: string;
  studentId: string;
  enrollmentYear: string;
  durationYears: "" | "2" | "3" | "4";
  department: Department | "";
  nickname: string;
  companyNames: string[];
  remarks: string;
  contactEmail: string;
  isPublic: boolean;
  acceptContact: boolean;
};

const defaultState: AccountProfileFormState = {
  name: "",
  studentId: "",
  enrollmentYear: "",
  durationYears: "",
  department: "",
  nickname: "",
  companyNames: [],
  remarks: "",
  contactEmail: "",
  isPublic: false,
  acceptContact: false,
};

const departmentOptions: Array<{ value: Department; label: string }> = [
  { value: "IT_EXPERT", label: "ITエキスパート" },
  { value: "IT_SPECIALIST", label: "ITスペシャリスト" },
  { value: "INFORMATION_PROCESS", label: "情報処理" },
  { value: "PROGRAMMING", label: "プログラミング" },
  { value: "AI_SYSTEM", label: "AIシステム開発" },
  { value: "ADVANCED_STUDIES", label: "総合研究科" },
  { value: "INFO_BUSINESS", label: "情報ビジネス" },
  { value: "INFO_ENGINEERING", label: "情報工学" },
  { value: "GAME_RESEARCH", label: "ゲーム開発研究" },
  { value: "GAME_ENGINEER", label: "ゲームエンジニア" },
  { value: "GAME_SOFTWARE", label: "ゲーム制作" },
  { value: "ESPORTS", label: "esportsエンジニア" },
  { value: "CG_ANIMATION", label: "CGアニメーション" },
  { value: "DIGITAL_ANIME", label: "デジタルアニメ" },
  { value: "GRAPHIC_DESIGN", label: "グラフィックデザイン" },
  { value: "INDUSTRIAL_DESIGN", label: "インダストリアルデザイン" },
  { value: "ARCHITECTURAL", label: "建築" },
  { value: "SOUND_CREATE", label: "サウンドクリエイト" },
  { value: "SOUND_TECHNIQUE", label: "サウンドテクニック" },
  { value: "VOICE_ACTOR", label: "声優" },
  { value: "INTERNATIONAL_COMM", label: "国際コミュニケーション" },
  { value: "OTHERS", label: "その他" },
];

function createRowId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2);
}

export function AccountProfileForm({
  initialProfile,
  initialName,
  initialEmail,
  title = "プロフィール・公開情報",
  description = "初期設定で入力した項目を更新できます。公開する内定先情報もここで管理します。",
  showPublicProfileFields = true,
}: AccountProfileFormProps) {
  const initialCompanyNames = initialProfile?.alumniProfile?.companyNames
    ?.length
    ? [...initialProfile.alumniProfile.companyNames]
    : [];
  const initialAvatarUrl = initialProfile?.alumniProfile?.avatarUrl ?? null;
  const initialIsPublic =
    (initialProfile?.alumniProfile?.isPublic ?? false) &&
    initialCompanyNames.length > 0;

  const [state, setState] = useState<AccountProfileFormState>({
    ...defaultState,
    name: initialProfile?.name ?? initialName ?? "",
    studentId: initialProfile?.studentId ?? "",
    enrollmentYear: initialProfile?.enrollmentYear
      ? String(initialProfile.enrollmentYear)
      : "",
    durationYears: initialProfile?.durationYears
      ? (String(
          initialProfile.durationYears,
        ) as AccountProfileFormState["durationYears"])
      : "",
    department: initialProfile?.department ?? "",
    nickname: initialProfile?.alumniProfile?.nickname ?? initialName ?? "",
    companyNames: initialCompanyNames,
    remarks: initialProfile?.alumniProfile?.remarks ?? "",
    contactEmail:
      initialProfile?.alumniProfile?.contactEmail ?? initialEmail ?? "",
    isPublic: initialIsPublic,
    acceptContact: initialProfile?.alumniProfile?.acceptContact ?? false,
  });
  const [companyRowIds, setCompanyRowIds] = useState<string[]>(() =>
    initialCompanyNames.map(() => createRowId()),
  );
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null,
  );
  const avatarFileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [avatarMessage, setAvatarMessage] = useState("");
  const [hasAlumniProfile, setHasAlumniProfile] = useState(
    Boolean(initialProfile?.alumniProfile),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const canSubmitInitial = useMemo(() => {
    const enrollmentYear = Number(state.enrollmentYear);
    return (
      Boolean(state.name.trim()) &&
      Boolean(state.studentId.trim()) &&
      Number.isFinite(enrollmentYear) &&
      enrollmentYear >= 2000 &&
      enrollmentYear <= 2100 &&
      ["2", "3", "4"].includes(state.durationYears) &&
      Boolean(state.department)
    );
  }, [state]);

  const canEditAlumniProfile = state.isPublic;

  const setField = <K extends keyof AccountProfileFormState>(
    key: K,
    value: AccountProfileFormState[K],
  ) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const setCompanyNameAt = (index: number, value: string) => {
    setState((prev) => {
      const next = [...prev.companyNames];
      next[index] = value;
      return { ...prev, companyNames: next };
    });
  };

  const addCompanyNameField = () => {
    setCompanyRowIds((prev) => [...prev, createRowId()]);
    setState((prev) => ({
      ...prev,
      companyNames: [...prev.companyNames, ""],
    }));
  };

  const removeCompanyNameField = (index: number) => {
    setCompanyRowIds((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index),
    );

    setState((prev) => ({
      ...prev,
      companyNames: prev.companyNames.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
      isPublic:
        prev.companyNames.filter((_, itemIndex) => itemIndex !== index).length >
        0
          ? prev.isPublic
          : false,
      acceptContact:
        prev.companyNames.filter((_, itemIndex) => itemIndex !== index).length >
        0
          ? prev.acceptContact
          : false,
    }));
  };

  const saveProfile = async (options?: {
    silent?: boolean;
    forcePrivate?: boolean;
  }): Promise<boolean> => {
    const silent = options?.silent ?? false;
    const forcePrivate = options?.forcePrivate ?? false;

    if (!silent) {
      setError("");
      setMessage("");
    }

    if (!canSubmitInitial) {
      const msg = "名前・学籍番号・入学年度・年制(2/3/4)・学科は必須です。";
      if (silent) {
        setAvatarError(msg);
      } else {
        setError(msg);
      }
      return false;
    }

    const normalizedCompanyNames = Array.from(
      new Set(
        state.companyNames
          .map((item) => item.trim())
          .filter((item) => item.length > 0),
      ),
    );
    const normalizedContactEmail =
      state.contactEmail.trim() || (initialEmail?.trim() ?? "");
    const isPublicToSave = forcePrivate ? false : state.isPublic;

    if (
      showPublicProfileFields &&
      isPublicToSave &&
      normalizedCompanyNames.length === 0
    ) {
      const msg = "公開する場合は内定先・勤務先を1件以上入力してください。";
      if (silent) {
        setAvatarError(msg);
      } else {
        setError(msg);
      }
      return false;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/account/profile", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: state.name.trim(),
          studentId: state.studentId.trim(),
          enrollmentYear: Number(state.enrollmentYear),
          durationYears: Number(state.durationYears),
          department: state.department,
          nickname: state.nickname,
          companyNames: normalizedCompanyNames,
          remarks: state.remarks,
          contactEmail: normalizedContactEmail,
          isPublic: isPublicToSave,
          acceptContact: isPublicToSave ? state.acceptContact : false,
        }),
      });

      const json = (await response.json()) as {
        ok?: boolean;
        message?: string;
        alumniUpdated?: boolean;
      };

      if (!response.ok || !json.ok) {
        throw new Error(json.message || "更新に失敗しました");
      }

      if (json.alumniUpdated) {
        setHasAlumniProfile(true);
      }

      if (!silent) {
        if (!showPublicProfileFields) {
          setMessage("保存しました。初期情報を更新しました。");
        } else if (json.alumniUpdated) {
          setMessage(
            "保存しました。初期情報と公開プロフィールを更新しました。",
          );
        } else {
          setMessage("保存しました。初期情報を更新しました。");
        }
      }

      return true;
    } catch (submitError) {
      const msg =
        submitError instanceof Error
          ? submitError.message
          : "更新に失敗しました";
      if (silent) {
        setAvatarError(msg);
      } else {
        setError(msg);
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await saveProfile();
  };

  const handleAvatarUpload = async () => {
    setAvatarError("");
    setAvatarMessage("");

    if (!selectedAvatarFile) {
      setAvatarError("画像ファイルを選択してください。");
      return;
    }

    if (!selectedAvatarFile.type.startsWith("image/")) {
      setAvatarError("画像ファイルのみアップロードできます。");
      return;
    }

    if (!hasAlumniProfile) {
      const saved = await saveProfile({ silent: true, forcePrivate: true });
      if (!saved) {
        return;
      }
    }

    setIsUploadingAvatar(true);

    try {
      const uploadUrlResponse = await fetch("/api/account/avatar/upload-url", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          fileName: selectedAvatarFile.name,
          contentType: selectedAvatarFile.type,
        }),
      });

      const uploadUrlJson = (await uploadUrlResponse.json()) as {
        ok?: boolean;
        message?: string;
        uploadUrl?: string;
        fileUrl?: string;
      };

      if (
        !uploadUrlResponse.ok ||
        !uploadUrlJson.ok ||
        !uploadUrlJson.uploadUrl ||
        !uploadUrlJson.fileUrl
      ) {
        throw new Error(
          uploadUrlJson.message || "アップロードURLの取得に失敗しました",
        );
      }

      const putResponse = await fetch(uploadUrlJson.uploadUrl, {
        method: "PUT",
        headers: {
          "content-type": selectedAvatarFile.type,
        },
        body: selectedAvatarFile,
      });

      if (!putResponse.ok) {
        throw new Error("画像アップロードに失敗しました");
      }

      const completeResponse = await fetch("/api/account/avatar/complete", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          url: uploadUrlJson.fileUrl,
        }),
      });

      const completeJson = (await completeResponse.json()) as {
        ok?: boolean;
        message?: string;
        avatarUrl?: string | null;
      };

      if (!completeResponse.ok || !completeJson.ok) {
        throw new Error(completeJson.message || "画像URLの保存に失敗しました");
      }

      setAvatarUrl(completeJson.avatarUrl ?? uploadUrlJson.fileUrl);
      setSelectedAvatarFile(null);
      if (avatarFileInputRef.current) {
        avatarFileInputRef.current.value = "";
      }
      setAvatarMessage("プロフィール画像を更新しました。");
    } catch (uploadError) {
      setAvatarError(
        uploadError instanceof Error
          ? uploadError.message
          : "画像アップロードに失敗しました",
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {/* ─── Section 1: 基本情報 ─── */}
      <section className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-[0_8px_24px_-18px_rgba(0,0,0,0.25)] dark:border-stone-800/80 dark:bg-stone-900/40">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-sm dark:bg-violet-900/40">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-violet-600 dark:text-violet-400"
            >
              <title>基本情報</title>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            基本情報
          </h3>
          <span className="ml-auto rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
            必須
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label htmlFor="profile-name" className="space-y-1.5 sm:col-span-2">
            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              名前
            </span>
            <Input
              id="profile-name"
              value={state.name}
              onChange={(event) => setField("name", event.target.value)}
              placeholder="例: 山田 太郎"
              required
            />
          </label>

          <label htmlFor="profile-student-id" className="space-y-1.5">
            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              学籍番号
            </span>
            <Input
              id="profile-student-id"
              value={state.studentId}
              onChange={(event) => setField("studentId", event.target.value)}
              placeholder="例: 24A1234"
              required
            />
          </label>

          <label htmlFor="profile-enrollment-year" className="space-y-1.5">
            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              入学年度
            </span>
            <Input
              id="profile-enrollment-year"
              value={state.enrollmentYear}
              onChange={(event) =>
                setField("enrollmentYear", event.target.value)
              }
              placeholder="例: 2024"
              inputMode="numeric"
              required
            />
          </label>

          <label htmlFor="profile-duration-years" className="space-y-1.5">
            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              年制
            </span>
            <Select
              id="profile-duration-years"
              value={state.durationYears}
              onChange={(event) =>
                setField(
                  "durationYears",
                  event.target
                    .value as AccountProfileFormState["durationYears"],
                )
              }
              required
            >
              <option value="">選択してください</option>
              <option value="2">2年制</option>
              <option value="3">3年制</option>
              <option value="4">4年制</option>
            </Select>
          </label>

          <label htmlFor="profile-department" className="space-y-1.5">
            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              学科
            </span>
            <Select
              id="profile-department"
              value={state.department}
              onChange={(event) =>
                setField(
                  "department",
                  event.target.value as AccountProfileFormState["department"],
                )
              }
              required
            >
              <option value="">選択してください</option>
              {departmentOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </label>
        </div>
      </section>

      {showPublicProfileFields ? (
        <>
          {/* ─── Section 2: プロフィール画像 ─── */}
          <section className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-[0_8px_24px_-18px_rgba(0,0,0,0.25)] dark:border-stone-800/80 dark:bg-stone-900/40">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-fuchsia-100 text-sm dark:bg-fuchsia-900/40">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-fuchsia-600 dark:text-fuchsia-400"
                >
                  <title>プロフィール画像</title>
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </span>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                プロフィール画像
              </h3>
            </div>

            <div className="mt-4 grid items-start gap-3 sm:grid-cols-[96px_minmax(0,1fr)]">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="プロフィール画像"
                  className="h-24 w-24 rounded-2xl border border-stone-200/80 object-cover dark:border-stone-700/60"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-dashed border-stone-300 text-[10px] font-medium text-stone-400 dark:border-stone-600 dark:text-stone-500">
                  No Image
                </div>
              )}

              <div className="min-w-0 flex-1 space-y-2">
                <input
                  ref={avatarFileInputRef}
                  id="profile-avatar-file"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setSelectedAvatarFile(event.target.files?.[0] ?? null)
                  }
                  disabled={isUploadingAvatar}
                  className="sr-only"
                />

                <div className="grid grid-cols-2 gap-2">
                  <label
                    htmlFor="profile-avatar-file"
                    className="inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
                  >
                    写真を選択
                  </label>

                  <button
                    type="button"
                    onClick={handleAvatarUpload}
                    disabled={isUploadingAvatar || !selectedAvatarFile}
                    className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-stone-900 px-3 text-xs font-bold text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
                  >
                    {isUploadingAvatar ? "アップロード中…" : "アップロード"}
                  </button>
                </div>

                {selectedAvatarFile ? (
                  <p className="truncate rounded-lg border border-stone-200/80 bg-stone-50 px-2 py-1 text-[11px] text-stone-500 dark:border-stone-700/60 dark:bg-stone-800/60 dark:text-stone-400">
                    {selectedAvatarFile.name}
                  </p>
                ) : null}
              </div>
            </div>
            {avatarError ? (
              <p className="mt-3 rounded-xl border border-rose-200/80 bg-rose-50/80 px-3 py-2 text-xs text-rose-700 dark:border-rose-800/50 dark:bg-rose-950/30 dark:text-rose-300">
                {avatarError}
              </p>
            ) : null}
            {avatarMessage ? (
              <p className="mt-3 rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                {avatarMessage}
              </p>
            ) : null}
          </section>

          {/* ─── Section 3: 公開設定 ─── */}
          <section className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-[0_8px_24px_-18px_rgba(0,0,0,0.25)] dark:border-stone-800/80 dark:bg-stone-900/40">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-sm dark:bg-emerald-900/40">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-emerald-600 dark:text-emerald-400"
                >
                  <title>公開設定</title>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </span>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                公開設定
              </h3>
            </div>

            <div className="mt-4 space-y-4">
              {/* Toggle: 公開する */}
              <label className="flex cursor-pointer items-center gap-3">
                <span className="relative inline-flex">
                  <input
                    type="checkbox"
                    checked={state.isPublic}
                    onChange={(event) => {
                      const isPublic = event.target.checked;
                      setState((prev) => ({
                        ...prev,
                        isPublic,
                        acceptContact: isPublic ? prev.acceptContact : false,
                      }));
                    }}
                    className="peer sr-only"
                  />
                  <span className="block h-6 w-10 rounded-full bg-stone-300 transition-colors peer-checked:bg-emerald-500 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-400 peer-focus-visible:ring-offset-2 dark:bg-stone-600 dark:peer-checked:bg-emerald-500" />
                  <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                </span>
                <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                  プロフィールを公開する
                </span>
              </label>

              {!state.isPublic ? (
                <div className="rounded-xl bg-amber-50/80 px-3.5 py-2.5 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                  💡 公開すると、後輩があなたの内定先情報を見ることができます。
                </div>
              ) : null}

              {/* Nickname & Contact */}
              <div className="grid gap-3 sm:grid-cols-2">
                <label htmlFor="profile-nickname" className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                    表示名
                  </span>
                  <Input
                    id="profile-nickname"
                    value={state.nickname}
                    onChange={(event) =>
                      setField("nickname", event.target.value)
                    }
                    placeholder="例: たろう"
                    disabled={!canEditAlumniProfile}
                  />
                </label>

                <label htmlFor="profile-contact-email" className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                    連絡先メール
                  </span>
                  <Input
                    id="profile-contact-email"
                    value={state.contactEmail}
                    onChange={(event) =>
                      setField("contactEmail", event.target.value)
                    }
                    placeholder="example@st.kobedenshi.ac.jp"
                    type="email"
                    disabled={!canEditAlumniProfile}
                  />
                </label>
              </div>

              {/* Toggle: 連絡先公開 */}
              <label className="flex cursor-pointer items-center gap-3">
                <span className="relative inline-flex">
                  <input
                    type="checkbox"
                    checked={state.acceptContact}
                    onChange={(event) =>
                      setField("acceptContact", event.target.checked)
                    }
                    disabled={!canEditAlumniProfile}
                    className="peer sr-only"
                  />
                  <span className="block h-6 w-10 rounded-full bg-stone-300 transition-colors peer-checked:bg-emerald-500 peer-disabled:opacity-40 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-400 peer-focus-visible:ring-offset-2 dark:bg-stone-600 dark:peer-checked:bg-emerald-500" />
                  <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                </span>
                <span className="text-sm text-stone-700 dark:text-stone-300">
                  連絡先の公開を許可する
                </span>
              </label>
            </div>
          </section>

          {/* ─── Section 4: 内定先・勤務先 ─── */}
          <section className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-[0_8px_24px_-18px_rgba(0,0,0,0.25)] dark:border-stone-800/80 dark:bg-stone-900/40">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-sm dark:bg-amber-900/40">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-amber-600 dark:text-amber-400"
                >
                  <title>内定先</title>
                  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                  <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                  <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                  <path d="M10 6h4" />
                  <path d="M10 10h4" />
                  <path d="M10 14h4" />
                  <path d="M10 18h4" />
                </svg>
              </span>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                内定先・勤務先
              </h3>
              <span className="ml-auto text-[11px] text-stone-400 dark:text-stone-500">
                複数登録可
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {state.companyNames.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-stone-200 px-4 py-6 text-center dark:border-stone-700">
                  <p className="text-sm font-medium text-stone-400 dark:text-stone-500">
                    まだ登録されていません
                  </p>
                  <p className="mt-1 text-[11px] text-stone-400 dark:text-stone-500">
                    下のボタンから追加してください
                  </p>
                </div>
              ) : null}
              {state.companyNames.map((companyName, index) => (
                <div
                  key={companyRowIds[index]}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                    {index + 1}
                  </div>
                  <Input
                    value={companyName}
                    onChange={(event) =>
                      setCompanyNameAt(index, event.target.value)
                    }
                    placeholder="例: 株式会社○○"
                    disabled={!canEditAlumniProfile}
                  />
                  <button
                    type="button"
                    onClick={() => removeCompanyNameField(index)}
                    disabled={!canEditAlumniProfile}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-stone-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
                    title="削除"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <title>削除</title>
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addCompanyNameField}
                disabled={!canEditAlumniProfile}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-dashed border-stone-300 px-4 text-xs font-semibold text-stone-600 transition-all hover:border-stone-400 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-600 dark:text-stone-400 dark:hover:border-stone-500 dark:hover:bg-stone-800"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <title>追加</title>
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                内定先を追加
              </button>
            </div>
          </section>

          {/* ─── Section 5: メッセージ ─── */}
          <section className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-[0_8px_24px_-18px_rgba(0,0,0,0.25)] dark:border-stone-800/80 dark:bg-stone-900/40">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sm dark:bg-sky-900/40">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-sky-600 dark:text-sky-400"
                >
                  <title>メッセージ</title>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                後輩へのメッセージ
              </h3>
            </div>

            <label className="mt-4 block space-y-1.5">
              <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                備考（活動内容やメッセージなど）
              </span>
              <textarea
                value={state.remarks}
                onChange={(event) => setField("remarks", event.target.value)}
                className="min-h-24 w-full rounded-xl border border-stone-200/80 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none transition-all duration-200 placeholder:text-stone-400 hover:border-stone-300 focus:border-violet-400 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.08)] disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-700/60 dark:bg-stone-900/60 dark:text-stone-100 dark:placeholder:text-stone-500 dark:hover:border-stone-600 dark:focus:border-violet-500/60 dark:focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
                placeholder="就活のアドバイスや、学校生活の思い出など自由に書いてください 🎓"
                disabled={!canEditAlumniProfile}
              />
            </label>
          </section>
        </>
      ) : null}

      {/* ─── Feedback & Submit ─── */}
      {error ? (
        <p className="rounded-xl border border-rose-200/80 bg-rose-50/80 px-3 py-2 text-xs text-rose-700 dark:border-rose-800/50 dark:bg-rose-950/30 dark:text-rose-300">
          {error}
        </p>
      ) : null}

      {message ? (
        <p className="rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-300">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSaving}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 text-sm font-bold tracking-wide text-white shadow-lg shadow-stone-900/20 transition-all hover:bg-stone-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-100 dark:text-stone-900 dark:shadow-stone-100/10 dark:hover:bg-stone-200"
      >
        {isSaving ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-stone-900/30 dark:border-t-stone-900" />
            保存中…
          </>
        ) : (
          "プロフィールを保存する"
        )}
      </button>
    </form>
  );
}
