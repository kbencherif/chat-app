import * as http from 'http';
import * as WebSocket from 'ws';
import * as fs from 'fs';
import * as path from 'path';
import { events, chatEventEmitter } from './events';
import { URL } from 'url';
import { nameCorrection } from './utils/nameCorrection';
import { UsersManager } from './utils/usersManager';
import { StreamService } from './services/streamService';
import { MessageService } from './services/messageService';
import { Message } from './types/message';

class ChatServer {
    private server: http.Server;
    private wss: WebSocket.Server;
    private logFilePath: string;
    private usersManager: UsersManager;
    private streamService: StreamService
    private messageService: MessageService

    constructor() {
        this.server = http.createServer();
        this.wss = new WebSocket.Server({ server: this.server });
        this.logFilePath = path.join(__dirname, '../logs/chat.log');
        this.setupWebSocket();
        this.setupEventHandlers();
        this.usersManager = new UsersManager()
        this.streamService = this.setUpStreamService(this.logFilePath)
        this.messageService = new MessageService()
    }

    private setupWebSocket(): void {
        this.wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
            const url = new URL(`http://${req.headers.host}${req.url}`)
            const username: string = nameCorrection(url.searchParams.get('username') ?? '')

            try {
                this.newUser(username)
                ws.send(`Welcome to the chat ${username}!`);
            } catch (e: any) {
                ws.send(e.toString())
                ws.terminate()
            }

            ws.on('message', (data: string) => {
                const message = this.messageService.newMessage(data, username)
                chatEventEmitter.emit(events.MESSAGE_RECEIVED, message);
            });


            ws.on('close', () => {
                chatEventEmitter.emit(events.USER_LEAVE, username);
            })
        });

    }

    private setupEventHandlers(): void {
        chatEventEmitter.on(events.MESSAGE_RECEIVED, (message: Message) => {
            const stringMessage = this.messageService.format(message)
            this.streamService.writeData(stringMessage)
            this.broadcast(stringMessage);
        });

        chatEventEmitter.on(events.USER_JOIN, (username: string) => {
            this.usersManager.addUser(username)
        })

        chatEventEmitter.on(events.USER_LEAVE, (username: string) => {
            this.usersManager.deleteUser(username)
        })
    }

    private broadcast(message: string): void {
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    private newUser(username: string): void {
        if (username === '') {
            throw new Error("Give a username to use the application (ws://{url}?username={your username}).")
        } else if (this.usersManager.userExists(username)) {
            throw new Error("User with this name already exists")
        } else {
            chatEventEmitter.emit(events.USER_JOIN, username);
        }
    }

    private setUpStreamService(path: string): StreamService {
        return new StreamService(
            fs.createReadStream(path, 'utf-8'),
            fs.createWriteStream(path, 'utf-8'))
    }

    public start(port: number): void {
        this.server.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    }
}

export { ChatServer };
