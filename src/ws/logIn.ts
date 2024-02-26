import { users } from './db.js';
import { IShip, IUser } from '../types/interface-types.js';
import { WebSocket } from 'ws';

export const logInAction = (data: IUser, ws: WebSocket) => {
    let answerData;
    let newUser;
    const { name, password } = data;
    const foundUser = users.find(item => item.name === name);
    if (!foundUser) {
        const index = new Date().getTime();
        const ships: IShip[] = []
        newUser = { name, password, index, ws, ships, wins: 0 }
        users.push(newUser);
        answerData = {
            name,
            index,
            error: false,
            errorText: ''
        };
    } else if (foundUser.password === password) {
        answerData = {
            name: foundUser.name,
            index: foundUser.index,
            error: false,
            errorText: ''
        };
    } else {
        answerData = {
            name: foundUser.name,
            index: foundUser.index,
            error: true,
            errorText: 'Password is incorrect!'
        };
    }
    const response = { type: 'reg', id: 0, data: JSON.stringify(answerData) };
    ws.send(JSON.stringify(response));
    return newUser;
};