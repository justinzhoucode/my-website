import { useMemo } from 'react';

export default function Dudu() {
  // Shuffle the collage once per load so the order varies between visits.
  const photos = useMemo(() => {
    const order = [1, 2, 3, 4, 5, 6];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }, []);

  return (
    <>
      <p className="mb-4 text-subtle">
        this is dudu, he has been with me for 11 years
      </p>
      <div className="columns-2 gap-2 sm:columns-3">
        {photos.map((n) => (
          <img
            key={n}
            src={`/dudu/dudu-${n}.png`}
            alt={`dudu photo ${n}`}
            loading="lazy"
            className="mb-2 w-full rounded-lg"
          />
        ))}
      </div>
    </>
  );
}
