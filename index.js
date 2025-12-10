import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

const CHANNEL_TOKEN = process.env.LINE_TOKEN;

app.post("/webhook", async (req, res) => {
  const event = req.body.events[0];
  const userText = event.message.text;

  const replyToken = event.replyToken;

  const replyText = `受け取った: ${userText}`;

  await axios.post(
    "https://api.line.me/v2/bot/message/reply",
    {
      replyToken: replyToken,
      messages: [{ type: "text", text: replyText }]
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CHANNEL_TOKEN}`
      }
    }
  );

  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("LINE GTD Bot Running");
});

app.listen(10000, () => console.log("Server running"));
