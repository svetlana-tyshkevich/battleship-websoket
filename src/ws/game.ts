import { IRoom, IShip } from '../types/interface-types.js';
import { rooms } from './db.js';

export const createGameAction = (currentRoom: IRoom) => {
    const gameId = new Date().getTime();
    currentRoom.gameId = gameId;
    currentRoom.roomUsers.forEach(user => {
        const resData = { idGame: gameId, idPlayer: user.index };
        const response = { type: 'create_game', id: 0, data: JSON.stringify(resData) };
        if (user.ws) user.ws.send(JSON.stringify(response));
    });
};

export const addShipsAction = (gameId: number, indexPlayer: number, ships: IShip[]) => {
    const currentRoom = rooms.find(room => room.gameId === gameId);
    currentRoom && currentRoom.roomUsers.forEach(user => {
        if (user.index === indexPlayer) {
            user.ships = ships;
        }
    });
    if (currentRoom && currentRoom.roomUsers.every(user => user.ships.length)) {
        currentRoom.roomUsers.forEach(user => {
            const resData = { currentPlayerIndex: user.index, ships: user.ships };
            const response = { type: 'start_game', id: 0, data: JSON.stringify(resData) };
            if (user.ws) user.ws.send(JSON.stringify(response));
        });
    }

};