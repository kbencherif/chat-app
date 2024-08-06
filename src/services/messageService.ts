import { Message } from "../types/message"

class MessageService {
    /**
    * Format message for the client and the log file.
    * eg: [2024-08-06T23:45:10.456Z] User: This is a message
    */

    public format(message: Message): string {
        return `[${message.date.toISOString()}] ${message.username}: ${message.data}`
    }

    /**
     * Use this method to create an object and make the data processing easier.
    */
    public newMessage(data: string, username: string): Message {
        return { data, username, date: new Date() }
    }
}

export { MessageService }
