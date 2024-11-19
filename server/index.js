const express = require("express");
const cors = require("cors");
const { getPlace } = require("./api/kakaoApi.js");
const { error } = require("console");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post("/api/recommand", async (req, res) => {
  const { theme, date, time, loc } = req.body;
  try {
    const courses = await getPlace(theme, loc);
    if (courses) {
      res.json({ date, time, loc, course: courses });
    } else {
      res.status(500).json({ error: "fail" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server" });
  }
});

app.listen(port, () => {
  console.log("server on");
});
