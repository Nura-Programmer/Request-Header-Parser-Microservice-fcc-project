const bodyPaser = require("body-parser");
const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

app.use(bodyPaser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use((req, _, next) => {
  const { method, path, ip } = req;
  const logDetails = `${method} ${path} - ${ip}`;

  console.log(logDetails);
  next();
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/api/:date?", (req, res) => {
  let date = req.params.date;
  
  res.statusCode = 200;
  res.contentType = "application/json";

  if (date === undefined) {
    const currentDate = new Date();


    return res.json({
      unix: Math.floor(currentDate.getTime() / 1000),
      utc: currentDate.toGMTString()
    });
  }

  date = date.indexOf(",") > -1 ? decodeURIComponent(date) : date.length > 10 ? Number(date) : date;

  console.log(date);
  
  if (date === NaN) return res.status(400).json({ error: "Invalid Date" });

  const gmtDate = new Date(date);

  res.json({
    unix: Math.floor(gmtDate.getTime() / 1000),
    utc: gmtDate.toGMTString()
  });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));