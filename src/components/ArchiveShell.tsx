import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function ArchiveShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-sage focus:px-4 focus:py-2 focus:text-white"
      >
        本文へスキップ
      </a>
      <Header />
      <main id="main">
        <section className="px-4 pb-6 pt-10 sm:pt-14">
          <div className="mx-auto max-w-3xl">
            <nav aria-label="パンくずリスト" className="text-xs text-ink-muted">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <a href="/" className="hover:text-sage-deep hover:underline">
                    ホーム
                  </a>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="font-semibold text-sage-deep">
                  {title}
                </li>
              </ol>
            </nav>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
              {eyebrow}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-ink">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-ink-muted">{description}</p>
          </div>
        </section>
        {children}
      </main>
      <Footer />
    </div>
  );
}
