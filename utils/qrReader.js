const Jimp = require("jimp");
const fs = require("fs");
const qrCode = require("qrcode-reader");

const qrReader = async (filePath) => {
  const img = await jimp.read(fs.readFileSync(__dirname + "/../" + filePath));
  const qr = new qrCode();
  const value = await new Promise((resolve, reject) => {
    qr.callback = (err, v) => (err != null ? reject(err) : resolve(v));
    qr.decode(img.bitmap);
  });
  return value;
};

module.exports = qrReader;
