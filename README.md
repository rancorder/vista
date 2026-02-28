# VISTA 営業プレゼンテーション

株式会社ビスタ 無足場アンカー工法 営業用スライド

## ローカル開発

```bash
npm install
npm run dev
```

## GitHub → Vercel デプロイ手順

### 1. GitHubリポジトリ作成
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/vista-presentation.git
git push -u origin main
```

### 2. Vercelへデプロイ
1. [vercel.com](https://vercel.com) にログイン
2. 「New Project」→ GitHubリポジトリを選択
3. 設定はデフォルトのまま（vercel.json が自動検出されます）
4. 「Deploy」をクリック

以上で自動デプロイ完了。以降 `main` ブランチへのpushで自動更新されます。

## 操作方法

| 操作 | 動作 |
|------|------|
| `→` / `Space` / NEXT ▶ | 次のスライド |
| `←` / PREV ◀ | 前のスライド |
| スワイプ (モバイル) | スライド切り替え |
| 各カード・アイテムをタップ | 詳細展開 |
