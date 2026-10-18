/**
 * Add Vercel Web Analytics to each independent Vite HTML entry, exactly once.
 * Local HTTP previews do not expose Vercel's /_vercel/insights endpoint.
 * The HTTPS gate keeps browser tests free of expected 404 console errors.
 * Enabling Analytics in Vercel remains a separate project setting.
 */
const analyticsScriptPath = '/_vercel/insights/script.js';
const loaderMarker = 'data-mily-analytics-loader';
const legacyLoader = `<script defer src="${analyticsScriptPath}"></script>`;
const queueBootstrap = '<script>\n  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n</script>';
const conditionalLoader = [
  `<script ${loaderMarker}>`,
  '  if (window.location.protocol === "https:") {',
  '    const insights = document.createElement("script");',
  '    insights.defer = true;',
  `    insights.src = "${analyticsScriptPath}";`,
  '    document.head.appendChild(insights);',
  '  }',
  '</script>',
].join('\n');

export function injectVercelWebAnalytics(html: string): string {
  if (html.includes(loaderMarker)) return html;
  if (html.includes(legacyLoader)) return html.replace(legacyLoader, conditionalLoader);
  if (html.includes(analyticsScriptPath)) return html;

  return html.replace(/^[\t ]*<\/body>/m, (closingTag) => {
    const indent = closingTag.match(/^[\t ]*/)?.[0] ?? '';
    const block = `${queueBootstrap}\n${conditionalLoader}`
      .split('\n')
      .map((line) => `${indent}  ${line}`)
      .join('\n');
    return `${block}\n${closingTag}`;
  });
}
