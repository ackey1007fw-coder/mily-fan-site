# Historical content views

The dated regression suites under `scripts/` capture the editorial state that
existed before batch b41. Many of those suites intentionally assert the top
NEWS/Gallery position or an exact item count from that point in time.

The `*-before-b41.ts` modules remove later records (batch b41, the
2026-08-29 SHOWROOM radio / third-round X posts, and the 2026-08-30 Mixch
final-day outbound card) while continuing
to reuse the production objects and selectors. This keeps those historical
assertions meaningful without weakening current-content coverage: batch b41 is
tested directly against the production modules in
`instagram-stories-20260828-29.test.mjs`, the 8/29 SHOWROOM posts are
tested in `x-posts-20260829-showroom-radio.test.mjs`, and the 8/30 Mixch
movie is tested in `mixch-final-day-20260830.test.mjs`.
