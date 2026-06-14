import { work } from '../data/work.ts';

type WorkProps = {
  onFocus: (id: string, rect: DOMRect) => void;
  onUnfocus: () => void;
};

export default function Work({ onFocus, onUnfocus }: WorkProps) {
  return (
    <div className="flex flex-col items-start gap-6">
      {work.map((job) => (
        <div key={job.id} className="flex flex-col gap-1">
          <p className="text-fg">{job.status}</p>
          <p className="flex w-fit items-baseline gap-6 pl-4 text-fg">
            <span>
              <span className="mr-1 text-muted">↳</span>
              {job.role} at{' '}
              {/* Only the logo + company name is the hover target. */}
              <span
                className="cursor-default font-medium whitespace-nowrap"
                onMouseEnter={(e) =>
                  onFocus(job.id, e.currentTarget.getBoundingClientRect())
                }
                onMouseLeave={onUnfocus}
              >
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
