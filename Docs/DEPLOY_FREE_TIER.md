# 無料枠優先デプロイ手順（Cloudflare + Render + Neon + R2）

このプロジェクトを無料枠中心で公開するための推奨構成です。

- Web（Next.js）: Cloudflare Pages（Functions）
- Service（NestJS）: Render Web Service（Free）
- DB（PostgreSQL）: Neon Free
- 画像保存（S3互換）: Cloudflare R2

---

## 1. 先に決めるURL

- Web: `https://<your-web-domain>`
- Service GraphQL: `https://<your-service-domain>/graphql`
- R2 Public: `https://<your-r2-public-domain>`

以降の環境変数にこの3つを入れます。

---

## 2. Neon（DB）

詳細手順:

- [Docs/DEPLOY_NEON.md](./DEPLOY_NEON.md)

1. Neon でプロジェクト作成
2. 接続文字列を取得（`postgresql://...`）
3. Render の `DATABASE_URL` に設定

補足:

- `service` は起動時に `prisma migrate deploy` を実行してください。

---

## 3. R2（画像ストレージ）

詳細手順:

- [Docs/DEPLOY_R2.md](./DEPLOY_R2.md)

1. Cloudflare R2 でバケット作成（例: `webu-portal`）
2. API Token を発行（Read/Write）
3. Public Access 用のカスタムドメインを作成（`PUBLIC_ENDPOINT`）

Service 側で使う値:

- `ENDPOINT`: `https://<account-id>.r2.cloudflarestorage.com`
- `PUBLIC_ENDPOINT`: `https://<your-r2-public-domain>`
- `ACCESS_KEY`: R2 Access Key ID
- `SECRET_KEY`: R2 Secret Access Key
- `BUCKET_NAME`: 作成したバケット名

---

## 4. Render（NestJS Service）

### 4-1. 新規 Web Service

- Root Directory: `service`
- Build Command: `pnpm install && pnpm prisma generate && pnpm build`
- Start Command: `pnpm prisma migrate deploy && pnpm start:prod`

### 4-2. 環境変数

必須:

- `NODE_ENV=production`
- `PORT=10000`（Render が渡す値を優先するため未設定でも可）
- `DATABASE_URL=<Neonの接続文字列>`
- `AUTH_JWT_SECRET=<強いランダム文字列>`
- `CORS_ORIGINS=https://<your-web-domain>`

R2関連:

- `ENDPOINT`
- `PUBLIC_ENDPOINT`
- `ACCESS_KEY`
- `SECRET_KEY`
- `BUCKET_NAME`

確認:

- `https://<your-service-domain>/graphql` にアクセスできること

### 4-3. Fly.io を使う場合（Renderの代替）

Fly.io の手順は専用ドキュメントにまとめています。

- [Docs/DEPLOY_FLYIO.md](./DEPLOY_FLYIO.md)

---

## 5. Cloudflare Pages（Next.js Web）

## 5-1. プロジェクト作成

- Project Root: `web`
- Framework preset: Next.js
- Build command: `pnpm build`
- Output directory: `.next`

> 注: Cloudflare 側の Next.js サポート仕様は更新されるため、
> うまく動かない場合は公式の最新手順（OpenNext / Pages Functions）を優先してください。

### 5-2. 環境変数

- `NEXTAUTH_URL=https://<your-web-domain>`
- `NEXTAUTH_SECRET=<強いランダム文字列>`
- `AUTH_JWT_SECRET=<Service と同じ値>`
- `AUTH_ALLOWED_DOMAINS=st.kobedenshi.ac.jp`
- `GRAPHQL_ENDPOINT=https://<your-service-domain>/graphql`
- `GOOGLE_CLIENT_ID=<Google OAuth Client ID>`
- `GOOGLE_CLIENT_SECRET=<Google OAuth Client Secret>`

---

## 6. Google OAuth の本番設定

Google Cloud Console の OAuth Client に以下を設定:

- Authorized JavaScript origins:
  - `https://<your-web-domain>`
- Authorized redirect URIs:
  - `https://<your-web-domain>/api/auth/callback/google`

---

## 7. 最終チェック

1. ログインできる
2. `getMyProfile` が 401 にならない
3. 初期設定が保存できる
4. 画像アップロード後に URL が表示される
5. CORS エラーが出ない

---

## 8. 無料枠運用の注意

- Render Free はスリープがあるため、初回応答が遅くなる
- Neon Free は容量と接続数制限あり
- R2 もリクエスト上限に注意

必要に応じて将来の移行先:

- Service: Fly.io / Railway 有料
- DB: Neon 有料プラン
- Web: Cloudflare Pro
