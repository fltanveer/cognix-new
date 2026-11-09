import { REWIRE_SVG } from "./rewire-figure";

/**
 * Server component: the precomputed patch-bay SVG goes out as HTML only, never in the client bundle.
 * Rewire (client) finds it by class and drives its cords, bus and status lights.
 */
export function RewireArt() {
  return <div className="rw-iso relative -my-2 w-full" data-rw="after" aria-hidden="true" dangerouslySetInnerHTML={{ __html: REWIRE_SVG }} />;
}
