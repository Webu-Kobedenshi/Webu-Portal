# 開発進捗サマリー（2026-02-19）

## 1. 全体ステータス

- フェーズ: MVP実装中
- 進捗感: 認証〜プロフィール管理〜一覧表示までの主導線が動作
- アーキテクチャ: `service` は Layered + CQRS で整理済み

---

## 2. 実装済み（Backend / service）

### 2.1 認証・認可

- `GqlAuthGuard` による GraphQL 保護
- JWT 検証（`AUTH_JWT_SECRET` / `NEXTAUTH_SECRET`）
- 初回アクセス時のユーザー自動作成（email基準）

### 2.2 Alumni モジュール

- Query
  - `getMyProfile`
  - `getAlumniList`（学科 / 企業名フィルタ、ページネーション）
  - `getAlumniDetail`
- Mutation
  - `updateInitialSettings`
  - `updateAlumniProfile`
  - `updateAvatar`
  - `deleteMyAccount`
  - `getUploadUrl`

### 2.3 ドメインルール

- 卒業判定ロジック（`graduation-policy`）
- ロール・ステータス解決（`user-role-transition`）
- 公開制御ルール（`alumni-profile-policy`）

### 2.4 ストレージ

- MinIO 向けの署名付き PUT URL 発行
- アバターURLの永続化（`avatarUrl`）

---

## 3. 実装済み（Frontend / web）

### 3.1 認証導線

- `/login`（Googleログイン）
- Middleware による保護ルート制御

### 3.2 画面

- `/` 一覧ページ
- `/initial-setup` 初期設定
- `/account` アカウント編集

### 3.3 API Routes（BFF）

- `POST /api/account/profile`
- `POST /api/account/delete`
- `POST /api/account/avatar/upload-url`
- `POST /api/account/avatar/complete`

---

## 4. 直近のアーキテクチャ改善

- Queryサービス内での書き込み副作用を除去（CQRSの責務純化）
- Resolver / Command で重複していた入力型を `application/dto/alumni.input.ts` に集約
- Repository 内の重複 Select / DTO変換を統合

---

## 5. 未完了・次アクション

- GraphQL Codegen の実運用化（現状は手書きクエリ主体）
- `role/status` の永続同期を明示的 Command 化するかの方針決定
- 公開プロフィール編集の権限制御（要件上 ALUMNI 限定）を実装で強化
- テスト拡充（Query/Command/Resolver のユニット + E2E）

---

## 6. 参考

- [Architecture.md](./Architecture.md)
- [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
- [TECH_STACK.md](./TECH_STACK.md)
- [OPERATIONS_SPEC.md](./OPERATIONS_SPEC.md)
- [PRD.md](./PRD.md)
