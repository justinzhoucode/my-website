import { lazy, Suspense, useRef, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import Panel from './components/Panel.tsx';
import Carousel from './components/Carousel.tsx';
import SocialLinks from './components/SocialLinks.tsx';
import About from './pages/About.tsx';
import Work from './pages/Work.tsx';
import Projects from './pages/Projects.tsx';
import Hobbies from './pages/Hobbies.tsx';
import Dudu from './pages/Dudu.tsx';
import { work } from './data/work.ts';

// Lazy-loaded so the heavy WebGL/three bundle doesn't block first paint.
const LiquidEther = lazy(() => import('./components/LiquidEther.tsx'));

const pages = [
  { id: 'about', label: 'about' },
  { id: 'work', label: 'work' },
  { id: 'projects', label: 'projects' },
  { id: 'hobbies', label: 'hobbies' },
  { id: 'dudu', label: 'dudu' },
] as const;

type PageId = (typeof pages)[number]['id'];

export default function App() {
  const [active, setActive] = useState<PageId>('about');
  const activeIndex = pages.findIndex((p) => p.id === active);

  // Work "focus" hover. `focusedId` controls visibility (the full-page blur +
  // overlay), `cardId` holds which entry to render — it lingers through the
  // fade-out so the card doesn't blank out. `origin` is the screen-space center
  // of the hovered logo/name, so the card can grow out of (and shrink back
  // into) exactly where the cursor is rather than popping in at the center.
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [cardId, setCardId] = useState<string | null>(null);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const leaveTimer = useRef<number | null>(null);

  const focusJob = (id: string, rect: DOMRect) => {
    if (leaveTimer.current !== null) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setCardId(id);
    setFocusedId(id);
  };

  const unfocusJob = () => {
    leaveTimer.current = window.setTimeout(() => setFocusedId(null), 70);
  };

  // Hovering the card itself cancels a pending close, so the overlay only
  // dismisses once the cursor leaves the card's bounding box entirely.
  const cancelUnfocus = () => {
    if (leaveTimer.current !== null) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };

  const focusedJob = work.find((job) => job.id === cardId) ?? null;

  // Keep the card on screen: clamp its center so a logo near an edge doesn't
  // push the expanded card off-view.
  const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
  const cardX = Math.min(Math.max(origin.x, 200), Math.max(vw - 200, 200));
  const cardY = Math.min(Math.max(origin.y, 180), Math.max(vh - 180, 180));

  const slidesById: Record<PageId, ReactNode> = {
    about: <About />,
    work: <Work onFocus={focusJob} onUnfocus={unfocusJob} />,
    projects: <Projects />,
    hobbies: <Hobbies />,
    dudu: <Dudu />,
  };

  return (
    <>
      {/* The whole page lives in here so it can blur + dim as one unit when a
          work entry is focused. We use a real `filter` (not backdrop-filter)
          because backdrop-filter flashes white over the WebGL canvas + the
          Panel's own blur. The focused card below is a sibling, so it stays
          crisp on top. */}
      <div
        className={`transition-[filter] duration-700 ease-out motion-reduce:transition-none ${
          focusedId ? 'blur-[6px] brightness-[0.5]' : ''
        }`}
      >
        {/* Decorative background only — no interaction. */}
        <div className="fixed inset-0 -z-10 h-full w-full" aria-hidden="true">
          <Suspense fallback={null}>
            <LiquidEther
              colors={['#3a3a3a', '#6e6e6e', '#a0a0a0']}
              autoDemo
              autoSpeed={0.5}
              autoIntensity={2.2}
              // Perf: it's a soft decorative background, so trade fidelity for a
              // much lighter GPU load (cooler/quieter fans).
              maxFps={30}
              maxPixelRatio={1}
              resolution={0.4}
              iterationsPoisson={16}
              iterationsViscous={16}
            />
          </Suspense>
        </div>

        {/* Centered card + a links row beneath it. */}
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 sm:p-6">
          <Panel className="animate-fade-up flex h-[min(86vh,640px)] w-[min(94vw,720px)] flex-col motion-reduce:animate-none">
            {/* In-card navigation between pages. */}
            <nav className="flex gap-3 pb-4">
              {pages.map((page) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setActive(page.id)}
                  className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm transition duration-150 select-none hover:scale-110 ${
                    active === page.id
                      ? 'bg-white/10 text-fg'
                      : 'text-muted hover:bg-white/5 hover:text-fg'
                  }`}
                >
                  {page.label}
                </button>
              ))}
            </nav>

            <Carousel
              activeIndex={activeIndex}
              count={pages.length}
              onChange={(i) => setActive(pages[i].id)}
            >
              {pages.map((page) => slidesById[page.id])}
            </Carousel>

            <SocialLinks />
          </Panel>
        </div>
      </div>

      {/* Floating focused card — sits crisp above the blurred page. It's
          anchored to the hovered logo's position (clamped to stay on screen) and
          scales out from there, so it reads as the small row growing into the
          card rather than a card appearing at the center. */}
      <div aria-hidden={!focusedId} className="pointer-events-none fixed inset-0 z-40">
        <div
          className="absolute w-[min(22rem,90vw)] -translate-x-1/2 -translate-y-1/2"
          style={{ left: cardX, top: cardY }}
        >
          <motion.div
            key={cardId ?? 'empty'}
            initial={{ scale: 0.18, opacity: 0 }}
            animate={
              focusedId
                ? { scale: 1, opacity: 1 }
                : { scale: 0.18, opacity: 0 }
            }
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              transformOrigin: 'center',
              pointerEvents: focusedId ? 'auto' : 'none',
            }}
            onMouseEnter={cancelUnfocus}
            onMouseLeave={unfocusJob}
            className="flex flex-col items-center text-center"
          >
            {focusedJob && (
              <>
                {/* Only the logo + company name is the link. */}
                <a
                  href={focusedJob.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col items-center text-center"
                >
                  <img
                    src={focusedJob.logo}
                    alt={`${focusedJob.company} logo`}
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                  <p className="mt-5 text-3xl font-semibold tracking-[-0.02em] text-fg group-hover:underline group-hover:underline-offset-4">
                    {focusedJob.company}
                  </p>
                </a>
                <p className="mt-1 text-xl text-muted">{focusedJob.role}</p>
                <p className="mt-5 text-lg leading-relaxed text-subtle">
                  {focusedJob.detail}
                </p>
                <p className="mt-5 font-mono text-sm text-muted">
                  {focusedJob.dates}
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
