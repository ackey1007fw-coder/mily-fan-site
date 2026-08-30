# 『みんなの太陽』MV STATUS

このファイルは「次に誰が何をするか」を短く確認するための進行表です。
詳細な確定事項は `DECISIONS.md`、固定ブリーフは `BRIEF.md`、カット設計は `STORYBOARD.md` v2.1.1を参照してください。

## 現在のPhase

**Phase 5 — 完成書き出し・監査完了 / Owner公開判断待ち**

## 共有リンク

- Suno: https://suno.com/s/srJPo6JXkrJWPwCt
- Fan site: https://mily-fan-site.vercel.app/
- Draft AI studio: PR #108

## 正本と完成版方針

- `STORYBOARD.md` v2.1.1の時刻設計を維持
- Owner最終指示D-014により、旧G1〜G6を含む全区間を公開・利用確認済みの本人実写へ変更
- D-015 / D-017により、投稿元名ではなく採用フレームで本人確認
- D-016により、9:16は主映像を全面表示
- D-018により、16:9 / 9:16の2本を完成納品

旧35カット / B-roll 12本 / CapCut前提 / 人物不在B-roll完成案は破棄済み。

## 完了状況

| Task | Owner | Status | Output |
|---|---|---|---|
| 音源構成・STORYBOARD v2.1.1 | Claude | Done | `BRIEF.md` / `STORYBOARD.md` |
| G1〜G6仕様同期 | GrokBot | Done / Superseded in final render | `GROK_SHOTS.md` |
| 写真・動画候補の収集 | Owner + AI | Done | Google Drive / local/private |
| OwnerによるSNS動画カバー整理 | Owner | Done | 45候補を維持 / 24動画を除外 |
| 本人フレーム監査・10カット差し替え | ChatGPT | Done | local/private manifest |
| 漢字歌詞字幕の時刻統合 | ChatGPT | Done | 修正版SRT |
| 16:9完成書き出し | ChatGPT | Done | 1920×1080 / 30fps / 164.367秒 |
| 9:16完成書き出し | ChatGPT | Done | 1080×1920 / 30fps / 164.367秒 |
| 横版の埋め込み横動画全面化 | ChatGPT | Done | S12 / S13 / S24 |
| 縦版の小窓・黒帯解消 | ChatGPT | Done | S12 / S13 / S18 / S24 |
| 音声一致・黒画面監査 | ChatGPT | Done | 音声MD5一致 / blackdetectなし |
| 完成ファイル・監査記録のDrive反映 | ChatGPT | Done | `05_export` / `04_edit` |
| 公開日時・説明文・カバー画像 | Owner | Pending | 投稿先別 |
| 最終公開 | Owner | Pending | Reels / TikTok / YouTube / X |

## 最終技術監査

- 16:9: 1920×1080 / 30fps / 164.367秒 / 64,499,423 bytes
- 9:16: 1080×1920 / 30fps / 164.367秒 / 74,982,563 bytes
- 入力・16:9・9:16の音声ストリームMD5: `dfa03abe8865f99e65ed4764d79d0384`
- blackdetect: 両版とも検出なし
- 追加課金: なし
- AI人物生成・Reference-to-Video・顔身体変更・生成塗り足し: なし
- 本人素材、完成MP4、FFmpegキットはpublic repoへ置かない

## Ownerの次の判断

- 16:9 / 9:16完成版の最終視聴
- 投稿先ごとのカバー画像と説明文
- 公開日時
- 実際の公開操作

## PR #108の扱い

PR #108は引き続きDraft制作室として維持する。
Ready for reviewへ変更せず、`@codex review`を送らず、mainへmergeしない。
