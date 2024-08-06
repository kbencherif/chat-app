import * as http from 'http';
import * as WebSocket from 'ws';
import * as fs from 'fs';
import * as path from 'path';
import { events, chatEventEmitter } from './events';

class ChatServer {
    private server: http.Server;
    private wss: WebSocket.Server;
    private logFilePath: string;

    constructor() {
        this.server = http.createServer();
        this.wss = new WebSocket.Server({ server: this.server });
        this.logFilePath = path.join(__dirname, '../logs/chat.log');
        this.setupWebSocket();
        this.setupEventHandlers();
    }

    private setupWebSocket(): void {
        this.wss.on('connection', (ws: WebSocket) => {
            ws.on('message', (message: string) => {
                const logMessage = `[${new Date().toISOString()}] ${message}\n`;
                fs.appendFile(this.logFilePath, logMessage, err => {
                    if (err) {
                        console.error('Failed to write to log file', err);
                    }
                });
                chatEventEmitter.emit(events.MESSAGE_RECEIVED, message);
            });

            ws.send('Welcome to the chat!');
        });
    }

    private setupEventHandlers(): void {
        chatEventEmitter.on(events.MESSAGE_RECEIVED, (message: string) => {
            this.broadcast(message);
        });
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
