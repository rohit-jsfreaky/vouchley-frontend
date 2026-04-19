import { ABOUT_HERO } from "@/config/about";

export function AboutHero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 pt-8 md:px-8 md:pb-32">
      <h1 className="max-w-4xl font-serif text-5xl leading-tight tracking-tight text-ink md:text-7xl">
        {ABOUT_HERO.title}
      </h1>
    </section>
  );
}
