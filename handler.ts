import { Handler, Context, Callback } from "aws-lambda";
import BotLogic from "./src/botLogic";

const sendAnswer: Handler = async (event: any, context: Context, callback: Callback) => {
  const body = JSON.parse(event.body);
  const botLogic = new BotLogic();
  await botLogic.activate(body);

  callback(null, {
    statusCode: 200,
    body: "ok"
  });
};

export { sendAnswer };
