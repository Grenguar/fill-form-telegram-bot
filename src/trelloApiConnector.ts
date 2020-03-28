import axios from "axios";

export default class TrelloApiConnector {
    token: string;
    key: string;
    baseUrl: string

    constructor(key: string, token: string) {
        this.key = key
        this.token = token
        this.baseUrl = "https://api.trello.com"
    }

    public async addCard(listId: string, text: string, user: string) {
        const cardTitle = encodeURIComponent(`Q: ${text}`)
        const telegramLink = `[${user}](https://t.me/${user})`
        const cardDesc = encodeURIComponent(`Telegram ${telegramLink} : ${text}`)
        const cardApiEndpoint = `${this.baseUrl}/1/cards?name=${cardTitle}&desc=${cardDesc}&pos=top&idList=${listId}&keepFromSource=all&key=${this.key}&token=${this.token}`
        const response = await axios.post(cardApiEndpoint)
        .catch(e => console.log(e))
        return response ? true : false
    }
}