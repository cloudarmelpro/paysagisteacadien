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
  // porte le LCP.
  return (
    <>
      <Hero lang={lang} dict={dict} />
      <Reveal>
        <Services lang={lang} dict={dict} />
      </Reveal>
      <Reveal>
        <Faq lang={lang} dict={dict} />
      </Reveal>
    </>
  );
}
