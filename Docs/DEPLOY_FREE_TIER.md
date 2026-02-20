# デプロイ構成（現在）

## 何を使っているか

- Web（Next.js）: Vercel
- Service（NestJS / GraphQL）: Fly.io
- DB（PostgreSQL）: Neon
- 画像ストレージ（S3互換）: Cloudflare R2

## お金がかかる可能性があるもの

- Vercel
  - 無料枠超過時（ビルド回数・帯域・実行時間など）
- Fly.io
  - マシン稼働時間・リソース使用量に応じて課金
  - `auto_stop_machines = "off"` のため継続稼働で課金可能性あり
- Neon
  - 無料枠の容量・接続・使用量超過時
- Cloudflare R2
  - ストレージ容量・リクエスト数・外部転送量で課金の可能性

## 補足

- 詳細手順:
  - [Docs/DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)
  - [Docs/DEPLOY_FLYIO.md](./DEPLOY_FLYIO.md)
  - [Docs/DEPLOY_NEON.md](./DEPLOY_NEON.md)
  - [Docs/DEPLOY_R2.md](./DEPLOY_R2.md)
