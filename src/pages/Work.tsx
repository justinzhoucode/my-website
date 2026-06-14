type Role = {
  lead: string;
  role: string;
  company: string;
  href: string;
  logo: string;
  dates: string;
};

const roles: Role[] = [
  {
    lead: 'currently a:',
    role: 'software engineer intern at',
    company: 'AXL',
    href: 'https://axl.vc/',
    logo: '/axl.png',
    dates: 'jan 2026 - aug 2026',
  },
  {
    lead: 'was a:',
    role: 'software engineer intern at',
    company: 'Ad Suite AI',
    href: 'https://adsuiteai.com/',
    logo: '/adsuiteai.png',
    dates: 'may 2025 - aug 2025',
  },
  {
    lead: 'was a:',
    role: 'cyber and information security intern at',
    company: 'OLG',
    href: 'https://www.olg.ca/en/home.html',
    logo: '/olg.png',
    dates: 'may 2024 - aug 2024',
  },
];

export default function Work() {
  return (
    <div className="space-y-6">
      {roles.map((r) => (
        <div key={r.company}>
          <p className="text-fg">{r.lead}</p>
          <div className="mt-1 flex items-baseline justify-between gap-4 pl-4">
            <p className="text-fg">
              <span className="mr-1 text-muted">↳</span>
              {r.role}{' '}
              <a
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="font-medium whitespace-nowrap underline-offset-2 hover:underline"
              >
                <img
                  src={r.logo}
                  alt={`${r.company} logo`}
                  className="mr-1.5 inline-block h-5 w-5 rounded object-cover align-middle"
                />
                {r.company}
              </a>
            </p>
            <span className="shrink-0 font-mono text-sm text-muted">
              {r.dates}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
