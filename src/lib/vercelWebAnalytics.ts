/**
 * Inject Vercel's first-party Web Analytics into each independently built HTML
 * entry page. index.html already has this snippet; do not double-inject it.
 *
 * This only prepares pageview measurement. Analytics must still be enabled in
 * the project's Vercel dashboard before events can appear there.
 */
const analyticsScriptPath = '/_vercel/insights/script.js';

export function injectVercelWebAnalytics(html: string): string {
  if (html.includes(analyticsScriptPath)) return html;

  return html.replace(/^[\t ]*<\/body>/m, (closingTag) => {
    const indent = closingTag.match(/^[\t ]*/)?.[0] ?? '';
    const childIndent = `${indent}  `;
    return [
      `${childIndent}<script>`,
      `${childIndent}  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };`,
      `${childIndent}</script>`,
      `${childIndent}<script defer src="${analyticsScriptPath}"></script>`,
      `${indent}</body>`,
    ].join('\n');
  });
}
