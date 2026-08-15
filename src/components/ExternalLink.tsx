import type { ReactNode } from "react";
import { toSafeHref } from "../lib/externalLink";

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function ExternalLink({ href, children, className }: ExternalLinkProps) {
  const safeHref = toSafeHref(href);

  if (!safeHref) {
    return <span className={className}>{children}</span>;
  }

  return (
    <a
      href={safeHref}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span className="sr-only">（新しいタブで開きます）</span>
    </a>
  );
}
