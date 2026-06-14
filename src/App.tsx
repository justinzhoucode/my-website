import { lazy, Suspense, useRef, useState, type ReactNode } from 'react';
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
        className={`transition-[filter] duration-200 ease-out motion-reduce:transition-none ${
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
            />
          </Suspense>
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
