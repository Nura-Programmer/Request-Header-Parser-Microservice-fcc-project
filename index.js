const cors = require("cors");
const express = require("express");
const app = express();

const port = process.env.PORT || 3000;
const getTheDate = date => ({
  unix: date.valueOf(),
  utc: date.toGMTString()
});

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

  if (date === undefined)
    return res.json(getTheDate(new Date()));


  date = date.indexOf(",") > -1 ? decodeURIComponent(date) : date.length > 10 ? parseInt(date) : date;

  const gmtDate = new Date(date);

  if (gmtDate == "Invalid Date") return res.status(400).json({ error: "Invalid Date" });

  res.json(getTheDate(gmtDate));
});

app.listen(port, () => console.log(`Server listening on port ${port}`));