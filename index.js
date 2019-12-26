const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-2" });
const comprehend = new AWS.Comprehend();

exports.handler = async (event, context, callback) => {
  let text = event.text;

  if (!text) return;

  let params = {
    TextList: [text]
  };

  let result = await comprehend.batchDetectDominantLanguage(params).promise();

  const languageCode = result.ResultList[0].Languages[0].LanguageCode;

  params["LanguageCode"] = languageCode;

  const sentiment = await comprehend.batchDetectSentiment(params).promise();

  return sentiment;
};
