# 『みんなの太陽』MV STATUS

このファイルは「次に誰が何をするか」を短く確認するための進行表です。
詳細な確定事項は `DECISIONS.md`、固定ブリーフは `BRIEF.md`、カット設計は `STORYBOARD.md` v2.1.1を参照してください。

## 現在のPhase

**Phase 1B — 絵コンテ確定 / B-roll同期 / 写真選定**

## 共有リンク

- Suno: https://suno.com/s/srJPo6JXkrJWPwCt
- Fan site: https://mily-fan-site.vercel.app/
- Draft AI studio: PR #108

## 正本

- `STORYBOARD.md` v2.1.1
- Claude commit: `3e0a4a0e5076266102690eca036f5c86eab11fe1`
- 総48カット = S1〜S42 + G1〜G6
- Role = Hero 9 / 補助 22 / モンタージュ 11
- 設計尺164.3秒 / 実音源164.352秒

旧35カット / B-roll 12本 / CapCut前提は破棄済み。

## タスク

| Task | Owner | Status | Output |
|---|---|---|---|
| 音源構成の確定 | Claude | Done | `BRIEF.md` |
| STORYBOARD v2.1.1 48カット反映・機械検算 | Claude | Done | `STORYBOARD.md` |
| 制作室の旧35/12/CapCut前提を同期 | ChatGPT | Done | `README.md` / `BRIEF.md` / `DECISIONS.md` / `STATUS.md` / PR本文 |
| GrokBot GitHub write preflight | GrokBot | **Next** | PRコメント |
| G1〜G6の6本仕様へ同期 | GrokBot | Blocked by write preflight | `GROK_SHOTS.md` |
| G1〜G6の0円生成候補 | Grok / SuperGrok | Pending | 加入プラン内 / Unlimitedのみ |
| 写真候補の役割分類 | ChatGPT + Owner | In progress | local/private asset manifest |
| S14 / S33 / S42専用Hero選定 | ChatGPT + Owner | In progress | local/private asset manifest |
| 0:26.7 S8 ラジオ実写真 | ChatGPT + Owner | Available | 公開mediaの実写候補から選定 |
| 0:29.7 S9 篠笛実写真 | Owner / AI | Pending | 見つからなければ別の本人実写真 |
| FFmpeg編集パイプライン | ChatGPT / Codex / Cursor | Prototype ready | local/private。public repoへ置かない |
| 48カット＋G1〜G6統合レビュー | ChatGPT | Pending | Grok同期後にPRコメント / `DECISIONS.md` |
| ローカル仮編集 | Owner + AI | Pending | FFmpeg系パイプライン |
| 完成前レビュー | Claude + ChatGPT | Pending | PRコメント |

## コスト方針

- 追加課金が必要な生成処理は原則禁止。
- 実行前に0円 / 加入プラン内 / Unlimited枠か確認する。
- 有料クレジットが必要なら実行せず報告する。
- FFmpeg編集、文書更新、検算など0円レーンを優先する。

## 次のAIチェックイン

### GrokBot — write preflight

最初に以下を読む。

1. `AGENTS.md`
2. `docs/mv/minnano-no-taiyo/README.md`
3. `BRIEF.md`
4. `DECISIONS.md`
5. `STORYBOARD.md`
6. Draft PR #108 最新コメント

まだ制作ファイルを編集せず、GitHubへのwrite権限を確認する。

write可能ならPR Conversationへ、次のような短いコメントだけを投稿する。

```text
[Grok] preflight: write access confirmed
```

write不可ならファイルを変更せず、その理由だけ報告する。

### Grok / GrokBot — preflight成功後

`STORYBOARD.md` v2.1.1の **G1〜G6だけ**を正本として `GROK_SHOTS.md` を更新する。

- 6本から増やさない
- 旧12本案を混ぜない
- 本人、人物、人体、顔、手、シルエットを生成しない
- 本人写真を生成AIへ入力しない
- 追加課金しない
- ひまわりを使わない
- 作業後に `[Grok]` チェックインを残す

### ChatGPT

Grok更新後に `STORYBOARD.md` / `GROK_SHOTS.md` / PR最新コメントを読み、意味の一致・単調さ・距離感・コスト方針の4点で統合レビューする。
並行して本人写真のS1〜S42割当をlocal/privateで進める。

### Owner

S14 / S33 / S42など本人写真の最終採用、完成版の公開判断を行う。

## Phase 1B Doneの定義

- `STORYBOARD.md` v2.1.1の48カット構成が維持されている
- `GROK_SHOTS.md` がG1〜G6の6本だけに同期されている
- G1〜G6が人物・人体なし、追加課金なしで成立する設計になっている
- S14 / S33 / S42の専用Hero候補が決まっている
- S1〜S42に使える本人実写真の候補集合が整理されている
- 1:57.0のタメ→ハードカット→開放が維持されている
- 1:07.2 / 2:16.0の象徴カットが維持されている
- 公開・権利・距離感・コストの懸念が残っていない
