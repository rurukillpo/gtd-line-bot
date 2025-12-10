import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

// Render の環境変数に設定した LINE_TOKEN を使う
const CHANNEL_TOKEN = process.env.LINE_TOKEN;

// LINE からの Webhook を受け取るエンドポイント
app.post("/callback", async (req, res) => {
  try {
    const event = req.body.events[0];

    // メッセージ以外（フォローなど）は無視
    if (!event || !event.message || !event.message.text) {
      return res.sendStatus(200);
    }

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
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// 動作確認用
app.get("/", (req, res) => {
  res.send("LINE GTD Bot Running");
});

// Render 用のポート設定
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
