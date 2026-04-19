export const ABOUT_HERO = {
  title: "We build unsexy tools that serious people pay for.",
} as const;

export const ABOUT_STORY = {
  title: "The Story",
  paragraphs: [
    "We started Vouchley because we were tired of tools that promised the world and delivered bloated, brittle software. We wanted something solid. Something that felt like a ledger, not a toy.",
    "Our approach is simple: focus on the core problem, ignore the noise, and charge a fair price for a tool that just works. We aren't here to disrupt your workflow; we're here to anchor it.",
  ],
} as const;

export interface FounderProfile {
  name: string;
  role: string;
  bio: string;
  initials: string;
}

export const FOUNDER: FounderProfile = {
  name: "Rohit",
  role: "Founder · Engineering",
  bio: "Builds Vouchley solo from India. Previously shipped MailValid — the email-validity API that pays the rent while Vouchley earns its keep. Obsessed with boring infrastructure that just works.",
  initials: "R",
};

export type TenetIcon = "ship" | "boring" | "price";

export interface Tenet {
  icon: TenetIcon;
  title: string;
  body: string;
}

export const TENETS: Tenet[] = [
  {
    icon: "ship",
    title: "Ship things we'd use",
    body: "We don't build features for the sake of marketing. If it doesn't solve a real problem for us, it doesn't ship.",
  },
  {
    icon: "boring",
    title: "Boring tech",
    body: "Innovation should happen in the user experience, not the infrastructure. We rely on proven, stable technologies.",
  },
  {
    icon: "price",
    title: "Price fairly",
    body: "No dark patterns. No sudden price hikes. We charge what the tool is worth, and we aim to deliver ten times that value.",
  },
];
