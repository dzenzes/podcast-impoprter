# Podcast Processor

This CLI tool helps you process podcast RSS feeds, download episode MP3 files, and generate Markdown files containing episode metadata and content.

## Features

- Download podcast episodes in MP3 format
- Generate Markdown files for each episode with front matter and content
- Customize download folder for MP3 and Markdown files
- Options to overwrite or skip already downloaded files
- Download MP3 or generate Markdown files only
- Help option to show information on available options

- ## Installation

Clone the repository:
```bash
git clone git@github.com:dzenzes/podcast-processor.git
```

Navigate to the project folder and install dependencies:
```bash
cd podcast-processor
pnpm install
```
## Usage

```bash
node index.mjs [options]
```

#### Options
`--feed-url <url>`: Required. The URL of the podcast RSS feed.
`--mp3-folder <folder>`: Optional. The folder where MP3 files will be downloaded. Defaults to ./mp3.
`--md-folder <folder>`: Optional. The folder where Markdown files will be generated. Defaults to ./markdown.
`--overwrite`: Optional. If set, existing files will be overwritten. By default, already downloaded files will be skipped.
`--no-mp3`: Optional. If set, MP3 files will not be downloaded.
`--no-md`: Optional. If set, Markdown files will not be generated.
`--help`: Optional. Shows help information on available options.

### Examples
Download MP3 files and generate Markdown files for a podcast feed:
```bash
node index.mjs --feed-url https://example.com/podcast/feed.xml
```
Download MP3 files only:
```bash
node index.mjs --feed-url https://example.com/podcast/feed.xml --no-md
```
Generate Markdown files only:
```bash
node index.mjs --feed-url https://example.com/podcast/feed.xml --no-mp3
```
Customize download folders:
```bash
node index.mjs --feed-url https://example.com/podcast/feed.xml --mp3-folder ./downloads/mp3 --md-folder ./downloads/markdown
```

