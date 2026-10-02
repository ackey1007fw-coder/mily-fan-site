# 2026-10-02 SHOWROOM朝配信の静止画SNS

## 根拠と承認範囲

- オーナーの2026-10-02の継続依頼に基づく静止画SNS。公開済み本文と確認済みb180画像だけを使用する。
- PR #380は10:31 JSTにsquash merge（`445e2778f88c5b695ac146c29e18fd596c8ca06f`）。同SHAのProduction成功と320/390/1440pxの本文・実スクショ10枚・保存リンク確認は、[10:36の本番確認記録](https://github.com/ackey1007fw-coder/mily-fan-site/pull/380#issuecomment-5943952913)による。今回、サイト表示検証を再実行したという意味ではない。
- [公開記事](https://mily-fan-site.vercel.app/activities/live/#recap-2026-10-02-morning-showroom)とcurrent mainの当該本文・画像・MEDIA / CONTENT-OPSを照合した。指定3種のProject Memory文書は存在しないため新設しない。
- 現行main・open PR・PR #380の後発コメント、Upload-Postの直近履歴・予約一覧、X / Instagram / TikTokの接続先投稿一覧を照合。着手時点で朝レポの公開済み投稿は確認されず、Instagramには同記事の既存予約が1件あった。その予約を新規投稿・予約で重複させない。

## 媒体ごとの状態

| 媒体 | 状態 | 日時（JST） | 結果 |
| --- | --- | --- | --- |
| TikTok | 公開成功、接続先読戻し済み | 2026-10-02 12:16:36 | https://www.tiktok.com/t/7691903695587609864 |
| Instagram feed | 既存予約を保持、未公開 | 2026-10-03 09:00予定 | job `1e65617b9dcb4394b24056dcdf253948` / request `6a3a990a583b467995315be814650d06` |
| X | 投稿文＋添付4枚を完成、未投稿 | — | URLを保持できる投稿経路での実行が残る |

- TikTok request `c3cb533b34dc46ab8fbd0be50bca4353` / job `9faff7f0662b49c9a2048669a6591178`はcompleted・success=true、公開ID `7691903695587609864`。接続先一覧でも同ID・PHOTO・本文の `@seasidecircle`・記事URL・開始日表記を確認した。
- 既存Instagram予約は2026-10-02 10:47:34 JST作成。予約一覧の本文は `@mily_chan36` と当該記事URLを含み、jobはqueued / pending。今回、予約日時・本文・画像・タグを変更していない。予約APIの返却には本人ユーザータグの設定が含まれないため、本文メンションの確認と本人タグの確認を混同しない。本人タグは未確認、公開成功URLも未確定。
- XのUpload-Post経路は本文・title・first commentからクリック可能なURLを除去する[現行仕様](https://docs.upload-post.com/api/upload-photo/)。必須のサイト導線を失う投稿を行わず、完成した本文・画像4枚を保持。ブラウザーへの経路変更または人間による投稿が残る。未投稿を送信済みにしない。
- Instagram Reels・YouTube Shorts、音声付きSNS、未聴取短尺4候補は投稿していない。

## 静止画と投稿内容の検品

- current mainのb180-01〜10 JPEGを個別に表示して確認。10枚とも640×360、EXIFなし、異なるSHA-256。第三者・視聴者名・コメントUI・お礼ボードなし。公開済み画像のバイト列は変更せず、顔・身体の生成変更、補正、クロップ、拡大を行わない。
- TikTokは代表のb180-10を先頭に、b180-01〜09の順で10枚。固定merge SHAのraw GitHub画像URLを使用し、`tiktokAutoAddMusic=false`、`tiktokPostMode=DIRECT_POST`を明示。元音声・BGM・動画を渡していない。投稿一覧のPHOTO確認は実聴取ではなく、音楽指定なしという送信条件と区別する。
- X添付用はb180-10 / 01 / 05 / 07の4枚。タイトル入り生成画像や別配信の写真を追加しない。完成本文の保守的なweighted文字数上限221（URLは23文字換算）で単発投稿に収まる。
- 四次WEB投票は10/2 12:00、SHOWROOM無料ギフト審査・イベント審査は10/3 05:00開始（日本時間）と媒体別本文に明記。今回、[主催者SCHEDULE](https://www.misscircle.jp/)で再照合。未確認の回数制限・倍率適用・曲名を追加しない。
- 全文ASR・原録画・非公開素材情報・私的情報はSNS・公開台帳へ入れない。

## TikTok公開本文

タイトル: 10/2朝のみりぃ🍅✨ みんなを信じて前へ

```text
@seasidecircle
WEB投票を前に、応援への感謝とみんなの一日へのエールを伝えてくれた朝☺️
笑顔や手を振るしぐさ、当日の実スクショ10枚です。

四次審査のWEB投票は10/2 12:00開始。
SHOWROOM無料ギフト審査・イベント審査は10/3 05:00開始（日本時間）。

配信レポートと画像の保存はこちら👇
https://mily-fan-site.vercel.app/activities/live/#recap-2026-10-02-morning-showroom

非公式ファン制作／当日の配信から。音声・BGMなし。
#三橋莉子 #みりぃ #SHOWROOM #ミスサークル2026 #朝配信
```

## X完成本文（未投稿）

```text
@Mily_chan36
10/2朝のみりぃ☺️ みんなを信じて前へ🍅✨
四次WEB投票は10/2 12:00、SHOWROOM無料ギフト・イベント審査は10/3 05:00開始（JST）。
朝レポ＋実スクショ10枚👇
https://mily-fan-site.vercel.app/activities/live/#recap-2026-10-02-morning-showroom
非公式ファン制作
#三橋莉子 #みりぃ
```

## 残る操作

1. URLを保持できる経路でXの完成本文＋画像4枚を投稿し、メンション・記事リンク・画像数・成功URLを読戻す。
2. Instagram既存予約の本人ユーザータグを確認する。10/3 09:00の公開後に成功URLを読戻し、予約状態を公開成功へ更新する。
3. 未聴取短尺・未検品音声は公開禁止を維持する。

## 2026-10-02 正式表紙への差し替え準備（継続依頼）

上の「既存予約を保持」は当時の状態。最新のオーナー指示により、PR #383は今回の正式表紙・素材・予約payload記録に絞り、AGENTS／CONTENT-OPS／恒久guard・testは別の専用PRへ分離する。表紙はb180-10、残りは01〜09、計10枚で全場面を保持する。原写真の全画角・全ピクセルを維持した720×900の4:5画像と、朝専用本文・@mily_chan36・本人タグ・レポートURL・全altを準備した。

この記録時点では古い10/3 09:00 JST予約1件を取消していない。APIの先頭ファイル情報では正式表紙がないことを確認したが、全画像順序・枚数・人物タグは返却対象外で未確認。素材HTTP実体、CI／Preview／current-headレビュー、直前の重複一覧と将来の時刻を確認するまで差し替えない。取消後は確認を挟み、一度だけ新規予約し、登録1件と返却された内容を照合する。恒久手順・guardは依存するルール専用PRで検証し、この素材PRだけで予約を変更しない。

公開済み夜Instagram・夜X・朝TikTokには変更を加えない。朝XのURL保持対応は別担当の既存作業と調整し、ここで追加投稿しない。

### 今回のInstagram予約payload（準備済み・未送信）

- 既存profile `ackey`／Instagram `ackeytan_0720`、画像carousel10枚。先頭 `mily-b180-11-morning-instagram-cover.png`、続いて `12`〜`20-morning-instagram-still-01`〜`09.png`。元場面の順序は10／01〜09。全10画像に個別altを付ける。
- 予約予定は2026-10-03 09:00 Asia/Tokyo（00:00 UTC）。本文メンション `@mily_chan36`、本人タグ `{username:"mily_chan36", x:0.5, y:0.9}`。画像のサイトURL表示と本文の当該記事リンクを併用する。
- HTTPS素材は固定コミットの公開ファイルで全10件HTTP200／検品SHA-256一致確認済み。ローカルPCパスを接続アプリへ渡さない。以下は今回の完成本文であり、送信結果や公開確認ではない。

```text
@mily_chan36
2026年10月2日朝のMily（みりぃ）☺️
WEB投票が始まる日の朝、みんなを信じて前へ。
案内コメントへの感謝と、みんなの一日へのエールを伝えてくれました🍅✨
正式カバーと実スクショで、当日の10場面をお届けします。

配信レポートはこちら。
https://mily-fan-site.vercel.app/activities/live/#recap-2026-10-02-morning-showroom

非公式ファン制作／当日の録画から選んだ実スクショです。
#三橋莉子 #みりぃ #SHOWROOM #ミスサークル2026
```
