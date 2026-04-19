import { CONTACT_HERO } from "@/config/contact";

export function ContactHero() {
  return (
    <div>
      <h1 className="mb-6 font-serif text-5xl leading-none tracking-tight text-brand md:text-[3.5rem]">
        {CONTACT_HERO.title}
      </h1>
      <p className="max-w-md text-lg text-ink-muted">
        {CONTACT_HERO.subtitle}
      </p>
    </div>
  );
}
