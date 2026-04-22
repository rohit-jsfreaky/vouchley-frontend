/**
 * Server component that emits a JSON-LD <script> tag.
 * Accepts any schema.org object and stringifies it safely.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
