import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, usePresence } from 'motion/react';
import Carousel from './Carousel.tsx';
import type { Hobby } from '../data/hobbies.ts';

type Origin = { x: number; y: number; width: number };

const ease = [0.22, 1, 0.36, 1] as const;

type HobbyLightboxProps = {
  hobby: Hobby | null;
  origin: Origin;
  onClose: () => void;
};

export default function HobbyLightbox({ hobby, origin, onClose }: HobbyLightboxProps) {
  return (
    <AnimatePresence>
      {hobby && (
        <Lightbox key={hobby.id} hobby={hobby} origin={origin} onClose={onClose} />
      )}
    </AnimatePresence>
  );
}

function Lightbox({
  hobby,
  origin,
  onClose,
}: {
  hobby: Hobby;
  origin: Origin;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const pressedBackdrop = useRef(false);
  const [isPresent, safeToRemove] = usePresence();
  const panelRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef({ x: 0, y: 0, scale: 0.3 });

  const revealEls = () =>
    Array.from(panelRef.current?.querySelectorAll<HTMLElement>('[data-reveal]') ?? []);

  useLayoutEffect(() => {
    const photo = photoRef.current;
    const bg = bgRef.current;
    if (!photo || !bg) return;
    const rect = photo.getBoundingClientRect();
    const from = {
      x: origin.x - (rect.left + rect.width / 2),
      y: origin.y - (rect.top + rect.height / 2),
      scale: origin.width && rect.width ? origin.width / rect.width : 0.3,
    };
    fromRef.current = from;
    animate(
      photo,
      { x: [from.x, 0], y: [from.y, 0], scale: [from.scale, 1], opacity: [0, 1] },
      { duration: 0.5, ease },
    );
    animate(bg, { opacity: [0, 1], scale: [0.96, 1] }, { duration: 0.35, delay: 0.35, ease });
    animate(revealEls(), { opacity: [0, 1], y: [8, 0] }, { duration: 0.35, delay: 0.45, ease });
  }, []);

  useEffect(() => {
    if (isPresent) return;
    const photo = photoRef.current;
    const bg = bgRef.current;
    if (!photo || !bg) {
      safeToRemove();
      return;
    }
    const from = fromRef.current;
    animate(revealEls(), { opacity: 0, y: 8 }, { duration: 0.18 });
    animate(bg, { opacity: 0, scale: 0.96 }, { duration: 0.22 });
    animate(
      photo,
      { x: from.x, y: from.y, scale: from.scale, opacity: 0 },
      { duration: 0.4, delay: 0.15, ease },
    ).then(() => safeToRemove());
  }, [isPresent]);
  const count = hobby.images.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, count - 1));
      else if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [count, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={hobby.name}
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      onPointerDown={(e) => {
        pressedBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (pressedBackdrop.current && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="relative isolate grid w-[min(46rem,100%)] caret-transparent grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-1 px-1 py-4 sm:gap-x-3 sm:px-3 sm:py-6"
      >
        <div
          ref={bgRef}
          style={{ opacity: 0 }}
          className="absolute inset-0 -z-10 rounded-2xl border border-line bg-card shadow-[var(--panel-shadow)]"
        />

        <div data-reveal style={{ opacity: 0 }} className="flex w-11 justify-center">
          {index > 0 && (
            <ArrowButton side="left" onClick={() => setIndex(index - 1)} />
          )}
        </div>

        <div ref={photoRef} style={{ opacity: 0 }}>
          <Carousel
            activeIndex={index}
            count={count}
            onChange={setIndex}
            className="aspect-[4/3] max-h-[60vh] w-full"
            scrollableSlides={false}
          >
            {hobby.images.map((src, i) => (
              <div key={src} className="flex h-full w-full items-center justify-center">
                <img
                  src={src}
                  alt={`${hobby.name} photo ${i + 1}`}
                  draggable={false}
                  className="max-h-full max-w-full rounded-xl select-none"
                />
              </div>
            ))}
          </Carousel>
        </div>

        <div data-reveal style={{ opacity: 0 }} className="flex w-11 justify-center">
          {index < count - 1 && (
            <ArrowButton side="right" onClick={() => setIndex(index + 1)} />
          )}
        </div>

        {count > 1 && (
          <div
            data-reveal
            style={{ opacity: 0 }}
            className="col-start-2 mt-3 flex justify-center gap-1 select-none"
          >
            {hobby.images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`photo ${i + 1}`}
                aria-current={i === index}
                className="cursor-pointer p-1.5"
              >
                <span
                  className={`block h-1.5 w-1.5 rounded-full transition ${
                    i === index ? 'bg-fg' : 'bg-fg/25'
                  }`}
                />
              </button>
            ))}
          </div>
        )}

        <p
          data-reveal
          style={{ opacity: 0 }}
          className="col-start-2 mx-auto mt-3 max-w-[34rem] text-center leading-relaxed text-pretty text-fg"
        >
          {hobby.caption}
        </p>
      </div>
    </div>
  );
}

function ArrowButton({
  side,
  onClick,
}: {
  side: 'left' | 'right';
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'previous photo' : 'next photo'}
      className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-muted transition duration-150 hover:scale-110 hover:text-fg"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d={side === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
      </svg>
    </button>
  );
}
