import { IUser } from "../types/interface-types.js";

export const createGameAction = (currentUser: IUser) => {
    const gameId = new Date().getTime();
    return {idGame: gameId, idPlayer: currentUser.index}
};