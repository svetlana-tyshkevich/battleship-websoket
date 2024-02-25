import { RawData } from 'ws';
import { logInAction } from './logIn.js';
import { addUserToRoomAction, createRoomAction, updateRoomStateAction } from './room.js';
import { updateWinnersAction } from './winners.js';
import { IUser } from '../types/interface-types.js';
import { createGameAction } from './game.js';

export const handleMessage = (message: RawData, currentUser: IUser | undefined) => {
    const requestData = JSON.parse(message.toString());
    const type = requestData.type;
    const data = requestData.data ? JSON.parse(requestData.data) : '';
    const responses = [];

    switch (type) {
        case 'reg': {
            const loginResponseData = logInAction(data);
            const updatedRoomsData = updateRoomStateAction();
            const updatedWinnersData = updateWinnersAction();
            responses.push({ type: 'reg', data: loginResponseData });
            responses.push({ type: 'update_room', data: updatedRoomsData });
            responses.push({ type: 'update_winners', data: updatedWinnersData });
            break;
        }
        case 'create_room': {
            if (currentUser) {
                const updatedRoomsData = createRoomAction(currentUser);
                responses.push({ type: 'update_room', data: updatedRoomsData });
            }
            break;
        }
        case 'add_user_to_room': {
            if (currentUser) {
                const updatedRoomsData = addUserToRoomAction(data, currentUser);
                responses.push({ type: 'update_room', data: updatedRoomsData });
                if (!updatedRoomsData.find(room => room.roomId === data.indexRoom)) {
                    const gameData = createGameAction(currentUser);
                    responses.push({ type: 'create_game', data: gameData });
                }

            }
            break;
        }

    }

    return responses;
};