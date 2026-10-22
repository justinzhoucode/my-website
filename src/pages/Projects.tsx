type Project = {
  name: string;
  description: string;
  href?: string;
};

const projects: Project[] = [
  // {
  //   name: 'clui',
  //   description:
  //     'an agentic workflow tool that converts any cli repo into a pretty gui for non-technical users',
  // },
  {
    name: 'scout',
    description:
      'an institutional knowledge company brain that attempts to answer any company-related questions (ai agent) by searching through slack, google workspace, and its own knowledge base',
  },
  {
    name: 'biquadris',
    href: 'https://github.com/justinzhoucode/biquadris',
    description:
      'cs246 final project which is multiplayer tetris with additional quirks',
  },
  {
    name: 'gritness',
    href: 'https://github.com/justinzhoucode/ICS4UE_Final_Gritness',
    description:
      'a comprehensive fitness app with a social media aspect built purely in java and swing',
  },
];

export default function Projects() {
  return (
    <div className="space-y-6">
      {projects.map((p) => (
        <div key={p.name}>
          <p className="text-fg">
            {p.href ? (
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="underline-offset-4 hover:underline"
              >
                {p.name}
              </a>
            ) : (
              p.name
            )}
            :
          </p>
          <p className="mt-1 pl-4 text-subtle">
            <span className="mr-1 text-muted">↳</span>
            {p.description}
          </p>
        </div>
      ))}
    </div>
  );
}
