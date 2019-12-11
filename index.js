const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const AWS = require("aws-sdk");

AWS.config.loadFromPath("./rootkey.json");
AWS.config.update({ region: "us-east-2" });
const comprehend = new AWS.Comprehend();

const PORT = 3000;

/** server */
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(`${__dirname}/demo.html`));
});

app.post("/", async (req, res) => {
  const text = req.body.text;

  if (!text) return res.sendStatus(400);

  const langCode = await getLangCode(text);

  const sentiment = await getSentiment(text, langCode);

  res.json(sentiment);
});

app.listen(PORT, () => console.log(`Listening on: http://localhost:${PORT}`));

/** functions */
function getLangCode(text) {
  return new Promise((resolve, reject) => {
    const params = {
      TextList: [text]
    };

    comprehend.batchDetectDominantLanguage(params, (err, data) => {
      if (err) return reject(err);

      const langCode = data.ResultList[0].Languages[0].LanguageCode;

      resolve(langCode);
    });
  });
}

function getSentiment(text, langCode) {
  return new Promise((resolve, reject) => {
    const params = {
      TextList: [text],
      LanguageCode: langCode
    };

    comprehend.batchDetectSentiment(params, (err, data) => {
      if (err) return reject(err);

      resolve(data.ResultList[0]);
    });
  });
}
