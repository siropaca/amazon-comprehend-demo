const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-2" });
const comprehend = new AWS.Comprehend();

exports.handler = async (event, context, callback) => {
  const text = event.text;

  if (!text) return;

  const textAry = Array.isArray(text) ? text : [text];

  let params = {
    TextList: textAry
  };

  let LanguageResult = await comprehend
                              .batchDetectDominantLanguage(params)
                              .promise();

  params["LanguageCode"] = LanguageResult
                            .ResultList[0]
                            .Languages[0]
                            .LanguageCode;

  const sentiment = await comprehend
                            .batchDetectSentiment(params)
                            .promise();

  return sentiment;
};