# Webu-Portal

Next.js(App Router) + NestJS(GraphQL schema-first) + PostgreSQL(Prisma) を Docker Compose でまとめた開発環境です。

詳細な技術選定については [Docs/TECH_STACK.md](./Docs/TECH_STACK.md) をご覧ください。

## 構成

- web: Next.js(App Router)
- service: NestJS + GraphQL(schema-first) + Prisma
- db: PostgreSQL

## 前提

- Node.js 22 LTS
- pnpm
- Docker / Docker Compose

## 起動

0. 環境変数を作成（初回のみ）

```bash
cp .env.example .env
```

Google OAuth を使うため、最低限以下を `.env` に設定してください。

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_SECRET`
- `AUTH_JWT_SECRET`

1. ルートで起動

```bash
pnpm dev
```

2. 動作確認

- フロント: http://localhost:3000
- GraphQL: http://localhost:4000/graphql

## よく使うコマンド

```bash
# 停止（ボリューム含め削除）
pnpm down

# lint
pnpm lint

# format
pnpm format

# Prisma Client生成
pnpm prisma:generate

# マイグレーション作成・適用
pnpm prisma:migrate

# Prisma Studio
pnpm prisma:studio
```

## 備考

- Google OAuth（`@kdps.ac.jp` ドメイン制限）を前提
- Node 22 LTS 想定のため、Node 23 以上の場合は切り替えを推奨
