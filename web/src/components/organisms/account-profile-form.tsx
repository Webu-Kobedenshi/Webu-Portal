"use client";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Select } from "@/components/atoms/select";
import type { AlumniProfile, Department, UserStatus } from "@/graphql/types";
import { useMemo, useState } from "react";

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
  const initialCompanyNames = initialProfile?.alumniProfile?.companyNames?.length
    ? [...initialProfile.alumniProfile.companyNames]
    : [];
  const initialIsPublic =
    (initialProfile?.alumniProfile?.isPublic ?? false) && initialCompanyNames.length > 0;

  const [state, setState] = useState<AccountProfileFormState>({
    ...defaultState,
    name: initialProfile?.name ?? initialName ?? "",
    studentId: initialProfile?.studentId ?? "",
    enrollmentYear: initialProfile?.enrollmentYear ? String(initialProfile.enrollmentYear) : "",
    durationYears: initialProfile?.durationYears
      ? (String(initialProfile.durationYears) as AccountProfileFormState["durationYears"])
      : "",
    department: initialProfile?.department ?? "",
    nickname: initialProfile?.alumniProfile?.nickname ?? initialName ?? "",
    companyNames: initialCompanyNames,
    remarks: initialProfile?.alumniProfile?.remarks ?? "",
    contactEmail: initialProfile?.alumniProfile?.contactEmail ?? initialEmail ?? "",
    isPublic: initialIsPublic,
    acceptContact: initialProfile?.alumniProfile?.acceptContact ?? false,
  });
  const [companyRowIds, setCompanyRowIds] = useState<string[]>(() =>
    initialCompanyNames.map(() => createRowId()),
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
    setCompanyRowIds((prev) => prev.filter((_, itemIndex) => itemIndex !== index));

    setState((prev) => ({
      ...prev,
      companyNames: prev.companyNames.filter((_, itemIndex) => itemIndex !== index),
      isPublic:
        prev.companyNames.filter((_, itemIndex) => itemIndex !== index).length > 0
          ? prev.isPublic
          : false,
      acceptContact:
        prev.companyNames.filter((_, itemIndex) => itemIndex !== index).length > 0
          ? prev.acceptContact
          : false,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!canSubmitInitial) {
      setError("名前・学籍番号・入学年度・年制(2/3/4)・学科は必須です。");
      return;
    }

    const normalizedCompanyNames = Array.from(
      new Set(state.companyNames.map((item) => item.trim()).filter((item) => item.length > 0)),
    );
    const normalizedContactEmail = state.contactEmail.trim() || (initialEmail?.trim() ?? "");

    if (showPublicProfileFields && state.isPublic && normalizedCompanyNames.length === 0) {
      setError("公開する場合は内定先・勤務先を1件以上入力してください。");
      return;
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
          isPublic: state.isPublic,
          acceptContact: state.acceptContact,
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

      if (!showPublicProfileFields) {
        setMessage("保存しました。初期情報を更新しました。");
      } else if (json.alumniUpdated) {
        setMessage("保存しました。初期情報と公開プロフィールを更新しました。");
      } else {
        setMessage("保存しました。初期情報を更新しました。");
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "更新に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mt-6 rounded-2xl border border-stone-200/80 bg-white/70 p-5 dark:border-stone-700/60 dark:bg-stone-900/40">
      <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">{title}</h2>
      <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{description}</p>

      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div>
          <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
            初期設定（必須）
          </p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
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
                onChange={(event) => setField("enrollmentYear", event.target.value)}
                placeholder="例: 2024"
                inputMode="numeric"
                required
              />
            </label>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
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
                    event.target.value as AccountProfileFormState["durationYears"],
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
        </div>

        {showPublicProfileFields ? (
          <div>
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              公開プロフィール
            </p>

            <div className="mt-2">
              <label className="inline-flex items-center gap-2 rounded-xl border border-stone-200/80 bg-white/70 px-3 py-2 text-xs text-stone-700 dark:border-stone-700/60 dark:bg-stone-900/50 dark:text-stone-300">
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
                />
                公開する
              </label>
              {!state.isPublic ? (
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                  公開しない設定のため、公開プロフィール項目は編集できません。
                </p>
              ) : null}
            </div>

            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <label htmlFor="profile-nickname" className="space-y-1.5">
                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                  表示名
                </span>
                <Input
                  id="profile-nickname"
                  value={state.nickname}
                  onChange={(event) => setField("nickname", event.target.value)}
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
                  onChange={(event) => setField("contactEmail", event.target.value)}
                  placeholder="example@st.kobedenshi.ac.jp"
                  type="email"
                  disabled={!canEditAlumniProfile}
                />
              </label>
            </div>

            <div className="mt-3 space-y-2">
              <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                内定先・勤務先（複数可）
              </span>
              {state.companyNames.length === 0 ? (
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  まだ登録されていません。必要な場合は「+ 内定先を追加」から追加できます。
                </p>
              ) : null}
              {state.companyNames.map((companyName, index) => (
                <div key={companyRowIds[index]} className="flex items-center gap-2">
                  <Input
                    value={companyName}
                    onChange={(event) => setCompanyNameAt(index, event.target.value)}
                    placeholder="例: 株式会社○○"
                    disabled={!canEditAlumniProfile}
                  />
                  <Button
                    type="button"
                    onClick={() => removeCompanyNameField(index)}
                    disabled={!canEditAlumniProfile}
                    className="h-10 shrink-0 !bg-gradient-to-r !from-rose-600 !to-pink-600 px-3 text-xs text-white hover:!from-rose-500 hover:!to-pink-500"
                  >
                    削除
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={addCompanyNameField}
                disabled={!canEditAlumniProfile}
                className="h-10 bg-stone-200 px-3 text-xs text-stone-800 hover:bg-stone-300 dark:bg-stone-700 dark:text-stone-100 dark:hover:bg-stone-600"
              >
                + 内定先を追加
              </Button>
            </div>

            <div className="mt-3">
              <div className="grid gap-2">
                <label className="inline-flex items-center gap-2 rounded-xl border border-stone-200/80 bg-white/70 px-3 py-2 text-xs text-stone-700 dark:border-stone-700/60 dark:bg-stone-900/50 dark:text-stone-300">
                  <input
                    type="checkbox"
                    checked={state.acceptContact}
                    onChange={(event) => setField("acceptContact", event.target.checked)}
                    disabled={!canEditAlumniProfile}
                  />
                  連絡先の公開を許可する
                </label>
              </div>
            </div>

            <label className="mt-3 block space-y-1.5">
              <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                備考（後輩へのメッセージ）
              </span>
              <textarea
                value={state.remarks}
                onChange={(event) => setField("remarks", event.target.value)}
                className="min-h-20 w-full rounded-xl border border-stone-200/80 bg-white/90 px-3.5 py-2 text-sm text-stone-900 outline-none transition-all duration-200 placeholder:text-stone-400 hover:border-stone-300 focus:border-violet-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.08)] disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-700/60 dark:bg-stone-900/60 dark:text-stone-100 dark:placeholder:text-stone-500 dark:hover:border-stone-600 dark:focus:border-violet-500/60 dark:focus:bg-stone-900 dark:focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
                placeholder="活動内容やメッセージなど"
                disabled={!canEditAlumniProfile}
              />
            </label>
          </div>
        ) : null}

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

        <div className="pt-1">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "保存中..." : showPublicProfileFields ? "更新" : "更新"}
          </Button>
        </div>
      </form>
    </section>
  );
}
