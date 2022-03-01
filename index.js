const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.get("/health", (req, res) => {
  res
    .status(200)
    .send({ success: true, message: "App is running.", payload: null });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
