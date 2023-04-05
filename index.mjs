#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import processPodcast from "./src/podcast-manager.mjs";

const { argv } = yargs(hideBin(process.argv))
  .option("feed-url", {
    alias: "f",
    type: "string",
    description: "Podcast feed URL",
    demandOption: true,
  })
  .option("download-folder", {
    alias: "d",
    type: "string",
    description: "Download folder for MP3 and markdown files",
    default: "downloads",
  })
  .option("overwrite", {
    alias: "o",
    type: "boolean",
    description: "Overwrite existing MP3 and markdown files",
    default: false,
  })
  .option("md-only", {
    alias: "m",
    type: "boolean",
    description: "Generate markdown files only (skip MP3 downloads)",
    default: false,
  })
  .option("mp3-only", {
    alias: "p",
    type: "boolean",
    description: "Download MP3 files only (skip markdown generation)",
    default: false,
  })
  .help()
  .alias("help", "h");

processPodcast(argv);
