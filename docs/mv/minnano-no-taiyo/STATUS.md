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
| GrokBot GitHub write preflight | GrokBot | Done | PR #108 Conversation |
| G1〜G6の6本仕様へ同期 | GrokBot | Done | `GROK_SHOTS.md` |
| G1〜G6の0円生成候補 | Grok / SuperGrok | Pending | 加入プラン内 / Unlimitedのみ |
| 写真候補の役割分類 | ChatGPT + Owner | In progress | local/private asset manifest |
| S14 / S33 / S42専用Hero選定 | ChatGPT + Owner | In progress | local/private asset manifest |
| 0:26.7 S8 ラジオ実写真 | ChatGPT + Owner | Available | 公開mediaの実写候補から選定 |
| 0:29.7 S9 篠笛実写真 | Owner / AI | Pending | 見つからなければ別の本人実写真 |
| FFmpeg編集パイプライン | ChatGPT / Codex / Cursor | Prototype ready | local/private。public repoへ置かない |
| 48カット＋G1〜G6統合レビュー | ChatGPT | Done | `STORYBOARD.md` / `GROK_SHOTS.md` / PRコメント |
| ローカル仮編集 | Owner + AI | Pending | FFmpeg系パイプライン |
| 完成前レビュー | Claude + ChatGPT | Pending | PRコメント |

## コスト方針

- 追加課金が必要な生成処理は原則禁止。
- 実行前に0円 / 加入プラン内 / Unlimited枠か確認する。
- 有料クレジットが必要なら実行せず報告する。
- FFmpeg編集、文書更新、検算など0円レーンを優先する。

## 次のAIチェックイン

GrokBotのwrite preflight、`GROK_SHOTS.md`のG1〜G6同期、ChatGPTの統合レビューは完了済み。preflightや6本仕様への同期を繰り返さない。

### ChatGPT + Owner — 本人実写真の割当

本人写真のS1〜S42割当をlocal/privateで進める。

- S14 / S33 / S42の専用Heroを先に決める
- S8は公開・利用確認済みのラジオ実写真を最優先する
- S9に篠笛実写真が無ければ、別の公開・利用確認済み本人実写真を使う
- S8 / S9を情景B-rollへ置き換えず、G1〜G6を増やさない
- 本人素材のファイル本体や私的URLをpublic repoへ置かない

### Grok / SuperGrok — G1〜G6の0円生成候補

生成を行う場合は、同期済みのG1〜G6だけを使う。

- `STORYBOARD.md` / `GROK_SHOTS.md`の安全negative一式を省略しない
- 旧12本案を混ぜず、6本から増やさない
- 本人写真を生成AIへ入力しない
- 実行前に0円 / 加入プラン内 / Unlimited枠を確認し、有料なら止める
- 生成後は人物・人体・顔・手・シルエット・ひまわりの混入を確認する

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
