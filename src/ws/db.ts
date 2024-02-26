import { IRoom, IUser } from '../types/interface-types.js';

export const users: IUser[] = [];
export let rooms: IRoom[] = [];

export const setRooms = (updatedRooms: IRoom[]) => {
    rooms = updatedRooms
};