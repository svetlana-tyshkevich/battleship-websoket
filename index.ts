import { httpServer } from './src/http_server/index.js';
import { WebSocketServer } from 'ws';
import { handleMessage } from './src/ws/messageHandling.js';
import { IUser } from './src/types/interface-types.js';

const HTTP_PORT = 8181;

export const wss = new WebSocketServer({ port: 3000, clientTracking: true });

wss.on('connection', function connection(ws) {
    let currentUser: IUser;
    ws.on('error', (error) => {
        console.error(error);
        ws.close();
    });

    ws.on('message', function message(data) {
        console.log('received: %s', data);

        const responses = handleMessage(data, currentUser);
        const stringifiedResponces = responses.map(res => ({ type: res.type, id: 0, data: JSON.stringify(res.data) }));
        stringifiedResponces.forEach(res => {
            if (res.type === 'update_winners') {
                wss.clients.forEach(client => {
                    if (client.readyState === 1) {
                        client.send(JSON.stringify(res))
                    }
                })
            } else if (res.type === 'reg') {
                currentUser = JSON.parse(res.data);
                ws.send(JSON.stringify(res))
            } else
            ws.send(JSON.stringify(res))
        });

    });

});

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
