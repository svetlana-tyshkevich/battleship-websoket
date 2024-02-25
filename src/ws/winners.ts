import { winners } from './db.js';
import { IWinner } from '../types/interface-types.js';
import { WebSocketServer } from 'ws';

export const setNewWinner = (newWinner: IWinner, wss: WebSocketServer) => {
    winners.push(newWinner);
    return updateWinnersAction(wss);
};

export const updateWinnersAction = (wss: WebSocketServer) => {
    winners.sort((a, b) => a.wins - b.wins)
    const response = { type: 'update_winners', id: 0, data: JSON.stringify(winners) };
    wss.clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(JSON.stringify(response));
        }
    });
};