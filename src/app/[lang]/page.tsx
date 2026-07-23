import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/dictionaries";
import { Hero } from "@/components/sections/hero";
import { StatsStrip } from "@/components/sections/stats-strip";
import { Services } from "@/components/sections/services";
import { Faq } from "@/components/sections/faq";

export default async function HomePage(props: PageProps<"/[lang]">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  // Le Hero n'est pas révélé : il est au-dessus de la ligne de flottaison et
  // porte le LCP. Services et Faq animent leurs blocs en interne, donc pas
  // d'enveloppe ici (elle imbriquerait deux révélations).
  return (
    <>
      <Hero lang={lang} dict={dict} />
      {/* Repères juste sous la vidéo : rassure avant même de scroller vers les
          services. Même bande que « À propos », mêmes données. */}
      <StatsStrip
        stats={dict.about.stats}
        className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16"
      />
      <Services lang={lang} dict={dict} />
      <Faq lang={lang} dict={dict} />
    </>
  );
}
