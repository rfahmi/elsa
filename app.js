const express = require("express");
const bodyParser = require("body-parser");
const { sendMessage } = require("./controllers/telegram");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/", async (req, res) => {
  console.error("Project root called");
  res.send("E.L.S.A. at yout service");
});

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

app.listen(PORT, () => {
  console.error(`Server running on port ${PORT}`);
});
