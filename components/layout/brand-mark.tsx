import { cn } from "@/lib/utils";

/**
 * The Vouchley brand mark (blue gradient icon). Rendered from the optimized
 * /logo-mark.png. Pairs with the "Vouchley" wordmark in the nav, sidebar, and
 * footer.
 */
export function BrandMark({
  size = 30,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-mark.png"
      alt="Vouchley"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
    />
  );
}
