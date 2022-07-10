const cors = require("cors");
const express = require("express");
const app = express();

const port = process.env.PORT || 3000;
const getTheDate = date => ({ unix: Math.floor(date.getTime() / 1000), utc: date.toGMTString() });

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static("public"));

app.use((req, _, next) => {
  const { method, path, ip } = req;
  const logDetails = `${method} ${path} - ${ip}`;

  console.log(logDetails);
  next();
});

app.get("/", (_, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/api/:date?", (req, res) => {
  let date = req.params.date;

  res.contentType = "application/json";

  if (date === undefined) {
    const currentDate = new Date();

    return res.json(getTheDate(currentDate));
  }

  date = date.indexOf(",") > -1 ? decodeURIComponent(date) : date.length > 10 ? Number(date) : date;

  console.log(date);

  if (date === NaN) return res.status(400).json({ error: "Invalid Date" });

  const gmtDate = new Date(date);

  res.json(getTheDate(gmtDate));
});

app.listen(port, () => console.log(`Server listening on port ${port}`));