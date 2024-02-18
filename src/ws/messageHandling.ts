import { RawData } from 'ws';
import { logInAction } from './logIn.js';

export const handleMessage = (message: RawData) => {
    const requestData = JSON.parse(message.toString());
    const type = requestData.type;
    const data = JSON.parse(requestData.data);
    console.log(type, data);
    let answerData;

    switch (type) {
        case 'reg':
            answerData = logInAction(data);
            break;
        case 'create_room':

    }

    const answer = { type, id: 0, data: JSON.stringify(answerData) };
    return JSON.stringify(answer);
};