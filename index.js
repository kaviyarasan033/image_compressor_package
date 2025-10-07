

const { compressToTarget } = require("./lib/compressor");

/**

 * test
 * @param {string} inputPath - Path to input image file (jpg/png/webp)
 * @param {string} outputPath - Path where compressed image will be saved
 * @param {string|number} targetSize - e.g. "300kb", "1mb", or bytes number
 * @returns {Promise<object>} - compression result info
 * 
 * Example:
 *  const { compressToTarget } = require("image-compressor-target");
 *  await compressToTarget("photo.jpg", "photo_small.jpg", "300kb");
 */
module.exports = { compressToTarget };

// If executed directly (like `node index.js`), show quick usage help
if (require.main === module) {
  console.log(`
🖼️  Image Compressor CLI
=============================
Usage:
  node index.js <input> --target 300kb --out output.jpg

Or after linking:
  img-compress ./photo.jpg --target 300kb --out photo_small.jpg

You can also import in JS:
  const { compressToTarget } = require('image-compressor-target');
  await compressToTarget('photo.jpg', 'photo_small.jpg', '300kb');
`);
}
