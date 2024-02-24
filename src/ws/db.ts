import { IRoom, IUser, IWinner } from '../types/interface-types.js';

export const users: IUser[] = [];
export let rooms: IRoom[] = [];
export const winners: IWinner[] = [];

export const setRooms = (updatedRooms: IRoom[]) => {
    rooms = updatedRooms
};