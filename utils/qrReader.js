const Jimp = require("jimp");
const jsQR = require("jsqr");

const qrReader = (imageBuffer) => {
  return new Promise(async (resolve, reject) => {
    await Jimp.read(await imageBuffer, (err, image) => {
      if (err) reject(err);
      const qrCodeImageArray = new Uint8ClampedArray(image.bitmap.data.buffer);
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
    });
  });
};

module.exports = qrReader;
