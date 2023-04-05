import Parser from "rss-parser";

export default async function parsePodcastFeed(feedUrl) {
  const parser = new Parser();
  const feed = await parser.parseURL(feedUrl);
  return feed;
}
