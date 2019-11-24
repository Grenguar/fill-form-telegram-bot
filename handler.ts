import { Handler, Context, Callback } from "aws-lambda";
import Telegraf from "telegraf";

interface HelloResponse {
  statusCode: number;
  body: string;
}

const sendAnswer: Handler = async (event: any, context: Context, callback: Callback) => {
  //https://api.telegram.org/bot<bot_token>/getFile?file_id=the_file_id
  //https://api.telegram.org/botTOKEN/getFile?file_id=FILE_ID
  //Response: {"ok":true,"result":{"file_id":"the_file_id","file_size":50729,"file_path":"PATH"}}
  //Download: https://api.telegram.org/file/bot1002584568:AAF55DOniBlgTmy7sFhfsZpSbP-7kxcbr2g/PATH
  const body = JSON.parse(event.body);
  const userInput = body.message.text;
  const chatId = body.message.chat.id;
  const bot = new Telegraf(process.env.BOT_TOKEN!);

  if (body.message.document) {
    const documentData = body.message.document;
    if (documentData.mime_type === "application/pdf") {
      bot.telegram.sendMessage(chatId, `File accepted`);
    } else {
      bot.telegram.sendMessage(chatId, `File is not accepted! Please send file in PDF format`);
    }
  } else {
    bot.on("text", ctx => ctx.reply(`You said: ${userInput} and your chatId: ${chatId}`));
    console.log("Request: " + JSON.stringify(body));
    await bot.handleUpdate(body);
  }

  const response: HelloResponse = {
    statusCode: 200,
    body: "ok"
  };

  callback(null, response);
};

export { sendAnswer };
