const Jimp = require("jimp");
const fs = require("fs");
const qrCode = require("qrcode-reader");

const qrReader = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const buffer = fs.readFileSync(__dirname + "/../" + filePath);
      Jimp.read(buffer, function (err, image) {
        if (err) {
          return reject(err);
        }
        let qrcode = new qrCode();
        qrcode.callback = function (err, value) {
          if (err) {
            return reject(err);
          }
          resolve(value.result);
        };
        qrcode.decode(image.bitmap);
      });
    } catch (err) {
      return reject(err);
    }
  });
};

module.exports = qrReader;
