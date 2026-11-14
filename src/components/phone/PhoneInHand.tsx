import Image from "next/image";
import { InView } from "@/components/InView";
import { PhoneScreen } from "./PhoneFeed";
import { HAND_SCREEN as S } from "./hand-screen";
import "./phone.css";

const check = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 12.5l4 4 8-9" />
  </svg>
);

/**
 * Cards drifting behind the phone and fingers: the jobs the site talks about (inspection reports,
 * invoice matching, CRM sync). Outer element floats on a loop, inner card owns its entrance,
 * so the two animations never fight over one transform.
 */
function Floats() {
  return (
    <>
      <div className="pih-fl pih-fl--pill">
        <div className="pih-flc pih-flc--pill">
          <span className="pih-live" /> Automation live
        </div>
      </div>
      <div className="pih-fl pih-fl--report">
        <div className="pih-flc">
          <span className="pih-ico pih-ico--lime">{check}</span>
          <span>
            <b>Inspection report</b>
            <em>Ready in 1 min 47 s</em>
          </span>
        </div>
      </div>
      <div className="pih-fl pih-fl--crm">
        <div className="pih-flc">
          <span className="pih-flow">
            <span className="pih-ico">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h16v12H4zM4 8l8 5 8-5" />
              </svg>
            </span>
            <i />
            <span className="pih-ico pih-ico--lime">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" />
              </svg>
            </span>
          </span>
          <span>
            <b>Web form → CRM</b>
            <em>Lead synced</em>
          </span>
        </div>
      </div>
      <div className="pih-fl pih-fl--invoice">
        <div className="pih-flc">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/avatars/av-3.webp" alt="" className="pih-flav" loading="lazy" />
          <span>
            <b>Invoice #2210 matched</b>
            <em>To PO 7741 · just now</em>
          </span>
        </div>
      </div>
    </>
  );
}

/**
 * A silhouetted hand holding a phone, with a live app feed scrolling on the screen and a soft
 * lime glow behind. Layers, back to front: glow → floating cards → screen UI (seen through the keyed screen) → hand.
 * The hand photo is generated and keyed by scripts/key-hand.mjs, which also measures the screen.
 */
export function PhoneInHand({ className = "" }: { className?: string }) {
  const screen = {
    left: `${S.left}%`,
    top: `${S.top}%`,
    width: `${S.width}%`,
    height: `${S.height}%`,
    // radius is a % of the screen width; cqw keeps it exact at any size.
    borderRadius: `${(S.width * S.radius) / 100}cqw`,
  };
  const rim = {
    left: `calc(${S.left}% - 1.9cqw)`,
    top: `calc(${S.top}% - 1.9cqw)`,
    width: `calc(${S.width}% + 3.8cqw)`,
    height: `calc(${S.height}% + 3.8cqw)`,
    borderRadius: `${(S.width * S.radius) / 100 + 1.9}cqw`,
  };

  return (
    <InView>
      <div className={`pih ${className}`} aria-hidden="true">
        <div className="pih-glow" />
        <div className="pih-stage" style={{ aspectRatio: S.aspect }}>
          <Floats />
          <div className="pih-screen" style={screen}>
            <PhoneScreen />
            <div className="pih-glare" />
          </div>
          <Image src="/img/hand/hand-phone.webp" alt="" fill sizes="(min-width: 1024px) 760px, 90vw" className="pih-hand" />
          <div className="pih-rim" style={rim} />
        </div>
      </div>
    </InView>
  );
}
