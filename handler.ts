import { Handler, Context, Callback } from "aws-lambda";
import Telegraf from "telegraf";
import Questions from "./src/questions";
import DynamoDbConnector from "./src/connector/dynamoDbConnector";

interface HelloResponse {
  statusCode: number;
  body: string;
}

const bot = new Telegraf(process.env.BOT_TOKEN!);
const questions = new Questions().questions;
const dbConnector = new DynamoDbConnector(process.env.DYNAMODB_TABLE!);
const finalAnswer = "Спасибо! Ваши ответы приняты!";

const sendAnswer: Handler = async (event: any, context: Context, callback: Callback) => {
  const body = JSON.parse(event.body);
  const userInput = body.message.text;
  const chatId = body.message.chat.id;
  const chatIdString = chatId.toString();
  let curAnswer = await dbConnector.getCurrentAnswer(chatIdString);

  if (body.message.document) {
    const documentData = <DocumentData>body.message.document;
    const answerForPdfCheck = answerIfPdfFormat(documentData);
    copyFileToS3(documentData);
    bot.telegram.sendMessage(chatId, answerForPdfCheck);
    if (ifPdfCheck(documentData)) {
      await dbConnector.increaseCounter(chatIdString, curAnswer);
      bot.telegram.sendMessage(chatId, finalAnswer);
    }
  } else {
    if (userInput === "/start" && curAnswer === 0) {
      // bot.telegram.sendMessage(chatId, );
      dbConnector.createForm(chatIdString);
      bot.telegram.sendMessage(chatId, `${questions[0].text}\n\n${questions[1].text}`);
    } else if (curAnswer >= questions.length) {
      bot.telegram.sendMessage(chatId, "Вы уже ответили на все наши вопросы. Спасибо еще раз!");
    } else {
      await dbConnector.updateAnswer(chatIdString, curAnswer, userInput);
      bot.telegram.sendMessage(chatId, questions[++curAnswer].text);
    }
    await bot.handleUpdate(body);
  }

  const response: HelloResponse = {
    statusCode: 200,
    body: "ok"
  };

  callback(null, response);
};

const ifPdfCheck = (documentData: DocumentData): boolean => {
  return documentData.mime_type === "application/pdf";
};

const answerIfPdfFormat = (documentData: DocumentData): string => {
  return ifPdfCheck(documentData) ? `File accepted` : `File is not accepted! Please send file in PDF format`;
};

const copyFileToS3 = (documentData: DocumentData): void => {
  //https://api.telegram.org/bot<bot_token>/getFile?file_id=the_file_id
  //https://api.telegram.org/bot<TOKEN>/getFile?file_id=FILE_ID
  //Response: {"ok":true,"result":{"file_id":"the_file_id","file_size":50729,"file_path":"PATH"}}
  //Download: https://api.telegram.org/file/bot<TOKEN>/PATH
};

type DocumentData = {
  file_name: string;
  mime_type: string;
  file_id: string;
  file_size: number;
};

export { sendAnswer };
