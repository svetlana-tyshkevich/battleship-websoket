import { httpServer } from './src/http_server/index.js';
import { RawData, WebSocketServer, WebSocket } from 'ws';
import { handleMessage } from './src/ws/messageHandling.js';
import { IUser } from './src/types/interface-types.js';

const HTTP_PORT = 8181;

export const wss = new WebSocketServer({ port: 3000, clientTracking: true });

wss.on('connection', function connection(ws: WebSocket) {
    let currentUser: IUser;
    ws.on('error', (error: ErrorEvent) => {
        console.error(error);
        ws.close();
    });

    ws.on('message', function message(data: RawData) {
        const response = handleMessage(data, currentUser, ws, wss);
        if (response) {
            currentUser = response;
        }
        // const stringifiedResponces = responses.map(res => ({ type: res.type, id: 0, data: JSON.stringify(res.data) }));
        // stringifiedResponces.forEach(res => {
        //      if (res.type === 'reg') {
        //         const currentUserObject = JSON.parse(res.data);
        //         currentUser = {name: currentUserObject.name, index: currentUserObject.index}
        //          ws.send(JSON.stringify(res))
        //     } else  if (res.type === 'update_room' || res.type === 'update_winners'){
        //          wss.clients.forEach(client => {
        //              if (client.readyState === 1) {
        //                  client.send(JSON.stringify(res))
        //              }
        //          })
        //      } else {
        //
        //      }
        // });

    });

});

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
