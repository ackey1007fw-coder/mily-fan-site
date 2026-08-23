import { useEffect, useState } from "react";

/** これ以上スクロールしたらボタンを出す（px）。 */
const SHOW_AFTER_PX = 600;

function prefersReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * ページ最上部へ戻るフローティングボタン。
 * スマホでは MobileActionDock（投票 / 応援・予定）の上に置き、ドックを隠さない。
 */
export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setVisible(window.scrollY > SHOW_AFTER_PX);
    };

    const onScroll = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "instant" : "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="ページ上部へ戻る"
      className={[
        "fixed right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full",
        "bottom-[calc(6rem+env(safe-area-inset-bottom))] sm:bottom-6 sm:right-6",
        "border border-sage/25 bg-paper-card/95 text-sage-deep shadow-card backdrop-blur",
        "transition duration-300 hover:bg-sage-soft hover:text-sage-deep motion-reduce:transition-none",
        visible
          ? "visible translate-y-0 opacity-100"
          : "invisible translate-y-2 opacity-0",
      ].join(" ")}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  );
}
