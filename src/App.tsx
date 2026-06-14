import { lazy, Suspense, useState } from 'react';
import Panel from './components/Panel.tsx';
import Carousel from './components/Carousel.tsx';
import SocialLinks from './components/SocialLinks.tsx';
import About from './pages/About.tsx';
import Work from './pages/Work.tsx';
import Projects from './pages/Projects.tsx';
import Hobbies from './pages/Hobbies.tsx';
import Dudu from './pages/Dudu.tsx';

// Lazy-loaded so the heavy WebGL/three bundle doesn't block first paint.
const LiquidEther = lazy(() => import('./components/LiquidEther.tsx'));

const pages = [
  { id: 'about', label: 'about', Component: About },
  { id: 'work', label: 'work', Component: Work },
  { id: 'projects', label: 'projects', Component: Projects },
  { id: 'hobbies', label: 'hobbies', Component: Hobbies },
  { id: 'dudu', label: 'dudu', Component: Dudu },
] as const;

type PageId = (typeof pages)[number]['id'];

export default function App() {
  const [active, setActive] = useState<PageId>('about');
  const activeIndex = pages.findIndex((p) => p.id === active);

  return (
    <>
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
            {pages.map((page) => (
              <page.Component key={page.id} />
            ))}
          </Carousel>

          <SocialLinks />
        </Panel>
      </div>
    </>
  );
}
