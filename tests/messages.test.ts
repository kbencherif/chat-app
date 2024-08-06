import { MessageService } from '../src/services/messageService'

describe('testing Message format', () => {
    const messageService: MessageService = new MessageService()

    test('Create new message', () => {
        const date = new Date()
        const data = "data"
        const username = "name"
        const msg = messageService.newMessage(data, username)

        expect(msg).toStrictEqual({ data, username, date })
    })

    test('Format message', () => {
        const date = new Date()
        const data = "data"
        const username = "name"
        const msg = messageService.newMessage(data, username)
        const format = messageService.format(msg)

        expect(format).toBe(`[${date.toISOString()}] ${username}: ${data}`)
    })
})
