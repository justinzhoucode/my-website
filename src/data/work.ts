export type Job = {
  id: string;
  status: string;
  role: string;
  company: string;
  logo: string;
  href: string;
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
    href: 'https://axl.vc',
    dates: 'jan 2026 - aug 2026',
    detail: "building rapid AI mvp's",
  },
  {
    id: 'adsuite',
    status: 'was a:',
    role: 'software engineer intern',
    company: 'Ad Suite AI',
    logo: '/adsuiteai.png',
    href: 'https://adsuiteai.com',
    dates: 'may 2025 - aug 2025',
    detail: 'core features, research, and UX',
  },
  {
    id: 'olg',
    status: 'was a:',
    role: 'cyber and information security intern',
    company: 'OLG',
    logo: '/olg.png',
    href: 'https://www.olg.ca',
    dates: 'may 2024 - aug 2024',
    detail: 'risk monitoring and scripting',
  },
];
