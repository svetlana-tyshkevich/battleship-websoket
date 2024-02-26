import { users } from './db.js';

export const updateWinnersAction = () => {
    let winners = users.map(user => ({
        name: user.name,
        wins: user.wins
    }));
    winners = winners.filter(user => user.wins)
    winners.sort((a, b) => a.wins - b.wins);
    const response = { type: 'update_winners', id: 0, data: JSON.stringify(winners) };
    users.forEach(user => {
        if (user.ws) {
            user.ws.send(JSON.stringify(response));
        }
    });
};