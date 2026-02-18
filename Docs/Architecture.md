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

### 4.1 Layered Architecture & CQRS

レイヤードアーキテクチャを採用し、ビジネスロジックの肥大化を防ぐため「Command」と「Query」を分離する。

**Presentation Layer**

- Resolvers
- GraphQL エントリポイント

**Application Layer**

- **Commands:** 書き込み処理（登録・更新・削除）。バリデーションやトランザクションを含む
- **Queries:** 読み取り処理。Prisma を使用して DTO を直接返す

**Domain Layer**

- エンティティや共通のビジネスルール
- Prisma Client の型に依存することを許容

**Infrastructure Layer**

- PrismaService
- 外部APIクライアント等

### 4.2 Data Access

- Prisma 7 をドメインモデルとして、生成型をそのまま利用
- 開発スピードを優先する方針

## 5. Directory Structure

```
.
├── web/ (Next.js)
│   └── src/
│       ├── components/
│       │   ├── atoms/ # Wrapped shadcn/ui
│       │   ├── molecules/
│       │   ├── organisms/
│       │   └── templates/
│       ├── app/ # App Router pages
│       └── graphql/ # Codegen-generated files
└── service/ (NestJS)
    └── src/
        ├── modules/
        │   └── alumni/
        │       ├── presentation/ # Resolvers
        │       ├── application/
        │       │   ├── commands/ # Write logic
        │       │   └── queries/ # Read logic
        │       └── infrastructure/ # Prisma access
        ├── common/
        └── prisma/
```

## 6. Implementation Rules (For Copilot)

**Type Safety**

- 全ての GraphQL 操作は graphql-codegen によって生成された型を使用すること

**Component Creation**

- UIパーツを作成する際は、まず atoms に shadcn/ui をインポートし、それを他のコンポーネントで再利用すること

**CQRS**

- AlumniService に全てのロジックを詰め込まず、AlumniCommandService と AlumniQueryService に分けること

**Tailwind 4**

- CSS-based な設定思想に基づき、インラインクラスでのスタイリングを優先すること

**Prisma**

- 読み取り専用のクエリでは、パフォーマンス向上のため select を使用して必要なフィールドのみを絞り込むこと

## 7. Security (MVP)

**Authentication**

- Google OAuth (@kdps.ac.jp domain)

**Authorization**

- 全ての GraphQL Resolver は GqlAuthGuard 等で保護すること
- プロフィール編集時は、userId がログインユーザー本人であることを必ず検証すること
