# Architecture Definition: OB/OG Portal

## 1. Project Overview

**Goal:** 神戸電子専門学校のOB/OGと在校生を繋ぐポータルサイト

**Primary Features:**

- OB/OG情報の登録
- 一覧検索
- 閲覧

**Constraints:**

- Node 22 LTS
- pnpm
- Docker Compose

## 2. Technology Stack

**Frontend:**

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4

**Backend:**

- NestJS 11
- GraphQL (Schema-first)
- Prisma 7

**Database:**

- PostgreSQL

**Tooling:**

- Biome (Lint/Format)
- GraphQL Code Generator
- shadcn/ui (UI Components)

## 3. Frontend Architecture (Web)

### 3.1 Component Strategy: Atomic Design

外部ライブラリ（shadcn/ui）への依存を疎結合にするため、atoms でラップする。

**Atoms**

- shadcn/ui の直接のラップ
- プロジェクト全体の共通スタイルや基本プロパティを定義

**Molecules**

- 複数の Atoms を組み合わせた構成要素
- 例: SearchField = Input + Button

**Organisms**

- 独立して機能する大きなパーツ
- 例: AlumniCard, RegistrationForm

**Templates**

- ページの骨格、レイアウト

**Pages**

- app/ 配下のディレクトリ
- データのフェッチ（Server Components）と Template への流し込みを担当

### 3.2 Data Fetching

- Server Components を基本として、データ取得はサーバーサイドで行う
- GraphQL Code Generator で `src/graphql/*.graphql` から自動生成された型安全な Hooks/Request を使用する

## 4. Backend Architecture (Service)

### 4.1 Layered Architecture, CQRS, and Light DDD

レイヤードアーキテクチャ + CQRS を基本に、重要ユースケースから段階的に DDD を適用する（Light DDD）。
現時点の最優先ユースケースは `updateAlumniProfile`。

**Presentation Layer**

- Resolvers
- GraphQL エントリポイント
- 認証ガード、Transport入出力のマッピング
- 業務ルールは持たない

**Application Layer**

- **Commands:** 書き込み処理（登録・更新・削除）のユースケース調停
- **Queries:** 読み取り処理のユースケース調停
- トランザクション境界、例外マッピング、ドメイン/インフラ調整を担当
- ビジネス不変条件（正規化や公開制約）は原則持たない

**Domain Layer**

- エンティティ、バリューオブジェクト、ポリシー、ドメインサービス
- ビジネス不変条件とルールの唯一の置き場
- 文字列正規化、重複排除、公開制約などの業務ルールを実装

**Infrastructure Layer**

- Prisma を使った永続化
- 外部API/ストレージ連携
- ドメイン判断は持たず、技術的実装に限定

### 4.2 Data Access

- Prisma 7 は永続化モデルとして利用し、ドメインモデルとは責務分離する
- 読み取りでは select を使って必要フィールドのみ取得する
- Repository で DTO へ整形し、Application へ返す
- API 契約（GraphQL schema / DTO 互換性）を維持しながら段階移行する

## 5. Directory Structure

- `web/src/components/atoms`: Wrapped shadcn/ui コンポーネント
- `web/src/components/molecules`: 複数atomsの組み合わせ
- `web/src/components/organisms`: 画面機能の主要ブロック
- `web/src/components/templates`: ページ構造テンプレート
- `web/src/app`: App Router ページ/ルートハンドラ
- `web/src/graphql`: GraphQL クエリ・型連携

- `service/src/modules/alumni/presentation`: Resolver・認証ガード適用・入出力マッピング
- `service/src/modules/alumni/application/commands`: 書き込みユースケース調停
- `service/src/modules/alumni/application/queries`: 読み取りユースケース調停
- `service/src/modules/alumni/domain/entities`: Domain Entity
- `service/src/modules/alumni/domain/value-objects`: Domain Value Object
- `service/src/modules/alumni/domain/errors`: Domain Error
- `service/src/modules/alumni/infrastructure`: Prisma 永続化・外部連携
- `service/src/common`: 共通認証/基盤
- `service/prisma`: Prisma schema と migration

## 6. Implementation Rules (For Copilot)

**Architecture First**

- 実装着手前に `Docs/Architecture.md` と `.github/copilot-instructions.md` の両方を確認すること
- 両者に差分がある場合はこのドキュメントを優先し、同一PRで整合させること
- 1PR 1ユースケースを基本に、段階的に DDD を適用すること

**Type Safety**

- 全ての GraphQL 操作は graphql-codegen によって生成された型を使用すること

**Component Creation**

- UIパーツを作成する際は、まず atoms に shadcn/ui をインポートし、それを他のコンポーネントで再利用すること

**CQRS**

- AlumniService に全てのロジックを詰め込まず、AlumniCommandService と AlumniQueryService に分けること
- Application 層は調停に集中し、業務ルールは Domain 層へ移譲すること

**Tailwind 4**

- CSS-based な設定思想に基づき、インラインクラスでのスタイリングを優先すること

**Prisma**

- 読み取り専用のクエリでは、パフォーマンス向上のため select を使用して必要なフィールドのみを絞り込むこと

## 7. Security (MVP)

**Authentication**

- Google OAuth（既定: `@st.kobedenshi.ac.jp`、`AUTH_ALLOWED_DOMAINS` で変更可能）

**Authorization**

- 全ての GraphQL Resolver は GqlAuthGuard 等で保護すること
- プロフィール編集時は、userId がログインユーザー本人であることを必ず検証すること

## 8. Update Log (2026-02-19)

- `alumni` モジュールで Layer/CQRS の責務を再整理
  - QueryサービスでのDB更新副作用を除去
  - 返却DTOで role/status を解決して読み取り責務を維持
- 入力型を `application/dto/alumni.input.ts` に集約し、Resolver/Service の重複定義を削減
- Repository の `select` / DTO 変換の重複を統合して保守性を改善
- MinIO を使ったアバターアップロード（署名付きURL + URL保存）を実装

## 9. Update Log (2026-04-13)

- `alumni` モジュールで Light DDD 方針を明文化
  - Domain 層へ Entity / Value Object を追加
  - `updateAlumniProfile` の業務ルールを Domain に移譲
  - `updateInitialSettings` / `linkGmail` の検証ロジックを Domain モデル経由へ移行
- Domain Validation Error を導入し、Application で例外マッピングを統一
- Domain / Application の単体テストを拡充（Query service test を追加）
