import { RawData } from 'ws';

export const handleMessage = (message: RawData) => {
    const requestData = JSON.parse(message.toString());
    const type = requestData.type;
    const data = JSON.parse(requestData.data);
    console.log(type, data);



    return 'answer';
};