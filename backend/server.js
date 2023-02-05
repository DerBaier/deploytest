const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const configFile = __dirname + "/config.json";
const config = loadConfig(configFile);
let PORT = config.PORT;

const indexFile = "/index.html";

app.use(express.json());
app.use(express.static("../frontend"));
app.use(express.static("../backend"));
app.use(express.static("../notizen"));

app.listen(PORT, () => {
  console.log("Notizenapp Server gestartet.");
});

function loadConfig(path) {
  return loadFileAsJSON(path);
}

function checkFileExistence(path) {
  try {
    if (fs.existsSync(path)) {
      return true;
    }
  } catch (error) {
    return false;
  }
}

function loadFileAsJSON(path) {
  let file = fs.readFileSync(path, "utf8", (err, data) => {
    if (err) {
      return { error: "File not found." };
    } else return data;
  });

  return JSON.parse(file);
}

app.get("/", (req, res) => {
  res.sendFile(indexFile);
});

app.get("/loadNotices", (req, res) => {
  res.send(JSON.stringify(loadNoticesNames()));
});

function loadNoticesNames() {
  var filePath = __dirname + "/notizen";
  var names = [];
  console.log("hier");
  fs.readdirSync(filePath).forEach((file) => {
    names.push(file.split(".json")[0]);
  });

  return names;
}

function createNoticeFile(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 4));
}

app.post("/createNewNotice", (req, res) => {
  var noticename = req.body.name;
  var filepath = __dirname + `/notizen/${noticename}.json`;

  if (checkFileExistence(filepath)) {
    console.log("File already exist");
  } else {
    console.log("Creating file...");
    createNoticeFile(filepath, { title: noticename });
  }
});
