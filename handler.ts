import { Handler, Context, Callback } from "aws-lambda";
import BotLogic from "./src/botLogic";
import BotLogicStream from "./src/botLogicStream";

const sendAnswer: Handler = async (event: any, context: Context, callback: Callback) => {
  const body = JSON.parse(event.body);
  const botLogic = new BotLogic();
  await botLogic.activate(body);

  callback(null, {
    statusCode: 200,
    body: "ok"
  });
};

const streamBotAnswer: Handler = async (event: any, context: Context, callback: Callback) => {
  const body = JSON.parse(event.body);
  const botLogicStream = new BotLogicStream()
  await botLogicStream.activate(body)
  callback(null, {
    statusCode: 200,
    body: "ok"
  });
}

export { sendAnswer, streamBotAnswer };
