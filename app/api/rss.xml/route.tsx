import { NextResponse } from 'next/server';
import { BLOG_POSTS } from '@/app/data';

const buildRSSFeed = () => {
  const rssItems = BLOG_POSTS.map(
    ({ title, fullUrl, description, pubDate, uid }) => `
    <item>
      <title>${title}</title>
      <link>${fullUrl}</link>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <guid>${uid}</guid>
    </item>`,
  ).join('');

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Root Fn</title>
    <link>https://rootfn.com</link>
    <description>Latest articles</description>
    ${rssItems}
  </channel>
</rss>`;
};

export async function GET() {
  const rssFeed = buildRSSFeed();
  return new NextResponse(rssFeed, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
}
