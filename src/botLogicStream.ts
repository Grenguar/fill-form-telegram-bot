import BotLogic from "./botLogic";
import TrelloApiConnector from "./trelloApiConnector";

export default class BotLogicStream extends BotLogic  {
    public async activate(body: any): Promise<void> {
        const userInput = body.message.text;
        const chatId = body.message.chat.id.toString();
        const username = body.message.from.username;

        if (this.validator.hasEventBodyMessage(body)) {
            if (userInput === "/start") {
                this.bot.telegram.sendMessage(
                    chatId,
                    `👋 Привет. Задай свой вопрос про IT карьеру в Европе и мы ответим на него в следующем прямом эфире в Инстаграм. Вопросов можно прислать бесконечное количество.`
                  )
            } else {
                await this.trelloHandler(userInput, username)
                this.bot.telegram.sendMessage(
                    chatId,
                    `Вопрос принят. Увидимся на стриме! Подписывайся на наш Instagram: https://instagram.com/geek.exp`)
                this.bot.telegram.sendMessage(chatId,
                    `/**\n  * Пссс...если у тебя нет инстаграма, то вопрос у нас: как ты выживаешь на карантине без видео про котиков? 🤔\n  */`)
            }
            return
        }
    }

    /**
     * 
     * @param input 
     * @param user 
     */

    private async trelloHandler(input: string, user: string) {
        const trelloKey = process.env.TRELLO_KEY
        const trelloToken = process.env.TRELLO_TOKEN
        const trelloListId = process.env.TRELLO_LIST_ID
        if (typeof trelloKey === "undefined" || typeof trelloToken === "undefined" || typeof trelloListId === "undefined") {
            const errText = "Error: trello credentials are not set"
            console.error(errText)
            throw Error(errText)
        }
        const trelloConnector = new TrelloApiConnector(trelloKey!, trelloToken!)
        return await trelloConnector.addCard(trelloListId!, input, user)
    }
}