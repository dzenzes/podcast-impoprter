import * as mm from "music-metadata";
import fs from "fs";
import downloadFile from "./downloader.mjs";
import createMarkdownFile from "./markdown-generator.mjs";
import parsePodcastFeed from "./podcast-parser.mjs";
import sanitizeTitle from "./sanitizer.mjs";

function getFilesizeInBytes(filename) {
  const stats = fs.statSync(filename);
  return stats.size;
}

async function processEpisode(item, options) {
  const { downloadFolder, overwrite, mdOnly, mp3Only } = options;

  const { title, content, enclosure, ...metadata } = item;
  const sanitizedTitle = sanitizeTitle(title);
  const mp3FileName = `${sanitizedTitle}.mp3`;
  const mp3FilePath = `${downloadFolder}/${sanitizedTitle}.mp3`;
  const mdFilePath = `${downloadFolder}/${sanitizedTitle}.md`;

  if (
    !mdOnly &&
    enclosure &&
    enclosure.url &&
    enclosure.type === "audio/mpeg"
  ) {
    if (overwrite || !fs.existsSync(mp3FilePath)) {
      console.log(`Downloading ${sanitizedTitle}.mp3...`);
      await downloadFile(enclosure.url, mp3FilePath);
      console.log(`Downloaded ${sanitizedTitle}.mp3.`);
    } else {
      console.log(`Skipping ${sanitizedTitle}.mp3 (file exists).`);
    }
  }

  if (!mp3Only) {
    if (overwrite || !fs.existsSync(mdFilePath)) {
      console.log(`Creating ${sanitizedTitle}.md...`);
      metadata.title = title;
      metadata.mp3 = mp3FileName;
      metadata.fileSize = getFilesizeInBytes(mp3FilePath);
      const { format } = await mm.parseFile(mp3FilePath);
      metadata.duration = format.duration;
      createMarkdownFile(metadata, item["content:encoded"], mdFilePath);
      console.log(`Created ${sanitizedTitle}.md.`);
    } else {
      console.log(`Skipping ${sanitizedTitle}.md (file exists).`);
    }
  }
}

async function processEpisodesInChunks(items, options, chunkSize = 5) {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const chunkPromises = chunk.map((item) => processEpisode(item, options));
    await Promise.all(chunkPromises);
  }
}

export default async function processPodcast(options) {
  const { feedUrl } = options;
  const feed = await parsePodcastFeed(feedUrl);

  await processEpisodesInChunks(feed.items, options);
}
