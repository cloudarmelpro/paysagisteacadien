import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/dictionaries";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Faq } from "@/components/sections/faq";
import { Reveal } from "@/components/shared/reveal";

export default async function HomePage(props: PageProps<"/[lang]">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  // Le Hero n'est pas révélé : il est au-dessus de la ligne de flottaison et
  // porte le LCP. Services anime son en-tête et ses cartes en interne, donc
  // pas d'enveloppe ici (elle imbriquerait deux révélations).
  return (
    <>
      <Hero lang={lang} dict={dict} />
      <Services lang={lang} dict={dict} />
      <Reveal>
        <Faq lang={lang} dict={dict} />
      </Reveal>
    </>
  );
}
