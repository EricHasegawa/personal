type BlogPost = {
  title: string;
  description: string;
  link: string;
  fullUrl: string;
  pubDate: string;
  uid: string;
};

type SocialLink = {
  label: string;
  link: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    title: '10,000 Hours of Programming in the era of AI',
    description:
      "Opinions I've developed in writing lots of code over the past 3 or 4 years.",
    link: '/writing/10k-hours',
    fullUrl: 'https://rootfn.com/writing/10k-hours',
    pubDate: new Date('2025-07-04').toUTCString(),
    uid: '73aa6c72-7705-445a-a62a-e408b64e18c8',
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Github',
    link: 'https://github.com/erichasegawa',
  },
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/erichasegawa',
  },
  {
    label: 'Instagram',
    link: 'https://www.instagram.com/erichasegawa',
  },
];

export const EMAIL = 'erichasegawa1@gmail.com';

// testing codecov
