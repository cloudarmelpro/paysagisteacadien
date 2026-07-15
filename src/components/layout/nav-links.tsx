"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type NavLinkItem = { label: string; href: string };

/** Un lien est actif sur correspondance exacte, ou si la page est un enfant du segment. */
export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Navigation desktop. L'état actif est souligné (via ::after, sans décalage
 * de layout) et renforcé par `aria-current` pour les lecteurs d'écran.
 */
export function NavLinks({ items }: { items: NavLinkItem[] }) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative cursor-pointer py-1 text-sm transition-colors duration-200",
              "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200",
              "hover:text-foreground hover:after:scale-x-100",
              active
                ? "font-medium text-foreground after:scale-x-100"
                : "text-foreground/70",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
