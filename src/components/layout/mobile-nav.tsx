"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isActivePath, type NavLinkItem } from "./nav-links";

export function MobileNav({
  items,
  contact,
  quote,
  labels,
  className,
}: {
  items: NavLinkItem[];
  contact: NavLinkItem;
  quote: NavLinkItem;
  labels: { open: string; close: string };
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Échap ferme le menu, et le défilement est bloqué quand il est ouvert.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className={className}>
      <button
        type="button"
        aria-label={open ? labels.close : labels.open}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-foreground transition-colors duration-200 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <>
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-16 z-40 bg-foreground/20 backdrop-blur-sm animate-in fade-in duration-200"
          />
          <nav
            id="mobile-menu"
            aria-label={labels.open}
            className="absolute inset-x-0 top-full z-50 flex flex-col gap-1 border-b border-border bg-background p-4 shadow-lg animate-in slide-in-from-top-2 fade-in duration-200"
          >
            {[...items, contact].map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 cursor-pointer items-center rounded-md px-3 text-base transition-colors duration-200",
                    active
                      ? "bg-muted font-medium text-foreground"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href={quote.href}
              onClick={() => setOpen(false)}
              /* h-11 : cible tactile de 44px, au-dessus du h-9 par défaut. */
              className={cn(buttonVariants(), "mt-2 h-11 text-base")}
            >
              {quote.label}
            </Link>
          </nav>
        </>
      )}
    </div>
  );
}
