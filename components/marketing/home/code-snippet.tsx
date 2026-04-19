import { CodeBlock } from "@/components/ui/code-block";
import { HERO_CODE_SAMPLE, HERO_RESPONSE_SAMPLE } from "@/config/home";

export function HeroCodeSnippet() {
  return (
    <div className="relative z-10 mx-auto w-full max-w-lg lg:ml-auto">
      <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-brand/20 to-info/20 opacity-50 blur-lg" />
      <div className="relative space-y-4">
        <CodeBlock
          code={HERO_CODE_SAMPLE.code}
          lang={HERO_CODE_SAMPLE.language}
          filename={HERO_CODE_SAMPLE.filename}
          variant="terminal"
        />
        <div className="rounded-lg border border-border/40 bg-canvas p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-soft">
              Response JSON
            </span>
            <span className="rounded bg-accent-soft px-2 py-0.5 font-mono text-[10px] text-accent">
              {HERO_RESPONSE_SAMPLE.status}
            </span>
          </div>
          <CodeBlock
            code={HERO_RESPONSE_SAMPLE.body}
            lang="json"
            variant="inline"
            showCopy={false}
            className="border-0 bg-transparent p-0 [&>div]:p-0"
          />
        </div>
      </div>
    </div>
  );
}
