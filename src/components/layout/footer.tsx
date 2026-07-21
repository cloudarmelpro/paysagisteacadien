import Link from "next/link";
import {
  SiFacebook,
  SiFacebookHex,
  SiInstagram,
  SiInstagramHex,
  SiWhatsapp,
  SiWhatsappHex,
} from "@icons-pack/react-simple-icons";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import {
  siteConfig,
  services,
  footerCompanyLinks,
  privacySegment,
  servicesSegment,
} from "@/config/site";
import { LanguageSwitcher } from "./language-switcher";
import { LogoLockup } from "./logo";
import { ManageCookies } from "./manage-cookies";

type FooterLink = { label: string; href: string };

/** Titres de colonne : l'interlettrage compense la faible lisibilité des
 *  majuscules à 12px. */
const columnHeadingClass =
  "text-xs font-medium uppercase tracking-wider text-foreground/60";

function FooterColumn({
  title,
  links,
  className,
}: {
  title: string;
  links: FooterLink[];
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className={columnHeadingClass}>{title}</h3>
      <ul className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="cursor-pointer text-sm text-foreground/75 transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Pied de page bilingue : colonne de marque + Entretien, Aménagement, Entreprise, Contact. */
export function SiteFooter({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const serviceLink = (slug: string): FooterLink => ({
    label: dict.services.items[slug as keyof typeof dict.services.items],
    href: localizedPath(lang, `${servicesSegment}/${slug}`),
  });

  const maintenance = services
    .filter((s) => s.category === "maintenance")
    .map((s) => serviceLink(s.slug));
  const development = services
    .filter((s) => s.category === "development")
    .map((s) => serviceLink(s.slug));

  const company: FooterLink[] = footerCompanyLinks.map((l) => ({
    label: dict.nav[l.key],
    href: localizedPath(lang, l.segment),
  }));

  // Couleurs de marque prises dans le paquet (`*Hex`), pas recopiées.
  // LinkedIn est absent de Simple Icons : rendu en lien texte plus bas.
  const socials = [
    {
      label: "Facebook",
      href: siteConfig.social.facebook,
      Icon: SiFacebook,
      color: SiFacebookHex,
    },
    {
      label: "Instagram",
      href: siteConfig.social.instagram,
      Icon: SiInstagram,
      color: SiInstagramHex,
    },
    {
      label: "WhatsApp",
      href: siteConfig.contact.whatsapp,
      Icon: SiWhatsapp,
      color: SiWhatsappHex,
    },
  ];

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-dotted border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
        {/* Max 2 colonnes sous 1024px : à 4 colonnes dès 768px, le courriel se
            coupe en plein mot. Au-delà, grille de 12 : marque et Contact en 3,
            listes de liens en 2. */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-12">
          {/* Colonne marque */}
          <div className="col-span-2 flex flex-col items-start gap-5 lg:col-span-3">
            <Link
              href={localizedPath(lang, "")}
              aria-label={siteConfig.name}
              className="flex cursor-pointer items-center transition-opacity duration-200 hover:opacity-70"
            >
              <LogoLockup className="h-24" />
            </Link>

            <LanguageSwitcher lang={lang} label={dict.a11y.switchLanguage} />

            <nav aria-label={dict.footer.followUs} className="-ml-1 flex">
              {socials.map(({ label, href, Icon, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  /* Zone cliquable de 44px autour de la pastille de 36. */
                  className="group inline-flex size-11 cursor-pointer items-center justify-center rounded-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <span
                    className="inline-flex size-9 items-center justify-center rounded-md text-white transition-opacity duration-200 group-hover:opacity-80"
                    style={{ backgroundColor: color }}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                </a>
              ))}
            </nav>
          </div>

          <FooterColumn
            title={dict.services.maintenance}
            links={maintenance}
            className="lg:col-span-2"
          />
          <FooterColumn
            title={dict.services.development}
            links={development}
            className="lg:col-span-2"
          />

          {/* Entreprise : inclut LinkedIn en lien texte, faute de logo disponible. */}
          <div className="lg:col-span-2">
            <h3 className={columnHeadingClass}>
              {dict.footer.companyTitle}
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="cursor-pointer text-sm text-foreground/75 transition-colors duration-200 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer text-sm text-foreground/75 transition-colors duration-200 hover:text-foreground"
                >
                  {dict.footer.linkedin}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact en pleine largeur sous 640px : le courriel dépasse une
              demi-colonne à 375px. `min-w-0` est requis, sinon `min-width:auto`
              empêche la colonne de rétrécir et le courriel déborde. */}
          <div className="col-span-2 min-w-0 sm:col-span-1 lg:col-span-3">
            <h3 className={columnHeadingClass}>
              {dict.footer.contactTitle}
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li>
                <a
                  href={`tel:${siteConfig.contact.phoneRaw}`}
                  className="cursor-pointer text-foreground/75 transition-colors duration-200 hover:text-foreground"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="cursor-pointer break-words text-foreground/75 transition-colors duration-200 hover:text-foreground"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex flex-col gap-1 text-foreground/60">
                <span>{dict.contact.hours.weekdays}</span>
                <span>{dict.contact.hours.saturday}</span>
                <span>{dict.contact.hours.sunday}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barre basse : la politique de confidentialité reste ici, comme mention
            légale, et non dans la colonne « Entreprise ». */}
        <div className="mt-12 flex flex-col gap-3 border-t border-dotted border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-foreground/60">
            © {year} {siteConfig.legalName} {dict.footer.rights}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <ManageCookies label={dict.cookies.manage} />
            <Link
              href={localizedPath(lang, privacySegment)}
              className="w-fit cursor-pointer text-xs text-foreground/60 transition-colors duration-200 hover:text-foreground"
            >
              {dict.privacy.title} {dict.privacy.titleAccent}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
