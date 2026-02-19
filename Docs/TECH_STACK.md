# 技術スタック（2026-02-19）

## 1. Frontend（web）

- Next.js `16.1.6`（App Router）
- React `19.2.3`
- TypeScript `5.x`
- Tailwind CSS `4.x`
- NextAuth `4.24.x`（Google OAuth）
- jose `6.x`（JWT 署名）

## 2. Backend（service）

- NestJS `11.x`
- GraphQL（Schema-first）
- Apollo Server `5.x`
- Prisma `7.4.x`（`@prisma/client`, `prisma`, `@prisma/adapter-pg`）
- PostgreSQL Driver: `pg 8.x`
- AWS SDK v3（S3 Client / Presigner）

## 3. Data / Storage

- PostgreSQL `16`（Docker image: `postgres:16-alpine`）
- MinIO（オブジェクトストレージ）
  - アバター画像アップロードに利用
  - 署名付きURLで直接アップロード

## 4. 開発・運用ツール

- Node.js `22 LTS`（`>=22 <23`）
- pnpm `10.8.1`
- Biome `1.9.x`（Lint / Format）
- Jest `30.x`
- Docker / Docker Compose

## 5. アーキテクチャ方針

- Frontend: App Router + Server Components 中心
- Backend: Layered Architecture + CQRS（Command / Query 分離）
- API: GraphQL を単一エントリとして提供
- ORM: Prisma の型を活用し、`select` ベースで必要フィールドを取得
