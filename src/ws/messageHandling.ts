import { RawData, WebSocket, WebSocketServer } from 'ws';
import { logInAction } from './logIn.js';
import { addUserToRoomAction, createRoomAction, getOpenRooms } from './room.js';
import { updateWinnersAction } from './winners.js';
import { IUser } from '../types/interface-types.js';
import { addShipsAction, attackAction, createGameAction } from './game.js';
import { rooms } from './db.js';

export const handleMessage = (message: RawData, currentUser: IUser | undefined, ws: WebSocket, wss: WebSocketServer) => {
    const requestData = JSON.parse(message.toString());
    const type = requestData.type;
    const data = requestData.data ? JSON.parse(requestData.data) : '';

    switch (type) {
        case 'reg': {
            const loginResponseData = logInAction(data, ws);
            getOpenRooms(wss);
            updateWinnersAction();
            return loginResponseData;
        }
        case 'create_room': {
            if (currentUser) {
                createRoomAction(currentUser, wss);
            }
            break;
        }
        case 'add_user_to_room': {
            if (currentUser) {
                const { indexRoom } = data;
                addUserToRoomAction(indexRoom, currentUser);
                getOpenRooms(wss);
                const currentRoom = rooms.find(room => room.roomId === indexRoom);
                if (currentRoom && currentRoom.roomUsers.length === 2) {
                    createGameAction(currentRoom);
                }
            }
            break;
        }
        case 'add_ships': {
            const { gameId, indexPlayer, ships } = data;
            addShipsAction(gameId, indexPlayer, ships);
            break;
        }
        case 'attack': {
            const { gameId, indexPlayer, x, y } = data;
            attackAction(gameId, indexPlayer, x, y);
            break;
        }

    }
    return null;
};