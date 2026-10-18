/* Same-origin, CSP-compatible Vercel Web Analytics bootstrap.
 * The data lab disallows inline scripts (script-src 'self').
 * Local HTTP previews do not have Vercel's insights endpoint.
 */
(() => {
  "use strict";

  if (window.location.protocol !== "https:") return;

  window.va = window.va || function () {
    (window.vaq = window.vaq || []).push(arguments);
  };

  const insightsPath = "/_vercel/insights/script.js";
  if (document.querySelector(`script[src="${insightsPath}"]`)) return;

  const insights = document.createElement("script");
  insights.src = insightsPath;
  insights.async = true;
  document.head.appendChild(insights);
})();
