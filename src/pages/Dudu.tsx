import { useMemo } from 'react';

export default function Dudu() {
  // Shuffle the collage once per load so the order varies between visits.
  const photos = useMemo(() => {
    const order = [
      '/dudu/dudu-1.png',
      '/dudu/dudu-2.png',
      '/dudu/dudu-3.png',
      '/dudu/dudu-4.png',
      '/dudu/dudu-5.png',
      '/dudu/dudu-6.png',
      '/dudu/dudu-7.webp',
    ];
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
        {photos.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`dudu photo ${i + 1}`}
            decoding="async"
            fetchPriority="low"
            className="mb-2 w-full rounded-lg"
          />
        ))}
      </div>
    </>
  );
}
