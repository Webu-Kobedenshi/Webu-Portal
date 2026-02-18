# 運用仕様書: 神戸電子 OB・OG ポータル

## 1. 目的

本仕様書は、OB・OGポータルの運用メカニズムを「認証」「権限変換」「公開データ統制」の観点で定義する。

---

## 2. 運用ポリシー（MVP）

### 2.1 認証

- Google OAuth を使用
- 許可ドメインのみログイン可能（`AUTH_ALLOWED_DOMAINS`、既定: `st.kobedenshi.ac.jp`）
- 認証済みトークンで GraphQL API を保護

### 2.2 初期設定の必須項目

初回セットアップで以下を必須入力とする。

1. 学籍番号（`studentId`）
2. 入学年度（`enrollmentYear`）
3. 年制（`durationYears`: 2/3/4）
4. 学科（`department` Enum）

### 2.3 ロール/ステータスの動的変換

- 判定式: `現在年度 > (入学年度 + 年制 - 1)`
- 成立時:
  - `role: STUDENT -> ALUMNI`
  - `status: ENROLLED -> GRADUATED`
- 判定タイミング:
  - `getMyProfile` 実行時（アクセス時に再計算）

### 2.4 公開プロフィール運用

`ALUMNI`（または `ADMIN`）のみ、公開プロフィール更新を許可。

更新対象:

- `companyName`
- `nickname`
- `remarks`
- `contactEmail`
- `isPublic`
- `acceptContact`

---

## 3. 公開データ抽出ルール（一覧表示）

一覧表示に含める条件:

1. `user.role == ALUMNI`
2. `user.status == GRADUATED`
3. `alumniProfile.isPublic == true`

追加フィルタ:

- 学科（`department`）
- 企業名キーワード（`companyName contains`、大文字小文字非区別）

---

## 4. 主要ユーザーフロー

### 4.1 初回ログイン

1. ログイン成功
2. `getMyProfile` 実行
3. 初期設定未完了（必須4項目が欠落）なら `/initial-setup` へリダイレクト
4. 初期設定保存

### 4.2 在校生フェーズ（STUDENT）

- 一覧閲覧のみ
- 公開プロフィール編集は不可（UI上メッセージ表示）

### 4.3 卒業後フェーズ（ALUMNI）

1. アクセス時にロール昇格
2. アカウントページで公開プロフィールを更新
3. `isPublic=true` の場合、一覧に表示対象となる

---

## 5. セキュリティ/整合性

- GraphQL Resolver は `GqlAuthGuard` で保護
- 初期設定更新時に入力値バリデーション（年制 2/3/4 等）
- ALUMNI以外の公開プロフィール更新は拒否
- 退会時は `onDelete: Cascade` により関連データを物理削除

---

## 6. 実装反映箇所

### Backend

- `service/src/modules/alumni/domain/graduation-policy.ts`
- `service/src/modules/alumni/application/commands/alumni-command.service.ts`
- `service/src/modules/alumni/application/queries/alumni-query.service.ts`
- `service/src/modules/alumni/infrastructure/alumni.repository.ts`
- `service/src/modules/alumni/presentation/alumni.graphql`
- `service/src/modules/alumni/presentation/alumni.resolver.ts`

### Frontend

- `web/src/app/page.tsx`
- `web/src/app/account/page.tsx`
- `web/src/app/initial-setup/page.tsx`
- `web/src/components/organisms/account-profile-form.tsx`
- `web/src/graphql/alumni.ts`
- `web/src/graphql/account.ts`
- `web/src/app/api/account/profile/route.ts`

---

## 7. 今後の運用拡張

- 学籍番号の実名簿照合（外部マスタ連携）
- 管理者監査ログ（更新履歴・公開切替履歴）
- 公開プロフィールの承認ワークフロー
