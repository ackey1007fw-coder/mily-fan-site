# サイト公開通知と配信開始通知

2026-10-04のオーナー依頼による実装準備。サイト公開通知とSHOWROOM開始通知は別イベントであり、録画・収集を停止、再起動、追加起動しない。

## サイト公開通知の境界

新しい記事・動画・重要なお知らせだけを対象とする。初回有効化時に既存content IDと正規URLをbaseline登録し、過去全件の投稿をしない。修正、再ビルド、再デプロイは新規content IDを生成しない。同じURLに別IDを割り当てても再送しない。

`scripts/publication-notification-state.mjs`は永続SQLite outboxのプロトコルであり、監視ジョブや投稿APIを追加するものではない。単一の既存運用から使用し、SQLiteは所有者専用の既存運用データ領域に置く。content ID/ThreadsとURL/Threadsの両方を一意にclaimする。公開URLのHTTP200だけでは不足し、同じcontent IDの実表示を確認した5分以内の証跡を必須とする。

claim後は送信前でも結果不明として再送不可。成功時は実際のThreads permalink、失敗時は秘密値を除いた理由、結果不明時は照合待ちとして保持する。結果不明の投稿を自動再試行せず、既存接続先の投稿一覧と処理履歴を照合する。Xは投稿API・課金を使用せず、同じ文面とURLの無料手動intentを作る。

## 配信開始通知

既存検知・連携の所有者と台帳を特定してから統合する。room573253の新鮮な実live状態とlive IDを、送信直前にも確認する。予定時刻だけでは送信しない。`showroom_live_start:573253:<live ID>:threads`をサイト公開と別キー/台帳にし、終了後の遅延通知・再検知・再接続・別roomを除外する。本文の優先URLは確認済み公式ルーム https://www.showroom-live.com/r/circle2026_0734 。Xは同じ本文と公式ルームURLの手動共有のみ。

## 現在の実装・稼働状態

- 既存Upload-Post profile `ackey`、Threads `ackeytan_0720`の読み取りは成功、再認証不要。
- サイトには既存のThreads/X手動共有機能がある。
- 実投稿が存在する開始通知の現行送信元・台帳は未特定。既存資料の永続送信経路は未実証と記載されており、稼働を推定しない。
- 公開候補は既存データからbuild時に`publication-feed.json`へ生成する。記事・掲載動画・明示的な`publicationNotice: "important"`だけを対象とし、更新時刻やデプロイ番号をIDにしない。NEWSは安定anchorと無料のX手動共有リンクを持つ。本文とURLはThreads候補と共有する。
- outboxは初回baselineを必須にし、既存IDを一意URLとは別にも保存する。同一URLの別IDが後日別URLへ変わっても投稿しない。baselineは一回だけ初期化し、再起動時に作り直さない。
- `notification-delivery.mjs`は既存送信connector/read-only検証のcallbackを受け取るadapter。API keyや新しいHTTP経路、retry、監視ループを持たない。`showroom-start-notification.mjs`は既存sky_hub形式を受け取り、送信直前にも実liveを再確認する。サイトoutboxとは別テーブルで一配信一回にする。
- 現行の送信元/台帳との接続、有効化、実投稿成功は未完了。新常駐ジョブ・認証・権限の追加なし。
- 以前拒否されたSNS操作を別経路で実行しない。認証追加・権限拡大が必要なら停止して報告する。
