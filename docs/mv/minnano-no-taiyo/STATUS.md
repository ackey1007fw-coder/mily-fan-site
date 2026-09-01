# 『みんなの太陽』MV STATUS

このファイルは「次に誰が何をするか」を短く確認するための進行表です。
詳細な確定事項は `DECISIONS.md`、固定ブリーフは `BRIEF.md`、カット設計は `STORYBOARD.md` v2.1.1を参照してください。

## 現在のPhase

**Phase 4 — 全48カット本人単独素材で再構築中**

2026-09-01の独立実体監査により、旧完成判定を撤回した。現行Drive上の16:9 / 9:16は公開用完成版ではない。

## 共有リンク

- Suno: https://suno.com/s/srJPo6JXkrJWPwCt
- Fan site: https://mily-fan-site.vercel.app/
- Draft AI studio: PR #108

## 正本と修正方針

- `STORYBOARD.md` v2.1.1の48カット時刻設計を維持
- D-020により、G1〜G6を含む全カットを三橋莉子本人単独の公開・利用確認済み実写へ再構築
- 別人のみ / 本人不明 / 複数人 / 他人物の顔が残る素材は全除外
- 同一写真の再利用0、同一長尺動画の別場面は非連続・非重複で使用
- SNS元UI・元字幕・スタンプを除去できない素材は不採用
- 16:9 / 9:16は同じ確定カット割を使用
- 9:16は本人中心の全画面クロップ。小窓・ぼかし帯・黒帯なし
- 漢字歌詞44行は映像確定後に正本SRTから一層だけ再焼き込み
- 1:57.0ハードカットとS14 / S33 / S42専用Heroを維持

## 独立監査で確認した旧版の不合格点

- S24: 全区間が別人のみ
- G1 / G2 / G6: 本人を主被写体として確定不能
- 白黒パーカー2人素材10カット、ポムポムプリン系2人素材7カット
- S8 / S9 / G4ほかに他人物が残存
- SNS元UIとMV字幕の競合
- 漢字字幕44行は存在するが、複数行で同期ずれ
- 9:16の全面表示は改善済みだが、人物・字幕問題が横版と共通

## 作業状況

| Task | Owner | Status | Output |
|---|---|---|---|
| STORYBOARD v2.1.1 | Claude | Done | `BRIEF.md` / `STORYBOARD.md` |
| 現行16:9 / 9:16独立監査 | Grok + ChatGPT統合 | Done | 48カット / 44字幕行の実体監査 |
| 旧完成判定の撤回 | ChatGPT | Done | D-020 |
| 本人単独素材の追加監査・選定 | ChatGPT | In progress | local/private manifest v4 |
| 48カット再構築 | ChatGPT | Pending | 16:9 / 9:16 clean master |
| 漢字字幕44行再焼き込み | ChatGPT | Pending | horizontal / vertical ASS |
| 全境界・全字幕行の再監査 | ChatGPT | Pending | final audit v4 |
| Drive完成ファイル反映 | ChatGPT | Pending | `04_edit` / `05_export` |
| 最終公開判断 | Owner | Pending | Reels / TikTok / YouTube / X |

## 完成判定

次をすべて満たすまで「完成」に戻さない。

1. 48カットすべて本人確実、他人物のみ・不明フレーム0
2. 他人物の顔0、SNS元UI0、同一写真再利用0
3. 9:16で小窓・ぼかし帯・黒帯0
4. 44字幕行が正本SRTと0.2秒以内、二重表示0
5. 1:57.0ハードカット、音声MD5一致、blackdetect 0
6. S14 / S33 / S42専用Heroの他カット流用0

## PR #108の扱い

PR #108は引き続きDraft制作室として維持する。
Ready for reviewへ変更せず、`@codex review`を送らず、mainへmergeしない。
