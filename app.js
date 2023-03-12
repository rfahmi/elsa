const express = require("express");
const bodyParser = require("body-parser");
const { sendMessage } = require("./controllers/telegram");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());

app.post("/bot", async (req, res) => {
  const { message } = req.body;

  if (message) {
    const {
      text,
      chat: { id },
    } = message;
    await sendMessage(text, id);
    res.status(200).send("OK");
  } else {
    res.status(400).send("Bad Request");
  }
});

app.listen(3000, () => {
  console.log("Server berjalan pada port 3000");
});
