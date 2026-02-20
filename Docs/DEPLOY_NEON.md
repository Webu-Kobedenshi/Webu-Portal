# Neon 設定手順（PostgreSQL）

このドキュメントは `service` で使う PostgreSQL を Neon で準備する手順です。

## 1. プロジェクト作成

1. Neon にログイン
2. `New Project` を作成
3. 推奨設定
   - Postgres version: `16`
   - Region: API 配置リージョンに合わせる（未定なら `us-east-1`）
   - Neon Auth: `OFF`

## 2. 接続文字列を取得

1. `Connect` 画面を開く
2. `Connection pooling` を `OFF`
3. 表示された Direct 接続 URL をコピー

確認ポイント:

- `-pooler` が入っていない
- `sslmode=require` が付いている

## 3. アプリへ設定

### 3-1. Fly.io (service)

```bash
flyctl secrets set DATABASE_URL="<Neon Direct URL>"
```

### 3-2. ローカル確認（任意）

- `service/.env` の `DATABASE_URL` に設定して疎通確認

## 4. マイグレーション適用

Fly.io では `fly.toml` の `release_command` で自動実行されます。

- `pnpm prisma migrate deploy`

## 5. 動作確認

- Fly の `deploy` ログで migration 成功を確認
- `https://<your-app>.fly.dev/graphql` が `400` を返せば API は稼働

## 6. セキュリティ注意

- 接続文字列を公開場所に貼った場合は Neon の `Reset password` でローテーション
- 本番で共有するのは接続先 URL ではなく、Secrets 経由に限定
