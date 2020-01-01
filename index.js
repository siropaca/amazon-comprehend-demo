const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-2" });
const comprehend = new AWS.Comprehend();

exports.handler = async (event, context, callback) => {
  const text = event.text;

  if (!text) return;

  let params = {
    TextList: [text]
  };

  // 言語コードを判別する
  const LanguageResult = await comprehend
                               .batchDetectDominantLanguage(params)
                               .promise();

  params["LanguageCode"] = LanguageResult
                            .ResultList[0]
                            .Languages[0]
                            .LanguageCode;

  // 感情分析をする
  const sentiment = await comprehend
                            .batchDetectSentiment(params)
                            .promise();

  return sentiment;
};