/** Add the CSP-safe first-party analytics loader to every Vite HTML entry.
 * Pages under data-lab/ declare script-src 'self' and block inline JavaScript.
 * The actual loader lives in public/mily-analytics-loader.js.
 */
const loaderPath = "/mily-analytics-loader.js";
const loaderTag = `<script defer src="${loaderPath}"></script>`;

export function injectVercelWebAnalytics(html: string): string {
  if (html.includes(loaderPath)) return html;

  return html.replace(/^[\t ]*<\/body>/m, (closingTag) => {
    const indent = closingTag.match(/^[\t ]*/)?.[0] ?? "";
    return `${indent}${loaderTag}\n${closingTag}`;
  });
}
