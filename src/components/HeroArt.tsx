import { HERO_FIGURES } from "./hero-figures";
import { InView } from "./InView";
import "./home/rewire-iso.css";
import "./hero-figures.css";

/** Server component: one precomputed isometric hero figure, shipped as markup. InView pauses its loop offscreen. */
export function HeroArt({ name }: { name: string }) {
  const svg = HERO_FIGURES[name];
  if (!svg) return null;
  return (
    <InView>
      <div className="rw-iso hf relative w-full" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />
    </InView>
  );
}
