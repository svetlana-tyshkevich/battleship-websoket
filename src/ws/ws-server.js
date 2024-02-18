import { WebSocketServer } from 'ws';
import { handleMessage } from './messageHandling.js';

export const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', function connection(ws) {
    ws.on('error', (error) => {
        console.error(error);
        ws.close();
    });

    ws.on('message', function message(data) {
        console.log('received: %s', data);

        const answer = handleMessage(data);

        if (answer) ws.send(answer)
    });

});
