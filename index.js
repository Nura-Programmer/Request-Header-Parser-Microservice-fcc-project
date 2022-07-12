const cors = require("cors");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

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

app.get("/api/whoami", (req, res) => {
  const ipaddress = req.ip;
  const language = req.acceptsLanguages().toString();
  const software = req.get("User-Agent");

  res.json({ ipaddress, language, software });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));