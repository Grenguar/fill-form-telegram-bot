import { Handler, Context, Callback } from "aws-lambda";
import Telegraf from "telegraf";
import Questions from "./src/questions";
import DynamoDbConnector from "./src/connector/dynamoDbConnector";
import DocumentData from "./src/model/documentData";
import FileHandler from "./src/fileHandler";

const bot = new Telegraf(process.env.BOT_TOKEN!);
const questions = new Questions().questions;
const dbConnector = new DynamoDbConnector(process.env.DYNAMODB_TABLE!);
const finalAnswer = "Спасибо! Ваши ответы приняты!";
const afterFinalAnswer = "Вы уже ответили на все наши вопросы. Спасибо еще раз!";
const fileAccepted = "Файл принят.";
const fileNotAccepted = `Файл не принят. Проверьте расширение. Я принимаю: pdf, doc, docx, odt, txt`;

const sendAnswer: Handler = async (event: any, context: Context, callback: Callback) => {
  const body = JSON.parse(event.body);
  const userInput = body.message.text;
  const chatId = body.message.chat.id;
  const chatIdString = chatId.toString();
  let curAnswer = await dbConnector.getCurrentAnswer(chatIdString);

  if (body.message.document) {
    const documentData = <DocumentData>body.message.document;
    console.log(documentData);
    const answerForPdfCheck = answerAfterFile(documentData);
    const fileHandler = new FileHandler(documentData);
    bot.telegram.sendMessage(chatId, answerForPdfCheck);
    if (isSuitableDoc(documentData)) {
      await dbConnector.increaseCounter(chatIdString, curAnswer);
      fileHandler.copyFileToS3(true);
      bot.telegram.sendMessage(chatId, finalAnswer);
    }
  } else {
    if (userInput === "/start" && curAnswer === 0) {
      dbConnector.createForm(chatIdString);
      bot.telegram.sendMessage(chatId, `${questions[0].text}\n\n${questions[1].text}`);
    } else if (curAnswer >= questions.length) {
      bot.telegram.sendMessage(chatId, afterFinalAnswer);
    } else {
      await dbConnector.updateAnswer(chatIdString, curAnswer, userInput);
      bot.telegram.sendMessage(chatId, questions[++curAnswer].text);
    }
    await bot.handleUpdate(body);
  }

  callback(null, {
    statusCode: 200,
    body: "ok"
  });
};

const isSuitableDoc = (documentData: DocumentData): boolean => {
  const mimeType = documentData.mime_type;
  const isAllowedSize = documentData.file_size <= 15000000;
  return (
    isAllowedSize &&
    (mimeType === "application/pdf" ||
      mimeType === "application/msword" ||
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/vnd.oasis.opendocument.text" ||
      mimeType === "text/plain")
  );
};

const answerAfterFile = (documentData: DocumentData): string => {
  return isSuitableDoc(documentData) ? fileAccepted : fileNotAccepted;
};

export { sendAnswer };
