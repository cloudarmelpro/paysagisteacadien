import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/dictionaries";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Faq } from "@/components/sections/faq";

export default async function HomePage(props: PageProps<"/[lang]">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <Hero lang={lang} dict={dict} />
      <Services lang={lang} dict={dict} />
      <Faq lang={lang} dict={dict} />
    </>
  );
}
