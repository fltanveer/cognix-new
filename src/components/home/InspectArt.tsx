import { INSPECT_SVG } from "./inspect-figure";

/** Server component: the precomputed inspection-bay SVG ships as HTML only. InspectBay drives it. */
export function InspectArt() {
  return <div className="rw-iso ins-iso relative -my-2 w-full" data-ins="after" aria-hidden="true" dangerouslySetInnerHTML={{ __html: INSPECT_SVG }} />;
}
