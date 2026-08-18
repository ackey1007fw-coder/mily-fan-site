# iOS in-app video compatibility

The 2026-08-18 Latest video originally used an ultra-small video-only derivative. Some iOS in-app browsers displayed a disabled playback icon instead of loading it.

The production build now derives a compatibility copy at a new URL so the immutable media cache cannot retain the old response. The compatibility copy uses H.264 Baseline, yuv420p, 30 fps, AAC-LC mono audio and `+faststart`.

The source asset remains unchanged. The generated `*-ios.mp4` is a build artifact and is not committed.
