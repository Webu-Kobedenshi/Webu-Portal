# Cloudflare R2 設定手順（画像アップロード）

このドキュメントは `service` の S3 互換ストレージとして R2 を設定する手順です。

## 1. バケット作成

1. Cloudflare Dashboard → R2
2. `Create bucket`
3. バケット名: `webu-portal`（推奨）

## 2. API Token 作成

1. R2 → API Tokens → `Create API token`
2. 権限: `オブジェクト読み取りと書き込み`
3. バケット適用範囲: `特定のバケットのみ`（`webu-portal` を指定推奨）
4. 生成後に値を保存
   - `Access Key ID`
   - `Secret Access Key`

補足:

- 画面上部の Cloudflare API Token 値はこのアプリでは未使用
- 使用するのは S3 クライアント用の `Access Key ID` / `Secret Access Key`

## 3. エンドポイント確認

R2 画面から S3 endpoint を確認します。

- `ENDPOINT`: `https://<account-id>.r2.cloudflarestorage.com`

公開画像用 URL は別で設定します。

- `PUBLIC_ENDPOINT`: `https://<your-r2-public-domain>` もしくは `https://<bucket>.r2.dev`

## 4. CORS 設定（推奨）

バケット CORS に以下を設定:

- Allowed Origins: `https://<your-web-domain>`
- Allowed Methods: `PUT, GET, HEAD`
- Allowed Headers: `*`
- Expose Headers: `ETag`
- Max Age: `3600`

## 5. Fly.io secrets 設定

```bash
flyctl secrets set \
  ENDPOINT="https://<account-id>.r2.cloudflarestorage.com" \
  PUBLIC_ENDPOINT="https://<your-r2-public-domain>" \
  ACCESS_KEY="<r2-access-key-id>" \
  SECRET_KEY="<r2-secret-access-key>" \
  BUCKET_NAME="webu-portal"
```

## 6. 反映確認

1. `flyctl deploy`
2. Web から画像アップロード
3. 保存された URL で画像が表示されることを確認

## 7. セキュリティ注意

- キーを誤って公開した場合は即時ローテーション
- `PUBLIC_ENDPOINT` は公開配信用、`ENDPOINT` は S3 API 用として分離
