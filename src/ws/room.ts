import { rooms, setRooms } from './db.js';
import { IRoom, IUser } from '../types/interface-types.js';

export const createRoomAction = (currentUser: IUser | undefined) => {
    if (currentUser) {
        const roomWithCurrentUser = rooms.find((room: IRoom) => room.roomUsers.includes(currentUser));
        if (!roomWithCurrentUser) {
            const id = new Date().getTime();
            const newRoom: IRoom = {
                roomId: id,
                roomUsers: currentUser ? [currentUser] : []

            };
            rooms.push(newRoom);
        }
    }


    return rooms;
};

export const updateRoomStateAction = () => {
    setRooms(rooms.filter(room => room.roomUsers.length === 1));
    return rooms;
};

export const deleteRoomAction = (roomId: number) => {
    const index = rooms.findIndex(room => room.roomId === roomId);
    rooms.splice(index, 1);
};
