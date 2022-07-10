const bodyPaser = require("body-parser");
const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

app.use(bodyPaser.urlencoded({extended: false}));
app.use(express.static(__dirname));
app.use((req, _, next) => {
  const {method, path, ip} = req;
  const logDetails = `${method} ${path} - ${ip}`;

  console.log(logDetails);
  next();
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/api/:date", (req, res) => {
  let  date  = req.params.date;
  date = date.length > 10 ? Number(date) : date;
  
  const gmtDate = new Date(date);
  const response = {
    unix: Math.floor(gmtDate.getTime() / 1000),
    utc: gmtDate.toGMTString()
  };
    
    res.json(response);
});

app.listen(port, () => console.log(`Server listening on port ${port}`));