import { Reveal } from "@/components/marketing/animation/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ } from "@/config/home";

export function Faq() {
  return (
    <section className="px-6 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-3xl">
        <Reveal className="mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            FAQ
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            Frequently asked questions.
          </h2>
        </Reveal>

        <Reveal>
          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger className="py-5 text-left text-base font-medium text-ink hover:no-underline md:text-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed text-ink-muted">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
