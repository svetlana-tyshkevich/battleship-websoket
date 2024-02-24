import { winners } from './db.js';
import { IWinner } from '../types/interface-types.js';

export const setNewWinner = (newWinner: IWinner) => {
    winners.push(newWinner);
    return updateWinnersAction();
};

export const updateWinnersAction = () => {
    winners.sort((a, b) => a.wins - b.wins)
    return winners;
};