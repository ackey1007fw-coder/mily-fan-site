# みりぃ ファンサイト

みりぃ（三橋莉子）さんのファン制作・非公式サイトです。
公式・公認・本人運営ではありません。

2026年専用サイトではありません。2027年以降も同じリポジトリで運用します。

公開URL: https://mily-fan-site.vercel.app/

## いまの状態

- 初期ページ: Hero / 応援する / 最新情報 / ギャラリー / スケジュール / プロフィール / リンク / Footer
- 最新情報に、21歳誕生日の投稿要約を掲載しています
- MISS CIRCLE CONTEST 2026 ENTRY 734 への応援導線（Hero / Support / モバイルドック）
- 配信予定を ENTRY 734 ページ起点で自動取得（`/api/mily-schedule`。失敗時は手入力 fallback → 非表示）
- Follow Mily: X / Instagram / TikTok / SHOWROOM（すべてENTRY 734実ページで確認済み）
- FM湘南マジックウェイブへの導線（個別プロフィール・番組ページ）
- ギャラリーに写真を掲載しています（最適化・出典管理の手順は `docs/MEDIA.md`）
- 予定は、確認できるまでセクションを非表示にします

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
