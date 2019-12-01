import Telegraf, { ContextMessageUpdate } from "telegraf";
import Questions from "./questions";
import DynamoDbConnector from "./connector/dynamoDbConnector";
import DocumentData from "./model/documentData";
import FileHandler from "./fileHandler";
import Validator from "./validator";
import FormQuestion from "./model/formQuestion";
import FormAnswer from "./model/formAnswer";

export default class BotLogic {
  fileAccepted = "Файл принят.";
  fileNotAccepted = `Файл не принят. Проверьте расширение. Я принимаю: pdf, doc, docx, odt, txt`;
  bot: Telegraf<ContextMessageUpdate>;
  dbConnector: DynamoDbConnector;
  validator: Validator;
  questions: Questions;

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN!);
    this.questions = new Questions();
    this.dbConnector = new DynamoDbConnector(process.env.DYNAMODB_TABLE!);
    this.validator = new Validator();
  }

  public async activate(body: any): Promise<void> {
    const formQuestions = this.questions.questions;
    const userInput = body.message.text;
    const chatId = body.message.chat.id;
    const chatIdString = chatId.toString();
    let currIndexAnswer = await this.dbConnector.getCurrentAnswer(chatIdString);
    const currQuestion: FormQuestion = formQuestions[currIndexAnswer];
    if (currIndexAnswer >= formQuestions.length) {
      this.bot.telegram.sendMessage(chatId, this.questions.afterFinalWords);
      return;
    }

    if (body.message.photo || body.message.location) {
      this.bot.telegram.sendMessage(chatId, this.questions.typeError);
      return;
    }

    if (body.message.document && currQuestion.type === "file") {
      const documentData = <DocumentData>body.message.document;
      if (this.validator.validateWrittenDocument(documentData)) {
        this.bot.telegram.sendMessage(
          chatIdString,
          currQuestion.success ? currQuestion.success : "Файл загружен успешно"
        );
        await this.dbConnector.updateAnswer(chatIdString, currIndexAnswer, documentData.file_name);
        const item = await this.dbConnector.getItem(chatIdString);
        const fileHandler = new FileHandler(documentData);
        fileHandler.copyFileToS3(true, this.parseObjectToHtml(item));
        currIndexAnswer++;
      } else {
        this.bot.telegram.sendMessage(
          chatIdString,
          currQuestion.error ? currQuestion.error : "Файл не принят. Попробуйте еще раз!"
        );
      }
      if (currIndexAnswer === formQuestions.length) {
        this.bot.telegram.sendMessage(chatId, this.questions.finalWords);
        await this.dbConnector.increaseCounter(chatIdString, currIndexAnswer);
      }
      return;
    }

    if (this.validator.hasEventBodyMessage(body)) {
      if (userInput === "/start" && currIndexAnswer === 0) {
        this.dbConnector.createForm(chatIdString);
        this.bot.telegram.sendMessage(chatId, `${this.questions.welcomeWords}\n\n${currQuestion.text}`);
      } else {
        if (this.validator.validate(currQuestion.type, userInput)) {
          this.dbConnector.updateAnswer(chatIdString, currIndexAnswer, userInput);
          currIndexAnswer++;
          this.bot.telegram.sendMessage(chatId, this.questions.questions[currIndexAnswer].text);
        } else {
          this.bot.telegram.sendMessage(
            chatId,
            `${currQuestion.error ? currQuestion.error : "Ошибка ввода! Повторите еще раз."}`
          );
        }
      }
      if (currIndexAnswer === formQuestions.length) {
        this.bot.telegram.sendMessage(chatId, this.questions.finalWords);
        await this.dbConnector.increaseCounter(chatIdString, ++currIndexAnswer);
      }
      return;
    }
  }

  private parseObjectToHtml(formAnswer: FormAnswer): string {
    let result = "";
    for (var key in formAnswer) {
      if (formAnswer.hasOwnProperty(key) && key !== "currentAnswer" && key !== "id") {
        result += `<p>${key}: ${formAnswer[key]}</p>`;
      }
    }
    return result;
  }
}
