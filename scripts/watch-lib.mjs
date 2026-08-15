/**
 * 公開情報の監視で使う「純粋な比較・整形ロジック」。
 * ネットワークアクセスは持たないのでそのままテストできる。
 *
 * 方針:
 * - 取得失敗（HTTP / timeout / parse）は "source-unavailable" として扱い、
 *   「SNS が削除された」等のデータ変更と混同しない。
 * - 本人ページでない / 別人ルームは採用しない（差分ではなく警告として扱う）。
 * - 外部 HTML 由来の文字列は必ず sanitizeValue() を通してから出力する。
 */

/** 監視結果の種類。 */
export const SEVERITY = {
  /** サイト登録値と実ページの値が食い違う（人間の確認が必要） */
  change: "change",
  /** 取得できなかった。データ変更とは区別する */
  unavailable: "unavailable",
  /** 本人ページ／本人ルームと確認できない。値は採用しない */
  identity: "identity",
};

/**
 * 外部由来の文字列を Markdown / ログへ安全に出せる形にする。
 * - 制御文字・改行を落とす（表崩れとログインジェクション対策）
 * - Markdown で意味を持つ文字を無害化し、パイプは表を壊さないよう置換
 * - 長すぎる値は切り詰める
 */
export function sanitizeValue(value, maxLength = 200) {
  if (value === null || value === undefined) return "(なし)";
  const text = String(value)
    // 制御文字・改行・零幅文字を落とす（表崩れとログ汚染への対策）
    .replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028\u2029\ufeff]+/g, " ")
    .replace(/`/g, "'")
    .replace(/\|/g, "/")
    .replace(/[<>]/g, "")
    .trim();
  if (text.length === 0) return "(空)";
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

/** 比較用に URL を正規化する（末尾スラッシュ・www・大小文字の揺れを吸収）。 */
export function normalizeUrl(url) {
  if (typeof url !== "string") return null;
  let parsed;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  const path = parsed.pathname.replace(/\/+$/, "").toLowerCase();
  return `${host}${path}`;
}

/** URL からプラットフォームを判定する。 */
export function platformOf(url) {
  const normalized = normalizeUrl(url);
  if (!normalized) return null;
  if (normalized.startsWith("x.com/") || normalized.startsWith("twitter.com/")) {
    return "x";
  }
  if (normalized.startsWith("instagram.com/")) return "instagram";
  if (normalized.startsWith("tiktok.com/")) return "tiktok";
  if (normalized.startsWith("showroom-live.com/")) return "showroom";
  return null;
}

/**
 * 登録済み SNS と、実ページから取れた SNS を突き合わせる。
 * @param registered {{platform: string, url: string}[]} socials.ts の値
 * @param observed string[] 実ページから抽出した本人名義リンク
 */
export function diffSnsLinks(registered, observed) {
  const findings = [];
  const observedByPlatform = new Map();
  for (const url of observed) {
    const platform = platformOf(url);
    if (!platform) continue;
    if (!observedByPlatform.has(platform)) observedByPlatform.set(platform, url);
  }

  for (const entry of registered) {
    // SHOWROOM は room 解決側で別途検証するのでここでは扱わない
    if (entry.platform === "showroom") continue;
    const observedUrl = observedByPlatform.get(entry.platform);
    if (!observedUrl) {
      findings.push({
        severity: SEVERITY.unavailable,
        item: `SNS: ${entry.platform}`,
        current: entry.url,
        observed: null,
        note: "エントリーページ上で見つからなかった（掲載場所の変更や一時的な描画差の可能性）。削除と断定しない。",
      });
      continue;
    }
    if (normalizeUrl(entry.url) !== normalizeUrl(observedUrl)) {
      findings.push({
        severity: SEVERITY.change,
        item: `SNS: ${entry.platform}`,
        current: entry.url,
        observed: observedUrl,
        note: "エントリーページの掲載 URL が登録値と異なる。",
      });
    }
  }

  for (const [platform, url] of observedByPlatform) {
    if (platform === "showroom") continue;
    const known = registered.some((entry) => entry.platform === platform);
    if (!known) {
      findings.push({
        severity: SEVERITY.change,
        item: `SNS: ${platform}（未登録）`,
        current: null,
        observed: url,
        note: "エントリーページに、サイト未登録の SNS が掲載されている。",
      });
    }
  }

  return findings;
}

/**
 * SHOWROOM ルームの解決結果を登録値と比較する。
 * @param registeredUrl string|null socials.ts の SHOWROOM URL
 * @param resolved {roomId, roomUrlKey, roomUrl, roomName}|null
 */
export function diffShowroom(registeredUrl, resolved) {
  if (!resolved || !resolved.roomId) {
    return [
      {
        severity: SEVERITY.unavailable,
        item: "SHOWROOM room",
        current: registeredUrl,
        observed: null,
        note: "エントリーページから本人ルームを解決できなかった。ルーム削除とは断定しない。",
      },
    ];
  }

  const findings = [];
  if (registeredUrl && normalizeUrl(registeredUrl) !== normalizeUrl(resolved.roomUrl)) {
    findings.push({
      severity: SEVERITY.change,
      item: "SHOWROOM room URL",
      current: registeredUrl,
      observed: resolved.roomUrl,
      note: `解決したルーム名: ${resolved.roomName ?? "(不明)"} / room_id: ${resolved.roomId}`,
    });
  }
  return findings;
}

/**
 * 審査フェーズの表記を比較する。
 * 公開表記（ルーム名など）に登録済みフェーズ名が含まれていれば「変更なし」。
 */
export function diffPhase(registeredPhaseName, observedText) {
  if (typeof observedText !== "string" || observedText.trim() === "") {
    return [
      {
        severity: SEVERITY.unavailable,
        item: "審査フェーズ",
        current: registeredPhaseName,
        observed: null,
        note: "フェーズ表記を含む公開文字列を取得できなかった。",
      },
    ];
  }
  if (!registeredPhaseName) {
    return [
      {
        severity: SEVERITY.change,
        item: "審査フェーズ（未登録）",
        current: null,
        observed: observedText,
        note: "contest.ts に currentPhase が未登録。公開表記を確認して登録を検討する。",
      },
    ];
  }
  if (observedText.includes(registeredPhaseName)) return [];
  return [
    {
      severity: SEVERITY.change,
      item: "審査フェーズ",
      current: registeredPhaseName,
      observed: observedText,
      note: "公開表記に登録済みフェーズ名が含まれていない。審査が進んだ可能性。",
    },
  ];
}

/** 変更（change）が1件でもあるか。unavailable だけなら通知しない。 */
export function hasChanges(findings) {
  return findings.some((finding) => finding.severity === SEVERITY.change);
}

/**
 * 同じ変更で Issue を量産しないための指紋。
 * change の項目と値だけから作る（unavailable は含めない）。
 */
export function fingerprint(findings) {
  const parts = findings
    .filter((finding) => finding.severity === SEVERITY.change)
    .map(
      (finding) =>
        `${finding.item}::${normalizeUrl(finding.current) ?? finding.current ?? ""}=>${
          normalizeUrl(finding.observed) ?? finding.observed ?? ""
        }`,
    )
    .sort();
  let hash = 5381;
  for (const char of parts.join("|")) {
    hash = ((hash << 5) + hash + char.codePointAt(0)) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

const SEVERITY_LABEL = {
  [SEVERITY.change]: "変更",
  [SEVERITY.unavailable]: "取得できず",
  [SEVERITY.identity]: "本人確認できず",
};

/** Issue / summary 本文（Markdown）を組み立てる。外部文字列は必ず sanitize 済み。 */
export function renderReport({ findings, checkedAt, entryUrl, fingerprintValue }) {
  const lines = [];
  lines.push(`- 検知日時: ${sanitizeValue(checkedAt, 40)}`);
  lines.push(`- 主ソース: ${sanitizeValue(entryUrl, 120)}`);
  lines.push("");
  lines.push("| 種別 | 項目 | サイト登録値 | 取得値 | 備考 |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const finding of findings) {
    lines.push(
      `| ${SEVERITY_LABEL[finding.severity] ?? finding.severity} | ${sanitizeValue(
        finding.item,
        60,
      )} | \`${sanitizeValue(finding.current, 120)}\` | \`${sanitizeValue(
        finding.observed,
        120,
      )}\` | ${sanitizeValue(finding.note, 160)} |`,
    );
  }
  lines.push("");
  lines.push("### 対応候補");
  lines.push("");
  lines.push("1. 出典ページを開いて値を目視確認する（誤検知の可能性があるため必須）。");
  lines.push(
    "2. 確認できたら `src/data/socials.ts` / `src/data/contest.ts` を **手動で** 更新し、`lastVerifiedAt` を更新する。",
  );
  lines.push("3. 一時的な障害だった場合はこの Issue を close する。");
  lines.push("");
  lines.push(
    "> この Issue は自動生成です。**データの自動更新は行っていません。** 反映には人間の確認と PR が必要です。",
  );
  lines.push("");
  lines.push(`<!-- mily-watch:fingerprint=${fingerprintValue} -->`);
  return lines.join("\n");
}
