import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

const CHANNEL_TOKEN = process.env.LINE_TOKEN;

// ⭐ あなたのスプレッドシート API URL
const VALUE_API_URL = "https://script.google.com/macros/s/AKfycbxgEAX77aCWfol1CpU_jebH7OyDiJ2s0Tm7z04vBIjBi5bzU_zQAskj_O56bIw7wB7D/exec";

app.post("/webhook", async (req, res) => {
  const event = req.body.events?.[0];
  if (!event || !event.message || !event.message.text) return res.sendStatus(200);

  const userText = event.message.text.trim();
  const replyToken = event.replyToken;

  try {
    // ⭐ 価値データを取得
    const { data } = await axios.get(VALUE_API_URL);

    // アイテム名を小文字で比較
    const item = data.find(
      (i) => i.item_name.toLowerCase() === userText.toLowerCase()
    );

    let replyText;

    if (item) {
      replyText = `${item.item_name} の現在の価値は ${item.value} です。`;
    } else {
      replyText = `「${userText}」は見つかりませんでした。\nアイテム名を正確に入力してね！`;
    }

    // ⭐ LINE に返信
    await axios.post(
      "https://api.line.me/v2/bot/message/reply",
      {
        replyToken,
        messages: [{ type: "text", text: replyText }]
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CHANNEL_TOKEN}`
        }
      }
    );

  } catch (err) {
    console.error("Error:", err);
  }

  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("LINE GTD Bot Running");
});

app.listen(10000, () => console.log("Server running"));
