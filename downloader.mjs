import fs from "fs";
import http from "http";
import https from "https";
import { URL } from "url";
import path from "path";

function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

export default function downloadFile(sourceUrl, destinationPath) {
  return new Promise((resolve, reject) => {
    ensureDirectoryExists(destinationPath);
    const url = new URL(sourceUrl);
    const protocol = url.protocol === "https:" ? https : http;

    const request = protocol.get(sourceUrl, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(destinationPath);
        response.pipe(fileStream);
        fileStream.on("finish", () => {
          fileStream.close();
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        const redirectUrl = response.headers.location;
        downloadFile(redirectUrl, destinationPath).then(resolve).catch(reject);
      } else {
        reject(
          new Error(
            `Failed to download file: ${response.statusCode} ${response.statusMessage}`
          )
        );
      }
    });

    request.on("error", (error) => {
      reject(error);
    });
  });
}
