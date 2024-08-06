import { EventEmitter } from 'events';

interface ChatEvents {
    USER_JOIN: 'userJoin';
    USER_LEAVE: 'userLeave';
    MESSAGE_RECEIVED: 'messageReceived';
}

const events: ChatEvents = {
    USER_JOIN: 'userJoin',
    USER_LEAVE: 'userLeave',
    MESSAGE_RECEIVED: 'messageReceived',
};

class ChatEventEmitter extends EventEmitter {}

const chatEventEmitter = new ChatEventEmitter();

export { events, chatEventEmitter };
