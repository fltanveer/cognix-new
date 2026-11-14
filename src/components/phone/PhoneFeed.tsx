/**
 * The app on the phone screen: an operations feed built from real UI parts (cards, avatars, charts).
 * Illustrative only; people are generated avatars and figures are sample data.
 * Sizes are in em so the whole screen scales with the phone (see phone.css).
 */
const av = (n: number) => `/img/avatars/av-${n}.webp`;

function Avatar({ n, size = 2.6, online }: { n: number; size?: number; online?: boolean }) {
  return (
    <span className="pf-av" style={{ width: `${size}em`, height: `${size}em` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={av(n)} alt="" loading="lazy" />
      {online && <span className="pf-online" />}
    </span>
  );
}

// Irregular sample series, so the charts read as data, not decoration.
const runs = [38, 44, 41, 52, 49, 61, 58, 66, 63, 74, 71, 83, 79, 91];
function AreaChart() {
  const w = 100, h = 38, max = 96, min = 30;
  const pts = runs.map((v, i) => [(i / (runs.length - 1)) * w, h - ((v - min) / (max - min)) * h] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [ex, ey] = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h + 2}`} className="pf-chart" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="pf-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} className="pf-grid" />
      ))}
      <path d={`${line} L${w},${h + 2} L0,${h + 2} Z`} fill="url(#pf-fill)" />
      <path d={line} className="pf-line" />
      <circle cx={ex} cy={ey} r="1.6" className="pf-dot" />
    </svg>
  );
}

const week = [0.42, 0.55, 0.38, 0.7, 0.62, 0.86, 0.74];
const removed = [3, 5, 4, 7, 6, 9];

const face = (n: number) => `/img/faces/face-${n}.webp`;

/** Full-bleed portrait with a UI overlay; three variants so they read as different app moments. */
function FaceCard({ variant }: { variant: 1 | 2 | 3 }) {
  return (
    <div className={`pf-face pf-face--${variant}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={face(variant)} alt="" loading="lazy" />
      <span className="pf-face-shade" />
      {variant === 1 && (
        <>
          <div className="pf-face-top">
            <span className="pf-glass">
              <span className="pf-live" /> Online
            </span>
            <span className="pf-glass pf-glass--round">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
          <div className="pf-face-panel">
            <div className="pf-strong">Emily N.</div>
            <div className="pf-muted pf-small">Ops lead · Boston</div>
            <div className="pf-face-stats">
              <span>
                <b>31</b> tasks automated
              </span>
              <span>
                <b>6.5 h</b> saved
              </span>
            </div>
          </div>
        </>
      )}
      {variant === 2 && (
        <>
          <span className="pf-brackets" />
          <div className="pf-face-top">
            <span className="pf-glass pf-glass--lime">Adjuster verified</span>
          </div>
          <div className="pf-face-foot">
            <div className="pf-strong">Marcus O.</div>
            <div className="pf-muted pf-small">Claims adjuster</div>
            <span className="pf-pill-lime">Claim #4821 · report ready</span>
          </div>
        </>
      )}
      {variant === 3 && (
        <>
          <div className="pf-face-top pf-face-top--end">
            <span className="pf-glass">3 in review</span>
          </div>
          <div className="pf-face-foot">
            <div className="pf-strong">Elena V.</div>
            <div className="pf-muted pf-small">Finance lead · New York</div>
            <div className="pf-actions">
              <span className="pf-btn pf-btn--glass">Message</span>
              <span className="pf-btn pf-btn--lime">Assign</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Feed() {
  return (
    <div className="pf-feed">
      <div className="pf-hello">
        <Avatar n={1} size={2.8} />
        <div className="min-w-0 flex-1">
          <div className="pf-muted">Good morning,</div>
          <div className="pf-strong">Maya</div>
        </div>
        <span className="pf-icon-btn">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Zm4 9a2 2 0 0 0 4 0" />
          </svg>
          <span className="pf-badge" />
        </span>
      </div>

      <div className="pf-card pf-card--lime">
        <div className="pf-row">
          <span>Hours saved · this week</span>
          <span className="pf-chip-dark">+4.2 h</span>
        </div>
        <div className="pf-big">31.5 h</div>
        <div className="pf-bars">
          {week.map((v, i) => (
            <span key={i} style={{ height: `${v * 100}%` }} className={i === 5 ? "is-peak" : undefined} />
          ))}
        </div>
      </div>

      <div className="pf-card">
        <div className="pf-row">
          <span className="pf-muted">Automations run</span>
          <span className="pf-muted">14 days</span>
        </div>
        <div className="pf-row pf-row--base">
          <span className="pf-big pf-big--ink">1,284</span>
          <span className="pf-up">▲ 12.6%</span>
        </div>
        <AreaChart />
      </div>

      <FaceCard variant={1} />

      <div className="pf-card">
        <div className="pf-row pf-row--start">
          <Avatar n={3} />
          <div className="min-w-0 flex-1">
            <div>
              <span className="pf-strong">Sarah K.</span> <span className="pf-muted">flagged</span> invoice #2210
            </div>
            <div className="pf-muted pf-small">Amount differs from PO by $184.20 · 2m</div>
          </div>
        </div>
        <div className="pf-actions">
          <span className="pf-btn">Dismiss</span>
          <span className="pf-btn pf-btn--lime">Review</span>
        </div>
      </div>

      <div className="pf-card">
        <div className="pf-strong pf-mb">Today</div>
        <ul className="pf-tasks">
          <li>
            <span className="pf-check" />
            <span className="flex-1">Inbox triage</span>
            <span className="pf-muted">42 sorted</span>
          </li>
          <li>
            <span className="pf-ring" />
            <span className="flex-1">Invoice match</span>
            <span className="pf-warn">3 to review</span>
          </li>
          <li className="pf-task-progress">
            <span className="pf-spin" />
            <span className="flex-1">CRM sync</span>
            <span className="pf-muted">68%</span>
            <span className="pf-progress">
              <span style={{ width: "68%" }} />
            </span>
          </li>
        </ul>
      </div>

      <FaceCard variant={2} />

      <div className="pf-card pf-row">
        <div className="pf-stack">
          {[2, 4, 1, 3].map((n) => (
            <Avatar key={n} n={n} size={2.3} online={n !== 4} />
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div className="pf-strong">Ops team</div>
          <div className="pf-muted pf-small">3 online · 1 away</div>
        </div>
        <span className="pf-chip">Chat</span>
      </div>

      <div className="pf-card pf-row">
        <svg viewBox="0 0 36 36" className="pf-donut" aria-hidden="true">
          <circle cx="18" cy="18" r="15" className="pf-donut-track" />
          <circle cx="18" cy="18" r="15" className="pf-donut-val" strokeDasharray="64 100" pathLength={100} />
        </svg>
        <div className="min-w-0 flex-1">
          <div className="pf-muted pf-small">Workflow Assessment</div>
          <div className="pf-strong">Week 2 of 2 · 64%</div>
          <div className="pf-muted pf-small">Process map due Friday</div>
        </div>
      </div>

      <FaceCard variant={3} />

      <div className="pf-card">
        <div className="pf-row">
          <span className="pf-muted">Hand-offs removed</span>
          <span className="pf-strong">34</span>
        </div>
        <div className="pf-cols">
          {removed.map((v, i) => (
            <span key={i}>
              <span style={{ height: `${(v / 9) * 100}%` }} className={i === removed.length - 1 ? "is-peak" : undefined} />
              <em>W{i + 1}</em>
            </span>
          ))}
        </div>
      </div>

      <div className="pf-card pf-row pf-row--start">
        <Avatar n={2} />
        <div className="min-w-0 flex-1">
          <div>
            <span className="pf-strong">Daniel R.</span> <span className="pf-muted">approved</span> claim #4821
          </div>
          <div className="pf-muted pf-small">Report sent to the insurer · 9m</div>
        </div>
        <span className="pf-check pf-check--lg" />
      </div>
    </div>
  );
}

/** Status bar and tab bar stay put; the feed between them drifts up on a seamless loop. */
export function PhoneScreen() {
  return (
    <div className="pf">
      <div className="pf-status">
        <span>9:41</span>
        <span className="pf-status-icons" aria-hidden="true">
          <i />
          <i />
          <i />
          <b />
        </span>
      </div>
      <div className="pf-viewport">
        <div className="pf-track">
          <Feed />
          <Feed />
        </div>
      </div>
      <div className="pf-tabs" aria-hidden="true">
        {["M3 11l9-7 9 7v9H3z", "M4 19V9m6 10V5m6 14v-7m4 7V3", "M5 5h14v10H8l-3 3z", "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0"].map((d, i) => (
          <span key={i} className={i === 1 ? "is-on" : undefined}>
            <svg viewBox="0 0 24 24">
              <path d={d} />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
