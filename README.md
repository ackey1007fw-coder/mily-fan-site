# みりぃ ファンサイト

みりぃ（三橋莉子）さんのファン制作・非公式サイトです。
公式・公認・本人運営ではありません。

2026年専用サイトではありません。2027年以降も同じリポジトリで運用します。

## いまの状態（v1）

- 初期ページ: Hero / 最新情報 / ギャラリー / スケジュール / プロフィール / リンク / Footer
- 最新情報に、21歳誕生日の投稿要約を掲載しています
- ギャラリーにオーナー提供の写真を掲載しています（運用手順は `docs/MEDIA.md`）
- 予定・SNS は、確認できるまで空です
- Vercel 本番公開はまだ行いません

## 開発

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm test
pnpm build
```

## データ

| ファイル | 内容 |
| --- | --- |
| `src/data/profile.ts` | 確認できた最小限のプロフィール |
| `src/data/events.ts` | 年をまたげる予定 |
| `src/data/news.ts` | 最新情報 |
| `src/data/media.ts` | 写真・動画（手順: `docs/MEDIA.md`） |
| `src/data/socials.ts` | 本人 SNS |
| `src/data/links.ts` | その他リンク |
| `src/data/highlights.ts` | ハイライト |

## 運用

- `main` へ直接 push しない
- 作業ブランチから PR
- squash merge 前提
- GitHub Actions が typecheck / test / build / identity guard を実行します
