# Historical content views

The dated regression suites under `scripts/` capture the editorial state that
existed before batch b41. Many of those suites intentionally assert the top
NEWS/Gallery position or an exact item count from that point in time.

The `*-before-b41.ts` modules remove only the two b41 records while continuing
to reuse the production objects and selectors. This keeps those historical
assertions meaningful without weakening current-content coverage: batch b41 is
tested directly against the production modules in
`instagram-stories-20260828-29.test.mjs`.
