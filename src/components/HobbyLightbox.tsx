import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Carousel from './Carousel.tsx';
import type { Hobby } from '../data/hobbies.ts';

type HobbyLightboxProps = {
  hobby: Hobby | null;
  origin: { x: number; y: number };
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
  origin: { x: number; y: number };
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const pressedBackdrop = useRef(false);
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

  const dx = origin.x - window.innerWidth / 2;
  const dy = origin.y - window.innerHeight / 2;
  const hidden = { opacity: 0, scale: 0.2, x: dx, y: dy };

  return (
    <motion.div
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
      <motion.div
        initial={hidden}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        exit={hidden}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="grid w-[min(42rem,100%)] caret-transparent grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-1 sm:gap-x-3"
      >
        <div className="flex w-11 justify-center">
          {index > 0 && (
            <ArrowButton side="left" onClick={() => setIndex(index - 1)} />
          )}
        </div>

        <div>
          <Carousel
            activeIndex={index}
            count={count}
            onChange={setIndex}
            className="aspect-[4/3] w-full rounded-xl"
            scrollableSlides={false}
          >
            {hobby.images.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`${hobby.name} photo ${i + 1}`}
                draggable={false}
                className="h-full w-full rounded-xl object-cover select-none"
              />
            ))}
          </Carousel>
        </div>

        <div className="flex w-11 justify-center">
          {index < count - 1 && (
            <ArrowButton side="right" onClick={() => setIndex(index + 1)} />
          )}
        </div>

        {count > 1 && (
          <div className="col-start-2 mt-3 flex justify-center gap-1 select-none">
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

        <p className="col-start-2 mt-3 text-center text-lg leading-relaxed text-subtle">
          {hobby.caption}
        </p>
      </motion.div>
    </motion.div>
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
