const Jimp = require("jimp");
const fs = require("fs");
const jsQR = require("jsqr");

const qrReader = (filePath) => {
  return new Promise(async (resolve, reject) => {
    await Jimp.read(
      await fs.readFileSync(__dirname + "/../" + filePath),
      (err, image) => {
        if (err) reject(err);
        const qrCodeImageArray = new Uint8ClampedArray(
          image.bitmap.data.buffer
        );
        const qrCodeResult = jsQR(
          qrCodeImageArray,
          image.bitmap.width,
          image.bitmap.height
        );
        if (qrCodeResult) {
          resolve(qrCodeResult.data);
        } else {
          reject(new Error("Invalid QR code."));
        }
      }
    );
  });
};

module.exports = qrReader;
