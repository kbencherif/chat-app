import * as http from 'http';
import * as WebSocket from 'ws';
import * as fs from 'fs';
import * as path from 'path';
import { events, chatEventEmitter } from './events';
import { URL } from 'url';
import { nameCorrection } from './utils/nameCorrection';

class ChatServer {
    private server: http.Server;
    private wss: WebSocket.Server;
    private logFilePath: string;
    private users: string[];

    constructor() {
        this.server = http.createServer();
        this.wss = new WebSocket.Server({ server: this.server });
        this.logFilePath = path.join(__dirname, '../logs/chat.log');
        this.setupWebSocket();
        this.setupEventHandlers();
        this.users = []
    }

    private setupWebSocket(): void {
        this.wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
            const url = new URL(`http://${req.headers.host}${req.url}`)
            const username: string = nameCorrection(url.searchParams.get('username') ?? '')

            if (username === '') {
                ws.send("Give a username to use the application (ws://{url}?username={your username}).")
                ws.terminate()
            } else if (this.users.includes(username)) {
                ws.send("User with this name already exists")
                ws.terminate()
            } else {
                chatEventEmitter.emit(events.USER_JOIN, username);
                ws.send(`Welcome to the chat ${username}!`);
            }

            ws.on('message', (message: string) => {
                const logMessage = `[${new Date().toISOString()}] ${message}\n`;
                fs.appendFile(this.logFilePath, logMessage, err => {
                    if (err) {
                        console.error('Failed to write to log file', err);
                    }
                });
                chatEventEmitter.emit(events.MESSAGE_RECEIVED, message);
            });


            ws.on('close', () => {
                chatEventEmitter.emit(events.USER_LEAVE, username);
            })
        });

    }

    private setupEventHandlers(): void {
        chatEventEmitter.on(events.MESSAGE_RECEIVED, (message: string) => {
            this.broadcast(message);
        });

        chatEventEmitter.on(events.USER_JOIN, (username: string) => {
            this.users.push(username)
        })

        chatEventEmitter.on(events.USER_LEAVE, (username: string) => {
            const i = this.users.indexOf(username)
            if (i > -1) {
                this.users.splice(i, 1)
            }

        })
    }

    private broadcast(message: string): void {
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    public start(port: number): void {
        this.server.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    }
}

export { ChatServer };
