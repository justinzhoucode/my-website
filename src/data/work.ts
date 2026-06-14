export type Job = {
  id: string;
  status: string;
  role: string;
  company: string;
  logo: string;
  dates: string;
  // Longer copy revealed in the focused hover card — edit freely.
  detail: string;
};

export const work: Job[] = [
  {
    id: 'axl',
    status: 'currently a:',
    role: 'software engineer intern',
    company: 'AXL',
    logo: '/axl.png',
    dates: 'jan 2026 - aug 2026',
    detail:
      'building full-stack features and internal tooling end to end — taking early ideas and turning them into shipped product.',
  },
  {
    id: 'adsuite',
    status: 'was a:',
    role: 'software engineer intern',
    company: 'Ad Suite AI',
    logo: '/adsuiteai.png',
    dates: 'may 2025 - aug 2025',
    detail:
      'worked across the stack on the ad platform — shipping features, fixing bugs, and helping get the product in front of real users.',
  },
  {
    id: 'olg',
    status: 'was a:',
    role: 'cyber and information security intern',
    company: 'OLG',
    logo: '/olg.png',
    dates: 'may 2024 - aug 2024',
    detail:
      'supported the security team on cyber and information security work — monitoring, tooling, and keeping systems safe.',
  },
];
