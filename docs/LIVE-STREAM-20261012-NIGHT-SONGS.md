# 2026-10-12 最終夜SHOWROOM・歌唱曲の出典照合

- 対象は10月12日夜の既存配信レポート `2026-10-12-final-night-showroom` の **「この回に歌った曲」** セクションだけ。
- 同日録画の先頭は約21:00:57（日本時間）、音声の自動文字起こしは411チャンク。歌唱箇所のタイムスタンプを抽出し、各曲の異なる歌詞部分が既知の原曲と一致することを外部公表情報で照合した。
- **全編の手動実聴・逐語校正は未実施**。下記は保存録画先頭からの歌唱開始目安（数秒程度のずれの可能性あり）で、配信全体の開始・公式セットリストではない。
- 原曲・公式動画の出典だけを掲載し、非公式のカバー映像、歌詞全文・個人コメント・録画は載せない。みりぃ本人の歌唱映像をYouTubeの原曲と誤認させない。

| 録画先頭から | 曲名・原アーティスト | 特定根拠 | 公式YouTube |
|---|---|---|---|
| 0:24:20 | 超最強 / 超ときめき♡宣伝部 | 21:25頃の繰り返しフレーズと推し活の歌詞展開を原曲MV・公開歌詞で照合 | https://www.youtube.com/watch?v=Yeahpo-0Ub4 |
| 0:32:20 | ヘビーローテーション / AKB48 | 21:33以降のサビ周辺・A/Bメロの特徴的な語順を公表歌詞と照合 | https://www.youtube.com/watch?v=lkHlnWFnA0c |
| 0:40:00 | とくべチュ、して / ＝LOVE | 21:40頃の導入、21:42以降の特徴的な複数の歌詞を公式18thシングル収録曲と照合 | https://www.youtube.com/watch?v=F3P8vcZkIh4 |
| 0:49:02 | Mela! / 緑黄色社会 | 21:49〜21:53の冒頭とサビ周辺の特徴的なフレーズを原曲と照合 | https://www.youtube.com/watch?v=aRDURmIYBZ4 |
| 0:56:21 | ファンサ / mona（CV：夏川椎菜） | 21:57〜22:01の複数の歌詞区間を原曲と照合。SHOWROOM審査終了後まで続いた最後の一曲 | https://www.youtube.com/watch?v=lzyDD8bMDKs |

## 公式URLの確認根拠

- 超ときめき♡宣伝部「超最強」：投稿主 `Cho Tokimeki♡Sendenbu Official` のMusic Video（https://www.youtube.com/watch?v=Yeahpo-0Ub4）。
- AKB48「ヘビーローテーション」：投稿主 `AKB48` の公式Music Video（https://www.youtube.com/watch?v=lkHlnWFnA0c）。同グループの公開ディスコグラフィー：https://www.akb48.co.jp/about/discography/detail_cd/?media_id=28
- ＝LOVE「とくべチュ、して」：公式18thシングル特設サイト https://equal-love.jp/feature/specialsite_18thsingle およびソニーミュージック公式の動画紹介（https://prtimes.jp/main/html/rd/p/000004547.000013546.html）に記載されたMusic Video。
- 緑黄色社会「Mela!」：ソニーミュージック公式 https://www.sonymusic.co.jp/artist/ryokusyaka/info/581661 に記載されたMusic Video。
- mona「ファンサ」：HoneyWorks公式 https://honeyworks.jp/news/5178/ に紹介された本人楽曲のMusic Video。

`scripts/approved-song-links.mjs` に今回未登録だった公式URLだけ3件追加。既登録の2曲は変更しない。曲数・順序・URLを新しいテストで固定し、既存のLIVE STREAMカードと全配信歌リストの共通データを使う。
