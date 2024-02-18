export interface IUser {
    index?: number;
    name: string;
    password: string;
}

export interface IWinner {
    name: string;
    wins: number;
}

export interface IRoom {
    roomId: number;
    roomUsers: IUser[];
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