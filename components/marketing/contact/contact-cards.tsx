import { Mail, Newspaper, Shield, type LucideIcon } from "lucide-react";

import { CONTACT_METHODS, type ContactMethod } from "@/config/contact";

const ICONS: Record<ContactMethod["icon"], LucideIcon> = {
  mail: Mail,
  shield: Shield,
  newspaper: Newspaper,
};

export function ContactCards() {
  return (
    <div className="space-y-4">
      {CONTACT_METHODS.map((method) => {
        const Icon = ICONS[method.icon];
        return (
          <div
            key={method.email}
            className="rounded-xl bg-surface p-6 shadow-[var(--shadow-editorial)]"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-subtle p-2 text-brand">
                <Icon className="size-5" strokeWidth={1.75} aria-hidden />
              </div>
              <div>
                <h3 className="font-semibold text-ink">{method.title}</h3>
                <p className="mb-3 mt-1 text-sm text-ink-muted">
                  {method.description}
                </p>
                <a
                  href={`mailto:${method.email}`}
                  className="font-mono text-sm text-brand hover:underline"
                >
                  {method.email}
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
