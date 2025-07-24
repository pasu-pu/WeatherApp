const express = require("express");
const cors = require("cors");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCvCr2P_XFkMG4iVAIQTlUWGfXndN8ktUc";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/gemini", async (req, res) => {
  try {
    const { prompt } = req.body; // prompt MUSS ein String sein!
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => console.log("Proxy läuft auf Port 4000"));
