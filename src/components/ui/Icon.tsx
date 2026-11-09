import { solar, type SolarName } from "./solar";

export function Icon({ name, size = 20, className, label }: { name: SolarName; size?: number; className?: string; label?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: solar[name] }}
    />
  );
}
