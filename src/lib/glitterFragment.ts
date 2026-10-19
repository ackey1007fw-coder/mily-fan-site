/** React描画前に解決できなかった共有リンクを、DOM反映後に一度合わせる。 */
export function watchGlitterFragment(win: Window, doc: Document): () => void {
  const fragment = "#show-glitter-guide";
  let first: number | null = null;
  let second: number | null = null;
  const cancel = () => {
    if (first !== null) win.cancelAnimationFrame(first);
    if (second !== null) win.cancelAnimationFrame(second);
    first = second = null;
  };
  const align = () => {
    cancel();
    if (win.location.hash !== fragment) return;
    first = win.requestAnimationFrame(() => {
      first = null;
      second = win.requestAnimationFrame(() => {
        second = null;
        if (win.location.hash !== fragment) return;
        doc.getElementById("show-glitter-guide")?.scrollIntoView({
          block: "start", behavior: "instant",
        });
      });
    });
  };
  win.addEventListener("hashchange", align);
  align();
  return () => {
    cancel();
    win.removeEventListener("hashchange", align);
  };
}
