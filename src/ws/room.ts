import { rooms, setRooms } from './db.js';
import { IRoom, IUser } from '../types/interface-types.js';
import { WebSocketServer } from 'ws';

export const createRoomAction = (currentUser: IUser, wss: WebSocketServer) => {
    const roomWithCurrentUser = rooms.find((room: IRoom) => room.roomUsers.includes(currentUser));
    if (!roomWithCurrentUser) {
        const id = new Date().getTime();
        const newRoom: IRoom = {
            roomId: id,
            roomUsers: currentUser ? [currentUser] : []

        };
        rooms.push(newRoom);
    }

    getOpenRooms(wss);
};

export const addUserToRoomAction = (indexRoom: number, currentUser: IUser) => {
    const room = rooms.find((room: IRoom) => room.roomId === indexRoom);
    if (room) {
        const roomIncludesCurrentUser = room.roomUsers.includes(currentUser);
        if (!roomIncludesCurrentUser) {
            room.roomUsers.push(currentUser);
            setRooms(rooms);
        }
    }
};

export const getOpenRooms = (wss: WebSocketServer) => {
    const resData = rooms.filter(room => room.roomUsers.length === 1);
    const response = { type: 'update_room', id: 0, data: JSON.stringify(resData) };
    wss.clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(JSON.stringify(response));
        }
    });
};

export const deleteRoomAction = (roomId: number) => {
    const index = rooms.findIndex(room => room.roomId === roomId);
    rooms.splice(index, 1);
};
