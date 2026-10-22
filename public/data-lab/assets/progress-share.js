// Progressive enhancement only. No network, clipboard reads, or automatic sending.
export async function copyProgressText(text, writeText) {
  if (typeof text !== 'string' || !text.trim() || /__DATA_LAB_/.test(text) || typeof writeText !== 'function') return false;
  try { await writeText(text); return true; } catch { return false; }
}
export function initProgressShare(root, env = globalThis) {
  const button=root.getElementById('progress-copy');
  const text=root.getElementById('progress-share-text');
  const manual=root.getElementById('progress-share-manual');
  const status=root.getElementById('progress-copy-status');
  if (!button || !text || !manual || !status || button.dataset.initialized==='true') return false;
  button.dataset.initialized='true';
  button.addEventListener('click', async () => {
    if (button.disabled) return;
    button.disabled=true; status.textContent='';
    try {
      const copied=await copyProgressText(text.value, value => env.navigator.clipboard.writeText(value));
      if (copied) status.textContent='コピーしました。送信先のアプリに貼り付けて使えます。';
      else {
        manual.open=true;
        text.focus(); text.select();
        status.textContent='自動コピーできませんでした。表示した文章を選択してコピーしてください。';
      }
    } finally { button.disabled=false; }
  });
  button.hidden=false;
  return true;
}
if (typeof document !== 'undefined') initProgressShare(document);
