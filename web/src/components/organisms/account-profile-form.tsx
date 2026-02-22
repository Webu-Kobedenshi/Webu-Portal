"use client";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Textarea } from "@/components/atoms/textarea";
import type { AlumniProfile, Department, UserStatus } from "@/graphql/types";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

type Role = "STUDENT" | "ALUMNI" | "ADMIN";

type InitialProfile = {
  id: string;
  email: string;
  name: string | null;
  studentId: string | null;
  linkedGmail: string | null;
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
  showLinkedGmailField?: boolean;
  onSuccess?: () => void;
  redirectOnSuccess?: string;
};

type AccountProfileFormState = {
  name: string;
  studentId: string;
  enrollmentYear: string;
  durationYears: "" | "1" | "2" | "3" | "4";
  department: Department | "";
  nickname: string;
  companyNames: string[];
  remarks: string;
  contactEmail: string;
  isPublic: boolean;
  acceptContact: boolean;
  skills: string[];
  portfolioUrl: string;
  gakuchika: string;
  entryTrigger: string;
  interviewTip: string;
  usefulCoursework: string;
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
  skills: [],
  portfolioUrl: "",
  gakuchika: "",
  entryTrigger: "",
  interviewTip: "",
  usefulCoursework: "",
};

const departmentOptions: Array<{ value: Department; label: string }> = [
  { value: "IT_EXPERT", label: "ITエキスパート（4年制）" },
  { value: "IT_SPECIALIST", label: "ITスペシャリスト（3年制）" },
  { value: "INFORMATION_PROCESS", label: "情報処理（2年制）" },
  { value: "PROGRAMMING", label: "プログラミング（2年制）" },
  { value: "AI_SYSTEM", label: "AIシステム開発（2年制）" },
  { value: "ADVANCED_STUDIES", label: "総合研究科（1年制）" },
  { value: "INFO_BUSINESS", label: "情報ビジネス（2年制）" },
  { value: "INFO_ENGINEERING", label: "情報工学（2年制）" },
  { value: "GAME_RESEARCH", label: "ゲーム開発研究（4年制）" },
  { value: "GAME_ENGINEER", label: "ゲームエンジニア（3年制）" },
  { value: "GAME_SOFTWARE", label: "ゲーム制作（2年制）" },
  { value: "ESPORTS", label: "esportsエンジニア（2年制）" },
  { value: "CG_ANIMATION", label: "CGアニメーション（2年制）" },
  { value: "DIGITAL_ANIME", label: "デジタルアニメ（2年制）" },
  { value: "GRAPHIC_DESIGN", label: "グラフィックデザイン（2年制）" },
  { value: "INDUSTRIAL_DESIGN", label: "インダストリアルデザイン（2年制）" },
  { value: "ARCHITECTURAL", label: "建築（2年制）" },
  { value: "SOUND_CREATE", label: "サウンドクリエイト（2年制）" },
  { value: "SOUND_TECHNIQUE", label: "サウンドテクニック（2年制）" },
  { value: "VOICE_ACTOR", label: "声優（2年制）" },
  { value: "INTERNATIONAL_COMM", label: "国際コミュニケーション（2年制）" },
  { value: "OTHERS", label: "その他（2年制）" },
];

/** 学科から修業年数を導出する */
function getDurationYears(department: Department): "1" | "2" | "3" | "4" {
  switch (department) {
    case "IT_EXPERT":
    case "GAME_RESEARCH":
      return "4";
    case "IT_SPECIALIST":
    case "GAME_ENGINEER":
      return "3";
    case "ADVANCED_STUDIES":
      return "1";
    default:
      return "2";
  }
}

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
  showLinkedGmailField = true,
  onSuccess,
  redirectOnSuccess,
}: AccountProfileFormProps) {
  const router = useRouter();
  const initialCompanyNames = initialProfile?.alumniProfile?.companyNames?.length
    ? [...initialProfile.alumniProfile.companyNames]
    : [];
  const initialAvatarUrl = initialProfile?.alumniProfile?.avatarUrl ?? null;
  const initialIsPublic =
    (initialProfile?.alumniProfile?.isPublic ?? false) && initialCompanyNames.length > 0;

  const currentUserEmail = initialProfile?.email ?? initialEmail ?? "";
  const isSchoolEmail = currentUserEmail.endsWith("@st.kobedenshi.ac.jp");
  const shouldShowLinkedGmailField = showLinkedGmailField && isSchoolEmail;

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
    skills: initialProfile?.alumniProfile?.skills ?? [],
    portfolioUrl: initialProfile?.alumniProfile?.portfolioUrl ?? "",
    gakuchika: initialProfile?.alumniProfile?.gakuchika ?? "",
    entryTrigger: initialProfile?.alumniProfile?.entryTrigger ?? "",
    interviewTip: initialProfile?.alumniProfile?.interviewTip ?? "",
    usefulCoursework: initialProfile?.alumniProfile?.usefulCoursework ?? "",
  });
  const [companyRowIds, setCompanyRowIds] = useState<string[]>(() =>
    initialCompanyNames.map(() => createRowId()),
  );
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const avatarFileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [avatarMessage, setAvatarMessage] = useState("");
  const [linkedGmailInput, setLinkedGmailInput] = useState("");
  const [currentLinkedGmail, setCurrentLinkedGmail] = useState<string | null>(
    initialProfile?.linkedGmail ?? null,
  );
  const [isLinkingGmail, setIsLinkingGmail] = useState(false);
  const [linkedGmailError, setLinkedGmailError] = useState("");
  const [linkedGmailMessage, setLinkedGmailMessage] = useState("");

  const [hasAlumniProfile, setHasAlumniProfile] = useState(Boolean(initialProfile?.alumniProfile));
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [deepDiveOpen, setDeepDiveOpen] = useState(false);
  const [loginInfoOpen, setLoginInfoOpen] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const canSubmitInitial = useMemo(() => {
    const enrollmentYear = Number(state.enrollmentYear);
    return (
      Boolean(state.name.trim()) &&
      Boolean(state.studentId.trim()) &&
      Number.isFinite(enrollmentYear) &&
      enrollmentYear >= 2000 &&
      enrollmentYear <= 2100 &&
      ["1", "2", "3", "4"].includes(state.durationYears) &&
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
      const msg = "名前・学籍番号・入学年度・学科は必須です。";
      if (silent) {
        setAvatarError(msg);
      } else {
        setError(msg);
      }
      return false;
    }

    const normalizedCompanyNames = Array.from(
      new Set(state.companyNames.map((item) => item.trim()).filter((item) => item.length > 0)),
    );
    const normalizedContactEmail = state.contactEmail.trim() || (initialEmail?.trim() ?? "");
    const isPublicToSave = forcePrivate ? false : state.isPublic;

    if (showPublicProfileFields && isPublicToSave && normalizedCompanyNames.length === 0) {
      const msg = "公開する場合は内定先・勤務先を1件以上入力してください。";
      if (silent) {
        setAvatarError(msg);
      } else {
        setError(msg);
      }
      return false;
    }

    if (showPublicProfileFields && isPublicToSave && !state.nickname.trim()) {
      const msg = "公開する場合は表示名を1文字以上入力してください。";
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
          skills: state.skills.map((s) => s.trim()).filter((s) => s.length > 0),
          portfolioUrl: state.portfolioUrl.trim(),
          gakuchika: state.gakuchika.trim(),
          entryTrigger: state.entryTrigger,
          interviewTip: state.interviewTip.trim(),
          usefulCoursework: state.usefulCoursework.trim(),
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
          setMessage("保存しました。初期情報と公開プロフィールを更新しました。");
        } else {
          setMessage("保存しました。初期情報を更新しました。");
        }
        if (onSuccess) {
          onSuccess();
        }
        if (redirectOnSuccess) {
          router.push(redirectOnSuccess);
          router.refresh();
        }
      }

      return true;
    } catch (submitError) {
      const msg = submitError instanceof Error ? submitError.message : "更新に失敗しました";
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
        throw new Error(uploadUrlJson.message || "アップロードURLの取得に失敗しました");
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
        uploadError instanceof Error ? uploadError.message : "画像アップロードに失敗しました",
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleLinkGmail = async () => {
    setLinkedGmailError("");
    setLinkedGmailMessage("");

    const email = linkedGmailInput.trim().toLowerCase();
    if (!email) {
      setLinkedGmailError("Gmailアドレスを入力してください");
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      setLinkedGmailError("有効な @gmail.com アドレスを指定してください");
      return;
    }

    setIsLinkingGmail(true);
    try {
      const response = await fetch("/api/account/gmail", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ gmail: email }),
      });

      const json = await response.json();
      if (!response.ok || !json.ok) {
        throw new Error(json.message || "Gmail連携に失敗しました");
      }

      setCurrentLinkedGmail(email);
      setLinkedGmailInput("");
      setLinkedGmailMessage("引き継ぎGmailアドレスを登録しました");
    } catch (err) {
      setLinkedGmailError(err instanceof Error ? err.message : "サーバーエラーが発生しました");
    } finally {
      setIsLinkingGmail(false);
    }
  };

  const handleUnlinkGmail = async () => {
    if (!confirm("引き継ぎGmailアドレスの登録を解除します。よろしいですか？")) {
      return;
    }

    setLinkedGmailError("");
    setLinkedGmailMessage("");
    setIsLinkingGmail(true);

    try {
      const response = await fetch("/api/account/gmail", {
        method: "DELETE",
      });

      const json = await response.json();
      if (!response.ok || !json.ok) {
        throw new Error(json.message || "Gmail連携の解除に失敗しました");
      }

      setCurrentLinkedGmail(null);
      setLinkedGmailMessage("引き継ぎGmailアドレスの登録を解除しました");
    } catch (err) {
      setLinkedGmailError(err instanceof Error ? err.message : "サーバーエラーが発生しました");
    } finally {
      setIsLinkingGmail(false);
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
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">基本情報</h3>
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
              onChange={(event) => setField("enrollmentYear", event.target.value)}
              placeholder="例: 2024"
              inputMode="numeric"
              required
            />
          </label>

          <label htmlFor="profile-department" className="space-y-1.5">
            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              学科
            </span>
            <Select
              value={state.department || "UNSELECTED"}
              onValueChange={(val) => {
                const dept = (
                  val === "UNSELECTED" ? "" : val
                ) as AccountProfileFormState["department"];
                setField("department", dept);
                if (dept) {
                  setField("durationYears", getDurationYears(dept as Department));
                } else {
                  setField("durationYears", "");
                }
              }}
              required
            >
              <SelectTrigger id="profile-department">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UNSELECTED">選択してください</SelectItem>
                {departmentOptions.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label htmlFor="profile-duration-years" className="space-y-1.5">
            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              年制（学科から自動設定）
            </span>
            <Select value={state.durationYears || "UNSELECTED"} disabled>
              <SelectTrigger id="profile-duration-years">
                <SelectValue placeholder="学科を選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UNSELECTED">学科を選択してください</SelectItem>
                <SelectItem value="1">1年制</SelectItem>
                <SelectItem value="2">2年制</SelectItem>
                <SelectItem value="3">3年制</SelectItem>
                <SelectItem value="4">4年制</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </div>
      </section>

      {/* ─── Section 2: アカウント・ログイン引き継ぎ ─── */}
      {shouldShowLinkedGmailField ? (
        <section className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-[0_8px_24px_-18px_rgba(0,0,0,0.25)] dark:border-stone-800/80 dark:bg-stone-900/40">
          <button
            type="button"
            onClick={() => setLoginInfoOpen((prev) => !prev)}
            className="flex w-full items-center justify-between"
          >
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
                  <title>アカウント連携</title>
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </span>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                卒業後のログイン情報
              </h3>
            </div>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`shrink-0 text-stone-400 transition-transform duration-200 ${loginInfoOpen ? "rotate-180" : ""}`}
            >
              <title>{loginInfoOpen ? "閉じる" : "開く"}</title>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              loginInfoOpen ? "mt-4 max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="rounded-xl border border-stone-100 bg-stone-50/50 p-4 dark:border-stone-800/60 dark:bg-stone-900/40">
              <p className="text-xs text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
                学校のアカウント（
                <code className="text-[11px] font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-1 py-0.5 rounded">
                  @st.kobedenshi.ac.jp
                </code>
                ）は卒業後に失効します。卒業後もこのプロフィールにアクセスして情報を更新できるように、あらかじめ個人のGmailアドレスを登録してください。
              </p>

              <div className="space-y-4">
                {currentLinkedGmail ? (
                  <div className="flex flex-col gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900/50 dark:bg-emerald-950/20 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-500">
                        登録済みの引き継ぎアドレス
                      </span>
                      <strong className="text-sm text-stone-900 dark:text-stone-100">
                        {currentLinkedGmail}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={handleUnlinkGmail}
                      disabled={isLinkingGmail}
                      className="inline-flex h-8 items-center justify-center rounded-md border border-stone-200 bg-white px-3 text-[11px] font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700/80"
                    >
                      登録を解除する
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label
                      htmlFor="linked-gmail"
                      className="block text-[11px] font-semibold text-stone-500 dark:text-stone-400"
                    >
                      個人のGmailアドレス
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="linked-gmail"
                        value={linkedGmailInput}
                        onChange={(e) => setLinkedGmailInput(e.target.value)}
                        placeholder="example@gmail.com"
                        type="email"
                        disabled={isLinkingGmail}
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleLinkGmail}
                        disabled={isLinkingGmail || !linkedGmailInput}
                        className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-stone-900 px-4 text-xs font-bold text-white transition-colors hover:bg-stone-800 disabled:opacity-50 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
                      >
                        {isLinkingGmail ? "登録中…" : "登録する"}
                      </button>
                    </div>
                  </div>
                )}

                {linkedGmailError ? (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                    {linkedGmailError}
                  </p>
                ) : null}
                {linkedGmailMessage && !linkedGmailError ? (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    {linkedGmailMessage}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {showPublicProfileFields ? (
        <>
          {/* ─── Section 3: 公開プロフィール設定 (Progressive Disclosure) ─── */}
          <section className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_8px_24px_-18px_rgba(0,0,0,0.25)] dark:border-stone-800/80 dark:bg-stone-900/40">
            {/* Header Area with Toggle */}
            <div className="flex flex-col gap-4 border-b border-stone-100 bg-stone-50/50 p-5 dark:border-stone-800/60 dark:bg-stone-900/20 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3 sm:items-center">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-100/80 text-sm dark:bg-violet-900/30">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-violet-600 dark:text-violet-400"
                  >
                    <title>公開設定</title>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    公開プロフィール設定
                  </h3>
                  <p className="mt-0.5 text-[11px] text-stone-500 dark:text-stone-400">
                    内定先や表示名を後輩に公開できます
                  </p>
                </div>
              </div>

              {/* Master Toggle */}
              <label className="flex cursor-pointer items-center gap-2.5 sm:justify-end">
                <span className="text-[13px] font-semibold text-stone-700 dark:text-stone-300">
                  {state.isPublic ? "公開中" : "非公開"}
                </span>
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
                  <span className="block h-6 w-10.5 rounded-full bg-stone-200 transition-colors peer-checked:bg-violet-500 peer-focus-visible:ring-2 peer-focus-visible:ring-violet-400 peer-focus-visible:ring-offset-2 dark:bg-stone-700 dark:peer-checked:bg-violet-500" />
                  <span className="absolute left-[3px] top-[3px] h-4.5 w-4.5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-[18px]" />
                </span>
              </label>
            </div>

            {/* Content Area (Progressive Disclosure) */}
            <div className="relative p-5">
              {/* Overlay when disabled */}
              {!state.isPublic && (
                <div className="absolute inset-x-0 bottom-0 top-0 z-10 flex flex-col items-center justify-center rounded-b-2xl bg-white/60 p-6 backdrop-blur-[2px] dark:bg-stone-950/60 transition-all duration-300">
                  <div className="flex max-w-[280px] flex-col items-center gap-3 rounded-2xl border border-stone-200/80 bg-white/90 p-5 text-center shadow-lg backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/90">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-stone-400"
                      >
                        <title>非公開ロック</title>
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <p className="text-[12px] font-medium leading-relaxed text-stone-600 dark:text-stone-300">
                      公開設定をオンにすると、お世話になった母校の後輩たちに
                      <strong className="text-stone-900 dark:text-white">内定先</strong>や
                      <strong className="text-stone-900 dark:text-white">メッセージ</strong>
                      を共有できます。
                    </p>
                  </div>
                </div>
              )}

              {/* The Fields (Faded out when disabled) */}
              <div
                className={`space-y-6 transition-all duration-300 ${!state.isPublic ? "opacity-30 blur-[1px] select-none pointer-events-none" : ""}`}
              >
                {/* ─── Avatar Upload ─── */}
                <div className="space-y-3">
                  <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                    プロフィール画像
                  </span>
                  <div className="grid items-start gap-3 sm:grid-cols-[96px_minmax(0,1fr)]">
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
                        onChange={(event) => setSelectedAvatarFile(event.target.files?.[0] ?? null)}
                        disabled={isUploadingAvatar || !state.isPublic}
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
                          disabled={isUploadingAvatar || !selectedAvatarFile || !state.isPublic}
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
                    <p className="mt-2 rounded-xl border border-rose-200/80 bg-rose-50/80 px-3 py-2 text-xs text-rose-700 dark:border-rose-800/50 dark:bg-rose-950/30 dark:text-rose-300">
                      {avatarError}
                    </p>
                  ) : null}
                  {avatarMessage ? (
                    <p className="mt-2 rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                      {avatarMessage}
                    </p>
                  ) : null}
                </div>

                <hr className="border-stone-100 dark:border-stone-800/60" />

                {/* Nickname & Contact */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <label htmlFor="profile-nickname" className="space-y-1.5">
                    <span className="flex items-center justify-between text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                      <span>
                        表示名 <span className="text-rose-500">*</span>
                      </span>
                    </span>
                    <Input
                      id="profile-nickname"
                      value={state.nickname}
                      onChange={(event) => setField("nickname", event.target.value)}
                      placeholder="例: たろう"
                      disabled={!canEditAlumniProfile}
                      className={
                        !state.nickname.trim() && state.isPublic
                          ? "border-rose-300 focus-visible:ring-rose-400"
                          : ""
                      }
                    />
                  </label>

                  <label htmlFor="profile-contact-email" className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                      <span>連絡先メールアドレス</span>

                      {/* Contact Toggle Inline */}
                      <label className="flex cursor-pointer items-center gap-1.5">
                        <span className="text-[10px]">受け付ける</span>
                        <span className="relative inline-flex">
                          <input
                            type="checkbox"
                            checked={state.acceptContact}
                            onChange={(event) => setField("acceptContact", event.target.checked)}
                            disabled={!canEditAlumniProfile}
                            className="peer sr-only"
                          />
                          <span className="block h-3.5 w-6 rounded-full bg-stone-300 transition-colors peer-checked:bg-emerald-500 dark:bg-stone-600" />
                          <span className="absolute left-[2px] top-[2px] h-2.5 w-2.5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-[10px]" />
                        </span>
                      </label>
                    </div>
                    <Input
                      id="profile-contact-email"
                      value={state.contactEmail}
                      onChange={(event) => setField("contactEmail", event.target.value)}
                      placeholder="example@st.kobedenshi.ac.jp"
                      type="email"
                      disabled={!canEditAlumniProfile || !state.acceptContact}
                      className={!state.acceptContact ? "opacity-50" : ""}
                    />
                  </label>
                </div>

                <hr className="border-stone-100 dark:border-stone-800/60" />

                {/* Companies */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                      内定先・勤務先 <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[10px] text-stone-400 dark:text-stone-500">
                      複数登録可
                    </span>
                  </div>

                  {state.companyNames.length === 0 ? (
                    <div
                      className={`rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${state.isPublic ? "border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/10" : "border-stone-200 dark:border-stone-700"}`}
                    >
                      <p
                        className={`text-[13px] font-medium ${state.isPublic ? "text-amber-700 dark:text-amber-500" : "text-stone-400 dark:text-stone-500"}`}
                      >
                        ここに追加された企業名がカードに表示されます
                      </p>
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    {state.companyNames.map((companyName, index) => (
                      <div key={companyRowIds[index]} className="flex items-center gap-2">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100/80 text-[11px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                          {index + 1}
                        </div>
                        <Input
                          value={companyName}
                          onChange={(event) => setCompanyNameAt(index, event.target.value)}
                          placeholder="例: 株式会社○○"
                          disabled={!canEditAlumniProfile}
                          className={
                            !companyName.trim() && state.isPublic
                              ? "border-rose-300 focus-visible:ring-rose-400"
                              : ""
                          }
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
                  </div>

                  <button
                    type="button"
                    onClick={addCompanyNameField}
                    disabled={!canEditAlumniProfile}
                    className="mt-2 inline-flex h-9 items-center gap-1.5 rounded-xl border border-dashed border-stone-300 px-4 text-xs font-semibold text-stone-600 transition-all hover:border-stone-400 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-600 dark:text-stone-400 dark:hover:border-stone-500 dark:hover:bg-stone-800"
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
                    内定先・勤務先を追加
                  </button>
                </div>

                <hr className="border-stone-100 dark:border-stone-800/60" />

                {/* Remarks / Message */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                      後輩へひとこと
                    </span>
                    <p
                      className={`text-[10px] ${state.remarks.length >= 50 ? "text-rose-500" : "text-stone-400 dark:text-stone-500"}`}
                    >
                      {state.remarks.length}/50
                    </p>
                  </div>
                  <Textarea
                    value={state.remarks}
                    onChange={(event) => setField("remarks", event.target.value)}
                    maxLength={50}
                    className="min-h-24"
                    placeholder="就活のアドバイスでも学生生活やるべきことでも！"
                    disabled={!canEditAlumniProfile}
                  />
                </div>

                <hr className="border-stone-100 dark:border-stone-800/60" />

                {/* ── 後輩へのアドバイス (Deep Dive) ── */}
                <div className="space-y-5">
                  <button
                    type="button"
                    onClick={() => setDeepDiveOpen((prev) => !prev)}
                    className="flex w-full items-center gap-2 text-left"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-sm dark:bg-amber-900/40">
                      💡
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        後輩へのアドバイス
                      </h4>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400">
                        任意 · 書くほど後輩の参考になります
                      </p>
                    </div>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`shrink-0 text-stone-400 transition-transform duration-200 ${deepDiveOpen ? "rotate-180" : ""}`}
                    >
                      <title>{deepDiveOpen ? "閉じる" : "開く"}</title>
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {/* Collapsible content */}
                  <div
                    className={`space-y-5 overflow-hidden transition-all duration-300 ease-in-out ${
                      deepDiveOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {/* Skills */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                          評価された技術・資格・経験など（最大3つ）
                        </span>
                        <span className="text-[10px] text-stone-400 dark:text-stone-500">
                          {state.skills.length}/3
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {state.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 rounded-lg bg-violet-100/80 px-2 py-1 text-[12px] font-semibold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => {
                                setState((prev) => ({
                                  ...prev,
                                  skills: prev.skills.filter((s) => s !== skill),
                                }));
                              }}
                              disabled={!canEditAlumniProfile}
                              className="ml-0.5 text-violet-400 hover:text-violet-700 dark:text-violet-500 dark:hover:text-violet-200"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      {state.skills.length < 3 ? (
                        <div className="flex gap-2">
                          <Input
                            id="profile-skill-input"
                            placeholder="例: React (15文字以内)"
                            maxLength={15}
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            disabled={!canEditAlumniProfile}
                            onKeyDown={(event) => {
                              if (event.nativeEvent.isComposing) return;
                              if (event.key === "Enter") {
                                event.preventDefault();
                                const value = skillInput.trim().slice(0, 15);
                                if (
                                  value &&
                                  state.skills.length < 3 &&
                                  !state.skills.includes(value)
                                ) {
                                  setState((prev) => ({
                                    ...prev,
                                    skills: [...prev.skills, value],
                                  }));
                                  setSkillInput("");
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const value = skillInput.trim().slice(0, 15);
                              if (
                                value &&
                                state.skills.length < 3 &&
                                !state.skills.includes(value)
                              ) {
                                setState((prev) => ({
                                  ...prev,
                                  skills: [...prev.skills, value],
                                }));
                                setSkillInput("");
                              }
                            }}
                            disabled={!canEditAlumniProfile}
                            className="shrink-0 rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-600 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800"
                          >
                            追加
                          </button>
                        </div>
                      ) : null}
                    </div>

                    {/* Portfolio URL */}
                    <label htmlFor="profile-portfolio-url" className="block space-y-1.5">
                      <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                        ポートフォリオURL
                      </span>
                      <Input
                        id="profile-portfolio-url"
                        value={state.portfolioUrl}
                        onChange={(event) => setField("portfolioUrl", event.target.value)}
                        placeholder="https://your-portfolio.com"
                        type="url"
                        disabled={!canEditAlumniProfile}
                      />
                    </label>

                    {/* Gakuchika */}
                    <div className="space-y-1.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                          学生時代に力を入れたこと
                        </span>
                        <p
                          className={`text-[10px] ${state.gakuchika.length >= 200 ? "text-rose-500" : "text-stone-400 dark:text-stone-500"}`}
                        >
                          {state.gakuchika.length}/200
                        </p>
                      </div>
                      <Textarea
                        value={state.gakuchika}
                        onChange={(event) => setField("gakuchika", event.target.value)}
                        maxLength={200}
                        placeholder="例: We部のプロジェクトでReactを使ったサイト制作をリーダーとして行いました"
                        disabled={!canEditAlumniProfile}
                      />
                    </div>

                    {/* Entry Trigger */}
                    <label htmlFor="profile-entry-trigger" className="block space-y-1.5">
                      <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                        内定企業へのエントリーのきっかけ
                      </span>
                      <Select
                        value={state.entryTrigger || "UNSELECTED"}
                        onValueChange={(val) =>
                          setField("entryTrigger", val === "UNSELECTED" ? "" : val)
                        }
                        disabled={!canEditAlumniProfile}
                      >
                        <SelectTrigger id="profile-entry-trigger">
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UNSELECTED">選択してください</SelectItem>
                          <SelectItem value="学校求人">学校求人</SelectItem>
                          <SelectItem value="逆求人・スカウト">逆求人・スカウト</SelectItem>
                          <SelectItem value="就活サイト">就活サイト</SelectItem>
                          <SelectItem value="インターン経由">インターン経由</SelectItem>
                          <SelectItem value="OB/OG紹介">OB/OG紹介</SelectItem>
                          <SelectItem value="その他">その他</SelectItem>
                        </SelectContent>
                      </Select>
                    </label>

                    {/* Interview Tip */}
                    <div className="space-y-1.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                          面接のワンポイント
                        </span>
                        <p
                          className={`text-[10px] ${state.interviewTip.length >= 200 ? "text-rose-500" : "text-stone-400 dark:text-stone-500"}`}
                        >
                          {state.interviewTip.length}/200
                        </p>
                      </div>
                      <Textarea
                        value={state.interviewTip}
                        onChange={(event) => setField("interviewTip", event.target.value)}
                        maxLength={200}
                        placeholder="例: ポートフォリオを持参して、実際に動くものを見せると話が弾みました"
                        disabled={!canEditAlumniProfile}
                      />
                    </div>

                    {/* Useful Coursework */}
                    <div className="space-y-1.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                          役立った授業・先生
                        </span>
                        <p
                          className={`text-[10px] ${state.usefulCoursework.length >= 200 ? "text-rose-500" : "text-stone-400 dark:text-stone-500"}`}
                        >
                          {state.usefulCoursework.length}/200
                        </p>
                      </div>
                      <Textarea
                        value={state.usefulCoursework}
                        onChange={(event) => setField("usefulCoursework", event.target.value)}
                        maxLength={200}
                        placeholder="例: ○○先生のWebフレームワーク演習がポートフォリオ制作にそのまま活かせました"
                        disabled={!canEditAlumniProfile}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : null}

      <div className="sticky bottom-0 -mx-1 bg-gradient-to-t from-white via-white to-white/0 px-1 pb-2 pt-4 dark:from-stone-950 dark:via-stone-950 dark:to-stone-950/0">
        {error ? (
          <p className="mb-2 rounded-xl border border-rose-200/80 bg-rose-50/80 px-3 py-2 text-xs text-rose-700 dark:border-rose-800/50 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="mb-2 rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-300">
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
      </div>
    </form>
  );
}
