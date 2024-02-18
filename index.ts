import { httpServer } from './src/http_server/index.js';
import { WebSocketServer } from 'ws';
import { handleMessage } from './src/ws/messageHandling.js';

const HTTP_PORT = 8181;

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

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
