import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { animate, motion, useMotionValue, type PanInfo } from 'motion/react';

const spring = { type: 'spring', stiffness: 300, damping: 30 } as const;
const SLIDE_GAP = 48;

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

  const stride = slideWidth + SLIDE_GAP;

  const snapTo = (index: number) => animate(x, -index * stride, spring);

  // Follow external changes (tab clicks, swipes). A resize jumps straight to
  // the new offset rather than springing.
  const lastWidth = useRef(slideWidth);
  useEffect(() => {
    if (lastWidth.current !== slideWidth) {
      lastWidth.current = slideWidth;
      x.set(-activeIndex * stride);
      return;
    }
    const controls = snapTo(activeIndex);
    return () => controls.stop();
  }, [activeIndex, slideWidth]);

  // Always settle on a page: whichever one covers more of the viewport, or the
  // next one in the flick direction for a fast swipe. Snap explicitly, since if
  // the page doesn't change the effect above won't fire.
  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    if (!slideWidth) return;
    const position = -x.get() / stride;
    let target = Math.round(position);
    if (info.velocity.x < -500) target = Math.ceil(position);
    else if (info.velocity.x > 500) target = Math.floor(position);
    target = Math.max(0, Math.min(target, count - 1));
    snapTo(target);
    if (target !== activeIndex) onChange(target);
  };

  return (
    <div ref={viewportRef} className="relative mt-6 flex-1 overflow-hidden">
      <motion.div
        className="flex h-full cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: -stride * (count - 1), right: 0 }}
        dragElastic={0.08}
        // We own the release: no built-in momentum glide competing with the
        // snap, and a mostly-vertical gesture won't nudge the track sideways.
        dragMomentum={false}
        dragDirectionLock
        style={{ x, columnGap: SLIDE_GAP }}
        onDragEnd={handleDragEnd}
      >
        {/* Each slide is its own scroll container, so the browser checks its
            touch-action rather than the track's. pan-y lets touch scroll the
            slide vertically but hands horizontal swipes to the drag. */}
        {children.map((child, i) => (
          <Slide key={i} width={slideWidth}>
            {child}
          </Slide>
        ))}
      </motion.div>
    </div>
  );
}

function Slide({ width, children }: { width: number; children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState({ top: false, bottom: false });

  const update = () => {
    const el = scrollRef.current;
    if (!el) return;
    const top = el.scrollTop > 1;
    const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
    setFade((prev) =>
      prev.top === top && prev.bottom === bottom ? prev : { top, bottom },
    );
  };

  useLayoutEffect(() => {
    const ro = new ResizeObserver(update);
    if (scrollRef.current) ro.observe(scrollRef.current);
    if (contentRef.current) ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={scrollRef}
      onScroll={update}
      data-fade-top={fade.top || undefined}
      data-fade-bottom={fade.bottom || undefined}
      style={{ width: width || '100%' }}
      className="scroll-dark scroll-fade h-full shrink-0 touch-pan-y overflow-y-auto pr-2"
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
