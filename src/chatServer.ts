import * as http from 'http';
import * as WebSocket from 'ws';
import * as fs from 'fs';
import * as path from 'path';
import { events, chatEventEmitter } from './events';
import { URL } from 'url';
import { nameCorrection } from './utils/nameCorrection';
import { UsersManager } from './utils/usersManager';

class ChatServer {
    private server: http.Server;
    private wss: WebSocket.Server;
    private logFilePath: string;
    private usersManager: UsersManager;

    constructor() {
        this.server = http.createServer();
        this.wss = new WebSocket.Server({ server: this.server });
        this.logFilePath = path.join(__dirname, '../logs/chat.log');
        this.setupWebSocket();
        this.setupEventHandlers();
        this.usersManager = new UsersManager()
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

    public start(port: number): void {
        this.server.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    }
}

export { ChatServer };
