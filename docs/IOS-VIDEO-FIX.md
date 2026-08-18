# iOS in-app video compatibility

The 2026-08-18 Latest video originally shipped through a damaged binary handoff. Desktop rendering could still show the video element, but iOS/WebKit-based in-app browsers could reject the MP4 and display a disabled playback icon.

The replacement is encoded from the owner-provided original and uses a new URL so the immutable `/media/*` cache cannot retain the damaged file.

Compatibility derivative:

- H.264 Constrained Baseline
- yuv420p
- 160×284
- 15 fps
- video-only
- `+faststart` (`moov` before `mdat`)
- SHA-256 checked during every build

The verified MP4 bytes are stored as short wrapped base64 chunks under `scripts/assets/mily-b04-ios/`. `scripts/build-ios-video.mjs` reconstructs the ignored public derivative before the Vite build. CI also runs ffprobe against the reconstructed file, so a truncated or malformed handoff fails before deployment.
