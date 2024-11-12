const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post("api/recommand", (req, res) => {
  const { date, time, loc } = req.body;

  const courses = {};

  const course_list = courses[loc] || ["no course"];
  res.json({ date, time, loc, course: course_list });
});

app.listen(port, () => {
  console.log("server on");
});
