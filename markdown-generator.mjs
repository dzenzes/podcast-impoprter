import fs from "fs";
import Turndown from "turndown";
import yaml from "js-yaml";

const turndownService = new Turndown();
const ignoredProperties = [
  "content:encoded",
  "pubDate",
  "content:encodedSnippet",
  "contentSnippet",
  "itunes",
  "link",
];

function createFrontMatter(metadata) {
  const frontMatter = Object.keys(metadata)
    .filter((key) => !ignoredProperties.includes(key))
    .reduce((accumulator, key) => {
      const newObj = { ...accumulator };

      if (key === "isoDate") {
        newObj.date = new Date(metadata[key]);
      } else {
        newObj[key] = metadata[key];
      }

      return newObj;
    }, {});

  Object.keys(metadata.itunes).forEach((key) => {
    frontMatter[key] = metadata.itunes[key];
  });

  // Rename 'keywords' to 'tags' and convert the comma-separated string to an array
  if (frontMatter.keywords) {
    frontMatter.tags = frontMatter.keywords.split(",").map((tag) => tag.trim());
    delete frontMatter.keywords;
  }

  return `---\n${yaml.dump(frontMatter)}---\n`;
}

export default function createMarkdownFile(metadata, content, filePath) {
  const frontMatter = createFrontMatter(metadata);
  const markdownContent = turndownService.turndown(content);
  const markdown = frontMatter + markdownContent;

  fs.writeFileSync(filePath, markdown);
}
