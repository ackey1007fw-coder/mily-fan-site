# Historical content views

The dated regression suites under `scripts/` capture the editorial state that
existed before batch b41. Many of those suites intentionally assert the top
NEWS/Gallery position or an exact item count from that point in time.

The `*-before-b41.ts` modules remove later records (batch b41, batch b43,
batch b44, the 2026-08-29 SHOWROOM radio / third-round X posts, the
2026-08-30 Mixch final-day outbound card, and the 2026-08-30〜31
text/link X posts) while continuing
to reuse the production objects and selectors. This keeps those historical
assertions meaningful without weakening current-content coverage: batch b41 is
tested directly against the production modules in
`instagram-stories-20260828-29.test.mjs`, batch b43 is tested in
`instagram-stories-20260829-30.test.mjs`, batch b44 is tested in
`instagram-stories-20260831.test.mjs`, the 8/29 SHOWROOM posts are
tested in `x-posts-20260829-showroom-radio.test.mjs`, the 8/30 Mixch
movie is tested in `mixch-final-day-20260830.test.mjs`, and the 8/30〜31
X posts are tested in `x-posts-20260830-31-news.test.mjs`.
