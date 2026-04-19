import { DraftingCompass } from "lucide-react";

import { ABOUT_STORY } from "@/config/about";

export function AboutStory() {
  return (
    <section className="bg-subtle py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2 md:px-8">
        <div>
          <h2 className="mb-6 font-serif text-4xl text-ink">
            {ABOUT_STORY.title}
          </h2>
          {ABOUT_STORY.paragraphs.map((paragraph, idx) => (
            <p
              key={idx}
              className="mb-4 text-lg leading-relaxed text-ink-muted last:mb-0"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="flex h-80 items-center justify-center rounded-xl bg-surface shadow-[var(--shadow-editorial)]">
          <DraftingCompass
            className="size-36 text-border-strong"
            strokeWidth={0.75}
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
