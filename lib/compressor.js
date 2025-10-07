const fs = require("fs").promises;
const sharp = require("sharp");

function parseSize(sizeStr) {
  if (typeof sizeStr === "number") return sizeStr;

  const s = String(sizeStr).trim().toLowerCase().replace(/\s+/g, "");
  const match = s.match(/^(\d+(?:\.\d+)?)(b|kb|mb)?$/);
  if (!match) throw new Error("Invalid size format. Use e.g. 300kb, 0.3mb, or 50000.");

  const value = parseFloat(match[1]);
  const unit = match[2] || "b";

  if (unit === "b") return Math.round(value);
  if (unit === "kb") return Math.round(value * 1024);
  if (unit === "mb") return Math.round(value * 1024 * 1024);

  return Math.round(value);
}

async function compressToTarget(inputPath, outputPath, targetSizeStr) {
  const targetBytes = parseSize(targetSizeStr);
  const inputBuffer = await fs.readFile(inputPath);
  let quality = 90;
  let buffer = inputBuffer;

  for (let i = 0; i < 10; i++) {
    const { data } = await sharp(buffer)
      .jpeg({ quality })
      .toBuffer({ resolveWithObject: true });

    if (data.length <= targetBytes || quality < 30) {
      await fs.writeFile(outputPath, data);
      return {
        success: true,
        finalSizeKB: (data.length / 1024).toFixed(2),
        quality,
      };
    }

    quality -= 10;
    buffer = data;
  }

  throw new Error(
    "Could not reach target size. Try a larger target or smaller image."
  );
}

module.exports = { compressToTarget };
