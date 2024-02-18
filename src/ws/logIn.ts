import { users } from './db.js';
import { IUser } from '../types/interface-types.js';

export const logInAction = (data: IUser) => {
    let answerData;
    const { name, password } = data;
    const foundUser = users.find(item => item.name === name);
    if (!foundUser) {
        const index = new Date().getTime();
        users.push({ name, password, index });
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
    return answerData
}