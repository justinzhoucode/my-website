import { hobbies } from '../data/hobbies.ts';

type HobbiesProps = {
  onOpen: (id: string, rect: DOMRect) => void;
};

export default function Hobbies({ onOpen }: HobbiesProps) {
  return (
    <>
      <p className="mb-4 text-subtle">click on the images for more info!</p>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {hobbies.map((hobby) => (
          <button
            key={hobby.id}
            type="button"
            onClick={(e) => onOpen(hobby.id, e.currentTarget.getBoundingClientRect())}
            aria-label={`open ${hobby.name}`}
            className="group cursor-pointer overflow-hidden rounded-lg"
          >
            <img
              src={hobby.images[0]}
              alt=""
              loading="lazy"
              draggable={false}
              className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>
    </>
  );
}
