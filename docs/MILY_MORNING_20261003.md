# 2026年10月3日朝配信 — 制作記録

既存branch `feat/schedule-20261003-07-x` を継続する。PR386は既にmerge済み。今回の追補は朝配信の素材・記事と、予定案内の4件のP2対応。PR370や他open PRを変更しない。

## 素材の確認

実録画 `mily_showroom_2026-10-03_06-30-44_live23505265.mkv` のフレームから10枚を選び、原寸640×360で全件確認。視聴者コメント・表示名・第三者を含めない。閉眼に近い暫定画像1枚を録画48:00に交換。顔・身体の生成、補正、写真の拡大は行っていない。

各画像の元録画秒とSHAは [manifest](MILY_MORNING_MEDIA_20261003.json)。Mily正式表紙は720×1280、実写真のpixelを保った文字・枠のレイアウト。掲載本文は全編ASRの照合待ち。原音短尺は実聴未確認で保留。

## 予定案内の追補

- JPEG/WebP既存derivativeを利用。1600のfilenameに対して実幅1536のdescriptorを使用し、原寸リンクを維持。
- NEWSは本人画像の13枠と、HOMEの未終了枠を区別。終了後も事実として読める文章へ変更。
- NEWSから既存Supportへの案内CTAを追加。
- SHOWROOM導線は既存schedule hookのroomUrl優先、確認済みsocialをfallbackとし、URL正本を増やさない。

関連5 tests、typecheck、Vite build成功。fresh Chrome390/1440で480/960WebP選択、object-contain、原寸リンク、API room overrideとfallback、overflowなし、JS errorなしを確認。全体test/build/guard、朝本文全編照合、current-head reviewはこの後の公開条件。

## 全編照合追補 — 09:13 JST

既存ASR全編1188 segments完了。音声frame168803件のPTS対応、最大frame誤差0.000667秒。suffix再開1694.67 decoded秒は1703.843元録画秒、WAV sample cut誤差/重複/欠落0。本文は要約、実聴したという意味ではない。個人名・曲名・歌詞・gift明細を公開本文へ入れず、原音clipは保留。記事・NEWS導線を追加、最終QA/CI待ち。
