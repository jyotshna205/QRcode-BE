const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multipart = require("connect-multiparty");
const fs = require("fs");
const path = require("path");

const qrReader = require("./utils/qrReader");
const generateUUID = require("./utils/generateUUID");

const UPLOAD_FOLDER = "uploads";
let scanData = [];

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

const multipartMiddleware = multipart({
  uploadDir: `./${UPLOAD_FOLDER}`,
});

if (!fs.existsSync(UPLOAD_FOLDER)) {
  fs.mkdirSync(UPLOAD_FOLDER);
}

app.get("/health", (req, res) => {
  res
    .status(200)
    .send({ success: true, message: "App is running.", payload: null });
});

app.get("/api/scans", (req, res) => {
  try {
    res.json({
      message: "Request processed successfully.",
      success: true,
      payload: scanData,
    });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error occured.", success: false, error: err });
  }
});

app.post("/api/upload", multipartMiddleware, async (req, res) => {
  try {
    const { originalFilename, path } = req.files.file;
    const fileData = await qrReader(path);
    const data = {
      id: generateUUID(),
      time: Date.now(),
      originalFilename,
    };
    scanData.push({ ...data, path, fileData });
    res.send({
      message: "File processed successfully.",
      success: true,
      payload: { ...data, fileData },
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error occured.", success: false, error });
  }
});

app.get("/api/qr-image", (req, res) => {
  try {
    const file = scanData.find((data) => data.id === req.query.id);
    if (!file) {
      return res
        .status(404)
        .send({ message: "File not found.", success: false, error: null });
    }
    res.sendFile(path.resolve(__dirname + "/" + file.path));
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error occured.", success: false, error: err });
  }
});

app.delete("/api/delete-scan", (req, res) => {
  try {
    scanData = scanData.filter((data) => data.id !== req.query.id);
    res.send({
      message: "Request processed successfully.",
      success: true,
      payload: null,
    });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error occured.", success: false, error: err });
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
