const photos = [
  '/miffy/img_6911.webp',
  '/miffy/img_6164.webp',
  '/miffy/img_6467.webp',
  '/miffy/img_6474.webp',
  '/miffy/img_3753.webp',
  '/miffy/img_7835.webp',
  '/miffy/img_7216.webp',
  '/miffy/img_6891.webp',
  '/miffy/img_6853.webp',
  '/miffy/img_8721.webp',
];

export default function Miffy() {
  return (
    <>
      <p className="mb-4 text-subtle">this is miffy</p>
      <div className="columns-2 gap-2 sm:columns-3">
        {photos.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`miffy photo ${i + 1}`}
            decoding="async"
            fetchPriority="low"
            className="mb-2 w-full rounded-lg"
          />
        ))}
      </div>
    </>
  );
}
