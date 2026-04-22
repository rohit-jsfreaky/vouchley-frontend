export interface ContactMethod {
  icon: "mail" | "shield" | "newspaper";
  title: string;
  description: string;
  email: string;
}

export const CONTACT_METHODS: ContactMethod[] = [
  {
    icon: "mail",
    title: "Editorial Support",
    description: "General inquiries, account help, and verification questions.",
    email: "hello@getrevlio.com",
  },
  {
    icon: "shield",
    title: "Security & Trust",
    description: "Report vulnerabilities or trust-related concerns.",
    email: "security@getrevlio.com",
  },
  {
    icon: "newspaper",
    title: "Press & Media",
    description: "Interviews, media kits, and announcements.",
    email: "press@getrevlio.com",
  },
];

export const CONTACT_HERO = {
  title: "Talk to us.",
  subtitle:
    "Our team is ready to help with verification questions, platform support, and press requests.",
} as const;

export type ContactTopic =
  | "general"
  | "billing"
  | "api"
  | "security"
  | "press"
  | "other";

export interface TopicOption {
  value: ContactTopic;
  label: string;
}

export const TOPIC_OPTIONS: TopicOption[] = [
  { value: "general", label: "General / Support" },
  { value: "billing", label: "Billing" },
  { value: "api", label: "API Integration" },
  { value: "security", label: "Security" },
  { value: "press", label: "Press" },
  { value: "other", label: "Other" },
];
