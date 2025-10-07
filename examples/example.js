const { compressToTarget } = require("../lib/compressor");

(async () => {
  const result = await compressToTarget("./images/test.jpg", "./images/test_small.jpg", "300kb");
  console.log(result);
})();
