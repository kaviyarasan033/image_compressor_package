#!/usr/bin/env node
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const os = require("os");
const { compressToTarget } = require("../lib/compressor");

/**
 * Download image from a URL to a temporary local file
 * @param {string} url - direct image URL
 * @returns {Promise<string>} - path to downloaded temp file
 */
async function downloadImage(url) {
  const tmpPath = path.join(os.tmpdir(), "img_compress_temp_" + Date.now() + path.extname(url.split("?")[0]));
  const writer = fs.createWriteStream(tmpPath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(tmpPath));
    writer.on("error", reject);
  });
}

(async () => {
  const argv = yargs(hideBin(process.argv))
    .usage("Usage: node bin/cli.js <input> --target 300kb --out output.jpg")
    .demandCommand(1, "Please provide an image path or URL")
    .option("target", {
      alias: "t",
      type: "string",
      describe: "Target file size (e.g., 300kb, 1mb)",
      demandOption: true,
    })
    .option("out", {
      alias: "o",
      type: "string",
      describe: "Output file path (default: input_compressed.jpg)",
    })
    .help()
    .argv;

  let inputPath = argv._[0];
  let tempDownloaded = false;

  const isURL = /^https?:\/\//i.test(inputPath);
  if (isURL) {
    console.log("🌐 Downloading image from URL...");
    inputPath = await downloadImage(inputPath);
    tempDownloaded = true;
  } else {
    // Check local file exists
    if (!fs.existsSync(inputPath)) {
      console.error("❌ Input file not found:", inputPath);
      process.exit(1);
    }
  }

  const outputPath =
    argv.out ||
    path.join(
      path.dirname(inputPath),
      path.basename(inputPath, path.extname(inputPath)) + "_compressed" + path.extname(inputPath)
    );

  // ✅ Ensure output folder exists
  const outputFolder = path.dirname(outputPath);
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  console.log(`🧠 Compressing ${inputPath} to around ${argv.target}...`);
  try {
    const result = await compressToTarget(inputPath, outputPath, argv.target);
    console.log(`✅ Done! Final size: ${result.finalSizeKB} KB`);
    console.log(`📁 Saved to: ${outputPath}`);
  } catch (e) {
    console.error("❌ Compression failed:", e.message);
  } finally {
    // Clean up temp file if downloaded
    if (tempDownloaded && fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }
  }
})();
