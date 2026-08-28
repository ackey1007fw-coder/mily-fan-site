# 『みんなの太陽』MV STATUS

このファイルは「次に誰が何をするか」を短く確認するための進行表です。
詳細な確定事項は `DECISIONS.md`、固定ブリーフは `BRIEF.md` を参照してください。

## 現在のPhase

**Phase 1 — 絵コンテ統合 / B-roll設計**

## 共有リンク

- Suno: https://suno.com/s/srJPo6JXkrJWPwCt
- Fan site: https://mily-fan-site.vercel.app/

## タスク

| Task | Owner | Status | Output |
|---|---|---|---|
| 音源構成の確定 | Claude | Done | `BRIEF.md` |
| 35カット絵コンテを共有ファイルへ反映 | Claude | Next | `STORYBOARD.md` |
| 12本B-rollの具体Prompt化 | Grok | Blocked by storyboard sync | `GROK_SHOTS.md` |
| 写真候補の役割分類 | ChatGPT + Owner | Pending | PRコメント / 将来のasset manifest |
| FM写真の有無確認 | Owner / AI | Pending | `STORYBOARD.md`へ反映 |
| 篠笛写真の有無確認 | Owner / AI | Pending | `STORYBOARD.md`へ反映 |
| 35カット＋B-rollの統合レビュー | ChatGPT | Pending | `DECISIONS.md` / PRコメント |
| CapCut仮編集 | Owner | Pending | local edit |
| 完成前レビュー | Claude + ChatGPT | Pending | PRコメント |

## 次のAIチェックイン

### Claude

1. `AGENTS.md`
2. `docs/mv/minnano-no-taiyo/README.md`
3. `BRIEF.md`
4. `DECISIONS.md`
5. Draft PR最新コメント

を読んだ上で、既に作成済みの35カット絵コンテを `STORYBOARD.md` へ反映する。

### Grok

Claudeの35カットが共有されたら、必要な本人なしB-rollの位置を確認し、`GROK_SHOTS.md` の12枠を具体Promptへ更新する。

### ChatGPT

Claude / Grokの更新とPRコメントを読み、意味の一致・単調さ・距離感の3点で統合レビューし、確定事項のみ `DECISIONS.md` へ反映する。

## Doneの定義

Phase 1は以下で完了:

- 35カットのIn–Outが埋まっている
- 各カットに写真 / 実写動画 / 本人なしB-rollの種別がある
- Grok B-rollの用途とPromptが確定している
- 1:57.0のタメ→開放が明示されている
- 約1:07.2 / 2:16.0の象徴カットが確定している
- 公開・権利・距離感の懸念が残っていない
