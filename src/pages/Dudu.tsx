const photos = [
  '/dudu/dudu-1.png',
  '/dudu/dudu-2.png',
  '/dudu/dudu-3.png',
  '/dudu/dudu-4.png',
  '/dudu/dudu-5.png',
  '/dudu/dudu-6.png',
  '/dudu/dudu-7.webp',
];

export default function Dudu() {
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
