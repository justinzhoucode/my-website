import { work } from '../data/work.ts';

type WorkProps = {
  onFocus: (id: string) => void;
  onUnfocus: () => void;
};

export default function Work({ onFocus, onUnfocus }: WorkProps) {
  return (
    <div className="flex flex-col items-start gap-6">
      {work.map((job) => (
        <div key={job.id} className="flex flex-col gap-1">
          <p className="text-fg">{job.status}</p>
          {/* Only this row is the hover target — kept to the tightest box around
              the line so it's easy to move between them. */}
          <p
            className="flex w-fit cursor-default items-baseline gap-6 pl-4 text-fg"
            onMouseEnter={() => onFocus(job.id)}
            onMouseLeave={onUnfocus}
          >
            <span>
              <span className="mr-1 text-muted">↳</span>
              {job.role} at{' '}
              <span className="font-medium whitespace-nowrap">
                <img
                  src={job.logo}
                  alt={`${job.company} logo`}
                  className="mr-1.5 inline-block h-5 w-5 rounded object-cover align-middle"
                />
                {job.company}
              </span>
            </span>
            <span className="shrink-0 font-mono text-sm text-muted">
              {job.dates}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}
