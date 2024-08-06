import { Message } from "../types/message"

class MessageService {
    public format(message: Message): string {
        return `[${message.date.toISOString()}] ${message.username}: ${message.data}`
    }

    public newMessage(data: string, username: string): Message {
        return { data, username, date: new Date() }
    }
}

export { MessageService }
