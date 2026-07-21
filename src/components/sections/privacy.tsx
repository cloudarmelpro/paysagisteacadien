import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/shared/reveal";
import { PrivacyToc } from "./privacy-toc";

// Même pilule claire que les pages à bande photo : la bande est sombre dans les
// deux thèmes, le badge reste donc clair.
const badgeOnBand =
  "w-fit rounded-full bg-white/90 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase backdrop-blur-sm";

/**
 * Politique de confidentialité (Loi 25 — Québec). Les coordonnées proviennent de
 * `siteConfig` et doivent rester identiques à celles du JSON-LD.
 * Sommaire latéral collant : ses ancres doivent rester alignées avec les `id`
 * des sections (`collected`, `section-<i>`, `officer`).
 */
export function Privacy({ dict }: { lang: Locale; dict: Dictionary }) {
  const p = dict.privacy;

  const toc = [
    { id: "collected", label: p.collected.heading },
    ...p.sections.map((s, i) => ({ id: `section-${i}`, label: s.heading })),
    { id: "officer", label: p.officer.heading },
  ];

  return (
    <div>
      {/* Même bande pleine largeur que les pages de service, mais en aplat :
          une photo commerciale derrière un document juridique en affaiblirait
          le sérieux. `data-hero` : sentinelle de header-adaptive. */}
      <section className="-mt-16">
        <div
          data-hero
          className="relative isolate overflow-hidden bg-[oklch(0.24_0.02_152)]"
        >
          <div className="relative mx-auto w-full max-w-7xl px-5 pt-36 pb-16 sm:px-8 lg:px-12 lg:pt-44 lg:pb-20">
            <div className="flex max-w-3xl flex-col items-start gap-5">
              <span className={badgeOnBand}>{p.badge}</span>
              <h1 className="text-4xl tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
                {p.title}{" "}
                <span className="text-[oklch(0.86_0.12_150)]">
                  {p.titleAccent}
                </span>
              </h1>
              <p className="text-lg leading-relaxed text-white/85">{p.intro}</p>
              <p className="text-sm text-white/65">
                {p.updatedLabel} : {p.updatedAt}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-12 lg:pb-24">
      {/* Sommaire à DROITE ≥ lg (mais premier dans le DOM → en haut sur mobile,
          repoussé à droite par `order`) + contenu à gauche. */}
      <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(0,44rem)_15rem] lg:gap-16">
        <PrivacyToc items={toc} label={p.tocLabel} />

        <div className="flex flex-col gap-12 lg:order-1">
          {/* Renseignements recueillis */}
          <Reveal id="collected" className="scroll-mt-24">
            <h2 className="text-xl font-medium tracking-tight text-foreground">
              {p.collected.heading}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-foreground/70">
              {p.collected.intro}
            </p>
            <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-base leading-relaxed text-foreground/70">
              {p.collected.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>

          {/* Sections juridiques */}
          {p.sections.map((section, i) => (
            <Reveal
              key={section.heading}
              id={`section-${i}`}
              delay={(i % 3) * 80}
              className="scroll-mt-24"
            >
              <section className="flex flex-col gap-3">
                <h2 className="text-xl font-medium tracking-tight text-foreground">
                  {section.heading}
                </h2>
                <p className="text-base leading-relaxed text-foreground/70">
                  {section.body}
                </p>
              </section>
            </Reveal>
          ))}

          {/* Coordonnées du responsable */}
          <Reveal
            id="officer"
            from="scale"
            className="scroll-mt-24 flex flex-col gap-3 rounded-3xl bg-muted p-8"
          >
            <h2 className="text-xl font-medium tracking-tight text-foreground">
              {p.officer.heading}
            </h2>
            <p className="text-base leading-relaxed text-foreground/70">
              {p.officer.body}
            </p>
            <div className="mt-1 flex flex-col gap-1 text-base">
              <span className="font-medium text-foreground">
                {siteConfig.owner}
              </span>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="w-fit cursor-pointer break-all text-primary transition-colors hover:text-foreground"
              >
                {siteConfig.contact.email}
              </a>
              <a
                href={`tel:${siteConfig.contact.phoneRaw}`}
                className="w-fit cursor-pointer text-primary transition-colors hover:text-foreground"
              >
                {siteConfig.contact.phone}
              </a>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/60">
              {p.officer.recourse}
            </p>
          </Reveal>
        </div>
      </div>
      </div>
    </div>
  );
}
