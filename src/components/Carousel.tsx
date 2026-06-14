import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValue, type PanInfo } from 'motion/react';

type CarouselProps = {
  activeIndex: number;
  count: number;
  onChange: (index: number) => void;
  children: ReactNode[];
};

// Horizontal swipeable track. Each child is one full-width slide that scrolls
// vertically on its own. Drag, plus external controls via activeIndex/onChange,
// all stay in sync.
export default function Carousel({
  activeIndex,
  count,
  onChange,
  children,
}: CarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const x = useMotionValue(0);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setSlideWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const goTo = (index: number) =>
    onChange(Math.max(0, Math.min(index, count - 1)));

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    const threshold = slideWidth * 0.2;
    if (info.offset.x < -threshold || info.velocity.x < -500) {
      goTo(activeIndex + 1);
    } else if (info.offset.x > threshold || info.velocity.x > 500) {
      goTo(activeIndex - 1);
    }
  };

  return (
    <div ref={viewportRef} className="relative mt-6 flex-1 overflow-hidden">
      <motion.div
        className="flex h-full cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: -slideWidth * (count - 1), right: 0 }}
        dragElastic={0.08}
        style={{ x }}
        animate={{ x: -activeIndex * slideWidth }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onDragEnd={handleDragEnd}
      >
        {children.map((child, i) => (
          <div
            key={i}
            style={{ width: slideWidth || '100%' }}
            className="scroll-dark h-full shrink-0 overflow-y-auto pr-2"
          >
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
