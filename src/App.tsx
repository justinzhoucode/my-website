import { useMemo, useRef, useState } from 'react';
import Iridescence from './components/Iridescence.tsx';
import Panel from './components/Panel.tsx';

// Pages shown inside the card. Add/rename freely — content is yours to fill in.
const pages = [
  { id: 'about', label: 'about' },
  { id: 'work', label: 'work' },
  { id: 'projects', label: 'projects' },
  { id: 'hobbies', label: 'hobbies' },
  { id: 'dudu', label: 'dudu' },
] as const;

type PageId = (typeof pages)[number]['id'];

const backgroundColor: [number, number, number] = [0.24, 0.24, 0.24];

// Work history. `detail` is the longer copy revealed on hover — edit freely.
const work = [
  {
    id: 'axl',
    status: 'currently a:',
    role: 'software engineer intern',
    company: 'AXL',
    logo: '/axl.png',
    dates: 'jan 2026 - aug 2026',
    detail:
      'building full-stack features and internal tooling end to end — taking early ideas and turning them into shipped product.',
  },
  {
    id: 'adsuite',
    status: 'was a:',
    role: 'software engineer intern',
    company: 'Ad Suite AI',
    logo: '/adsuiteai.png',
    dates: 'may 2025 - aug 2025',
    detail:
      'worked across the stack on the ad platform — shipping features, fixing bugs, and helping get the product in front of real users.',
  },
  {
    id: 'olg',
    status: 'was a:',
    role: 'cyber and information security intern',
    company: 'OLG',
    logo: '/olg.png',
    dates: 'may 2024 - aug 2024',
    detail:
      'supported the security team on cyber and information security work — monitoring, tooling, and keeping systems safe.',
  },
] as const;

export default function App() {
  const [active, setActive] = useState<PageId>('about');

  // Work "focus" hover. `focusedId` controls visibility (the full-page blur +
  // overlay), `cardId` holds which entry to render — it lingers through the
  // fade-out so the card doesn't blank out. A short leave delay means moving
  // between entries never flickers back to the un-focused state.
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [cardId, setCardId] = useState<string | null>(null);
  const leaveTimer = useRef<number | null>(null);

  const focusJob = (id: string) => {
    if (leaveTimer.current !== null) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setCardId(id);
    setFocusedId(id);
  };

  const unfocusJob = () => {
    leaveTimer.current = window.setTimeout(() => setFocusedId(null), 70);
  };

  const focusedJob = work.find((job) => job.id === cardId) ?? null;

  // Shuffle the collage once per load so the order varies between visits.
  const duduPhotos = useMemo(() => {
    const order = [1, 2, 3, 4, 5, 6];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }, []);

  return (
    <>
      {/* The whole page lives in here so it can blur + dim as one unit when an
          entry is focused. We use a real `filter` (not backdrop-filter) because
          backdrop-filter flashes white over the WebGL canvas + the Panel's own
          blur. The focused card below is a sibling, so it stays crisp on top. */}
      <div
        className={`transition-[filter] duration-200 ease-out motion-reduce:transition-none ${
          focusedId ? 'blur-[6px] brightness-[0.5]' : ''
        }`}
      >
        {/* Decorative background only — no interaction. */}
        <div className="fixed inset-0 -z-10 h-full w-full" aria-hidden="true">
          <Iridescence color={backgroundColor} speed={0.6} amplitude={0.1} />
        </div>

        {/* Centered card + a links row beneath it. */}
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 sm:p-6">
        <Panel className="animate-fade-up flex h-[min(86vh,640px)] w-[min(94vw,720px)] flex-col motion-reduce:animate-none">
          {/* In-card navigation between pages. */}
          <nav className="flex gap-1 pb-4">
            {pages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => setActive(page.id)}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm transition-colors select-none ${
                  active === page.id
                    ? 'bg-white/10 text-fg'
                    : 'text-muted hover:bg-white/5 hover:text-fg'
                }`}
              >
                {page.label}
              </button>
            ))}
          </nav>

          {/* Scrollable content area — keying on `active` replays the fade per page. */}
          <div
            key={active}
            className="scroll-dark animate-fade-up mt-6 flex-1 overflow-y-auto pr-1 motion-reduce:animate-none"
          >
            {active === 'about' && (
              <>
                <h1 className="text-3xl font-semibold tracking-[-0.02em]">
                  justin zhou
                </h1>
                <p className="mt-6 text-subtle">
                  working towards a bachelor of mathematics, majoring in
                  combinatorics &amp; optimization with a computing minor, at{' '}
                  <span className="whitespace-nowrap">
                    <img
                      src="/uwaterloo-seal.png"
                      alt="University of Waterloo seal"
                      className="mr-1.5 inline-block h-5 w-5 object-contain align-middle"
                    />
                    university of waterloo
                  </span>
                </p>
                <p className="mt-4 text-subtle">
                  {/* write your about copy here */}
                </p>
              </>
            )}

            {active === 'work' && (
              <div className="flex flex-col items-start gap-6">
                {work.map((job) => (
                  <div key={job.id} className="flex flex-col gap-1">
                    <p className="text-fg">{job.status}</p>
                    {/* Only this row is the hover target — kept to the tightest
                        box around the line so it's easy to move between them. */}
                    <p
                      className="flex w-fit cursor-default items-baseline gap-6 pl-4 text-fg"
                      onMouseEnter={() => focusJob(job.id)}
                      onMouseLeave={unfocusJob}
                    >
                      <span>
                        <span className="mr-1 text-muted">↳</span>
                        {job.role} at{' '}
                        <span className="font-medium whitespace-nowrap">
                          <img
                            src={job.logo}
                            alt={`${job.company} logo`}
                            className="mr-1.5 inline-block h-5 w-5 rounded object-cover align-middle"
                          />
                          {job.company}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-sm text-muted">
                        {job.dates}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}

            {active === 'projects' && (
              <div className="space-y-6">
                <div>
                  <p className="text-fg">clui:</p>
                  <p className="mt-1 pl-4 text-subtle">
                    <span className="mr-1 text-muted">↳</span>
                    an agentic workflow tool that converts any cli repo into a
                    pretty gui for non-technical users
                  </p>
                </div>

                <div>
                  <p className="text-fg">scout:</p>
                  <p className="mt-1 pl-4 text-subtle">
                    <span className="mr-1 text-muted">↳</span>
                    an institutional knowledge company brain that attempts to
                    answer any company-related questions (ai agent) by searching
                    through slack, google workspace, and its own knowledge base
                  </p>
                </div>

                <div>
                  <p className="text-fg">biquadris:</p>
                  <p className="mt-1 pl-4 text-subtle">
                    <span className="mr-1 text-muted">↳</span>
                    cs246 final project which is multiplayer tetris with
                    additional quirks
                  </p>
                </div>

                <div>
                  <p className="text-fg">gritness:</p>
                  <p className="mt-1 pl-4 text-subtle">
                    <span className="mr-1 text-muted">↳</span>
                    a comprehensive fitness app with a social media aspect built
                    purely in java and swing
                  </p>
                </div>
              </div>
            )}

            {active === 'hobbies' && (
              <p className="text-subtle">{/* hobbies content here */}</p>
            )}

            {active === 'dudu' && (
              <div className="columns-2 gap-2 sm:columns-3">
                {duduPhotos.map((n) => (
                  <img
                    key={n}
                    src={`/dudu/dudu-${n}.png`}
                    alt={`dudu photo ${n}`}
                    loading="lazy"
                    className="mb-2 w-full rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Persistent links row — shown on every page. */}
          <div className="mt-4 flex items-center gap-4 text-muted">
            <a
              href="https://github.com/justinzhoucode"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="transition-colors hover:text-fg"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.51 11.51 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/justinmengzhou/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="transition-colors hover:text-fg"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
            </a>
            <a
              href="mailto:justinmengzhou@gmail.com"
              aria-label="Email"
              className="transition-colors hover:text-fg"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
              </svg>
            </a>
            </div>
          </Panel>
        </div>
      </div>

      {/* Floating focused card — sits crisp above the blurred page, centered on
          screen. Its own entity: doesn't touch the page layout. */}
      <div
        aria-hidden={!focusedId}
        className={`pointer-events-none fixed inset-0 z-40 flex transform-gpu items-center justify-center p-6 transition-[opacity,transform] duration-200 ease-out ${
          focusedId ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {focusedJob && (
          <div className="flex max-w-sm flex-col items-center text-center">
            <img
              src={focusedJob.logo}
              alt={`${focusedJob.company} logo`}
              className="h-20 w-20 rounded-2xl object-cover"
            />
            <p className="mt-5 text-3xl font-semibold tracking-[-0.02em] text-fg">
              {focusedJob.company}
            </p>
            <p className="mt-1 text-xl text-muted">{focusedJob.role}</p>
            <p className="mt-5 text-lg leading-relaxed text-subtle">
              {focusedJob.detail}
            </p>
            <p className="mt-5 font-mono text-sm text-muted">
              {focusedJob.dates}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
