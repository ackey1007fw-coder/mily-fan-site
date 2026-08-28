# 『みんなの太陽』MV 情景生成 — Grok担当

> Owner: Grok
>
> 他AIは原則としてこのファイルを直接編集せず、Draft PR Conversationへ提案を残してください。

## 役割

本人を登場させない、映画的な情景・象徴B-rollを12本前後設計する。

## 絶対条件

作業前に `README.md` / `BRIEF.md` / `DECISIONS.md` / `STORYBOARD.md` を読むこと。

以下は禁止:

- 三橋莉子さん本人の顔・身体の生成
- 本人写真のReference-to-Video化
- 本人に似せた人物の生成
- 実在人物のリップシンク
- 本人写真の生成塗り足し / generative fill

生成する映像は**人物なし**を基本とする。人の存在を示したい場合も、特定個人を想起させない抽象的な表現を優先する。

## 目的

AI映像はMVの主役ではない。
本人の実写写真 / 実写動画の間をつなぎ、歌詞の意味を広げるために使う。

特に「自信 / 勇気が誰かへ渡る」というテーマを、光・風景・空間の変化で表現する。

## 優先する12枠

| ID | 想定位置 / 役割 | コンセプト | Prompt | 採用メモ |
|---|---|---|---|---|
| G01 | Intro | 夜明け / 小さな光の始まり | TODO | |
| G02 | Verse 1 | 日常へ差す朝の光 | TODO | |
| G03 | 0:26.7代替候補 | ラジオ / ON AIRを象徴する空間 | TODO | |
| G04 | 0:29.7代替候補 | 篠笛を連想する静かな和の情景 | TODO | |
| G05 | Pre-Chorus | 雨上がり / 光が戻る | TODO | |
| G06 | Chorus | 太陽 / ひまわり / 開放感 | TODO | |
| G07 | 約1:07.2 | 光が生まれ、別の場所へ渡る | TODO | |
| G08 | Verse 2 | 迷い / 影と光の境界 | TODO | |
| G09 | Bridge | 静けさ / 余白 / タメへ向かう | TODO | |
| G10 | 1:54〜1:57 | ほぼ暗い画から一筋の光 | TODO | |
| G11 | 約2:16.0 | ひとつの光が複数へ広がる | TODO | |
| G12 | Outro / Fade | 朝の光が世界へ残る余韻 | TODO | |

## Promptの基本形

各Promptには最低限以下を含める。

- 16:9 cinematic landscape
- no people / no human face / no recognizable person
- camera motion（必要な場合のみ）
- lighting
- mood
- durationを意識した単一の動き
- text / logo / watermarkを生成しない

同一ショットに複数イベントを詰め込まない。
短いMV素材として、1ショット1アイデアを優先する。

## 品質評価

生成後は各ショットを次で評価する。

- A: そのまま採用候補
- B: 一部トリミング / 速度調整で採用可能
- C: 再生成
- NG: 本人に似た人物、意図しない顔、文字、破綻など

## 作業後

Draft PR Conversationへ次を残す。

```text
[Grok] YYYY-MM-DD HH:mm JST
担当: 本人なしB-roll
見たもの: BRIEF / DECISIONS / STORYBOARD / PR最新コメント
提案 / 変更:
生成候補:
Claude / ChatGPTに確認したいこと:
オーナー判断が必要: なし / あり
```
