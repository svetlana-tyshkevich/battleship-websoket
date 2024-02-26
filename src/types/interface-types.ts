import { WebSocket } from 'ws';

export interface IUser {
    index?: number;
    name: string;
    password?: string;
    ws?: WebSocket;
    ships: IShip[];
    parsedShips?: IParsedShip[];
}

export interface IWinner {
    name: string;
    wins: number;
}

export interface IRoom {
    roomId: number;
    roomUsers: IUser[];
    gameId?: number;
}

export interface IGame {
    idGame: number;
    idPlayer: number;
}

export interface IShip {
    position: {
        x: number,
        y: number,
    },
    direction: boolean,
    length: number,
    type: "small"|"medium"|"large"|"huge",
}
export interface IParsedShip {
    cells: ICell[],
    shipStart: ICell,
    direction: boolean,
    length: number,
}
export interface  ICell {
    x: number,
    y: number,
}