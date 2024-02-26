import { ICell, IRoom, IShip } from '../types/interface-types.js';
import { rooms } from './db.js';
import { updateWinnersAction } from './winners.js';
import { deleteRoomAction } from './room.js';

export const createGameAction = (currentRoom: IRoom) => {
    const gameId = new Date().getTime();
    currentRoom.gameId = gameId;
    currentRoom.roomUsers.forEach(user => {
        const resData = { idGame: gameId, idPlayer: user.index };
        const response = { type: 'create_game', id: 0, data: JSON.stringify(resData) };
        if (user.ws) user.ws.send(JSON.stringify(response));
    });
};

const parseShips = (ships: IShip[]) => {
    return ships.map(ship => {
        const cells: ICell[] = [];
        for (let i = 0; i < ship.length; i++) {
            if (ship.direction) cells.push({ x: ship.position.x, y: ship.position.y + i });
            else cells.push({ x: ship.position.x + i, y: ship.position.y });
        }
        return {
            cells,
            shipStart: { x: ship.position.x, y: ship.position.y },
            direction: ship.direction,
            length: ship.length
        };
    });
};

export const addShipsAction = (gameId: number, indexPlayer: number, ships: IShip[]) => {
    const currentRoom = rooms.find(room => room.gameId === gameId);
    if (currentRoom) {
        currentRoom.currentUserId = indexPlayer;
        const roomUsers = currentRoom.roomUsers;
        roomUsers.forEach(user => {
            if (user.index === indexPlayer) {
                user.ships = ships;
                user.parsedShips = parseShips(ships);
            }
        });
        if (roomUsers.every(user => user.ships.length)) {
            roomUsers.forEach(user => {
                const resData = { currentPlayerIndex: indexPlayer, ships: user.ships };
                const response = { type: 'start_game', id: 0, data: JSON.stringify(resData) };
                if (user.ws) {
                    user.ws.send(JSON.stringify(response));
                }
            });
            roomUsers.forEach(user => {
                const resData = { currentPlayer: indexPlayer };
                const response = { type: 'turn', id: 0, data: JSON.stringify(resData) };
                if (user.ws) {
                    user.ws.send(JSON.stringify(response));
                }
            });
        }
    }
};

export const attackAction = (gameId: number, indexPlayer: number, x: number, y: number) => {
    const currentRoom = rooms.find(room => room.gameId === gameId);
    if (currentRoom?.currentUserId !== indexPlayer) return;
    if (currentRoom) {
        const roomUsers = currentRoom.roomUsers;
        const player = roomUsers.find(user => user.index === indexPlayer);
        const enemy = roomUsers.find(user => user.index !== indexPlayer);
        let nextPlayerId: number | undefined;
        let result = '';
        let wreckedShip;
        let missedAroundCells = [];
        if (enemy && enemy.parsedShips) {
            wreckedShip = enemy.parsedShips.find(ship => !!(ship.cells.find((cell: ICell) => cell.x === x && cell.y === y)));

            if (wreckedShip) {
                nextPlayerId = player?.index;
                const targetIndex = wreckedShip.cells.findIndex((cell: ICell) => cell.x === x && cell.y === y);
                wreckedShip.cells.splice(targetIndex, 1);
                if (wreckedShip.cells.length === 0) {
                    result = 'killed';
                    if (wreckedShip.direction) {
                        for (let i = 0; i < wreckedShip.length; i++) {
                            missedAroundCells.push({ x: wreckedShip.shipStart.x - 1, y: wreckedShip.shipStart.y + i });
                            missedAroundCells.push({ x: wreckedShip.shipStart.x + 1, y: wreckedShip.shipStart.y + i });
                        }
                        missedAroundCells.push({ x: wreckedShip.shipStart.x - 1, y: wreckedShip.shipStart.y - 1 });
                        missedAroundCells.push({ x: wreckedShip.shipStart.x, y: wreckedShip.shipStart.y - 1 });
                        missedAroundCells.push({ x: wreckedShip.shipStart.x + 1, y: wreckedShip.shipStart.y - 1 });
                        missedAroundCells.push({
                            x: wreckedShip.shipStart.x - 1,
                            y: wreckedShip.shipStart.y + wreckedShip.length
                        });
                        missedAroundCells.push({
                            x: wreckedShip.shipStart.x,
                            y: wreckedShip.shipStart.y + wreckedShip.length
                        });
                        missedAroundCells.push({
                            x: wreckedShip.shipStart.x + 1,
                            y: wreckedShip.shipStart.y + wreckedShip.length
                        });
                    } else {
                        for (let i = 0; i < wreckedShip.length; i++) {
                            missedAroundCells.push({ x: wreckedShip.shipStart.x + i, y: wreckedShip.shipStart.y - 1 });
                            missedAroundCells.push({ x: wreckedShip.shipStart.x + i, y: wreckedShip.shipStart.y + 1 });
                        }
                        missedAroundCells.push({ x: wreckedShip.shipStart.x - 1, y: wreckedShip.shipStart.y - 1 });
                        missedAroundCells.push({ x: wreckedShip.shipStart.x - 1, y: wreckedShip.shipStart.y });
                        missedAroundCells.push({ x: wreckedShip.shipStart.x - 1, y: wreckedShip.shipStart.y + 1 });
                        missedAroundCells.push({
                            x: wreckedShip.shipStart.x + wreckedShip.length,
                            y: wreckedShip.shipStart.y - 1
                        });
                        missedAroundCells.push({
                            x: wreckedShip.shipStart.x + wreckedShip.length,
                            y: wreckedShip.shipStart.y
                        });
                        missedAroundCells.push({
                            x: wreckedShip.shipStart.x + wreckedShip.length,
                            y: wreckedShip.shipStart.y + 1
                        });
                    }
                    const killedShipId = enemy.parsedShips.indexOf(wreckedShip);
                    enemy.parsedShips.splice(killedShipId, 1);
                } else {
                    result = 'shot';
                }
            } else {
                result = 'miss';
                nextPlayerId = enemy?.index;
            }
            currentRoom.currentUserId = nextPlayerId
        }

        roomUsers.forEach(user => {
            const resData = { position: { x, y }, currentPlayer: player?.index, status: result };
            const response = { type: 'attack', id: 0, data: JSON.stringify(resData) };
            if (user.ws) {
                user.ws.send(JSON.stringify(response));
            }
        });
        roomUsers.forEach(user => {
            const resData = { currentPlayer: nextPlayerId };
            const response = { type: 'turn', id: 0, data: JSON.stringify(resData) };
            if (user.ws) {
                user.ws.send(JSON.stringify(response));
            }
        });
        missedAroundCells.forEach(cell => {
            roomUsers.forEach(user => {
                const resData = { position: { x: cell.x, y: cell.y }, currentPlayer: player?.index, status: 'miss' };
                const response = { type: 'attack', id: 0, data: JSON.stringify(resData) };
                if (user.ws) {
                    user.ws.send(JSON.stringify(response));
                }
            });
        });
        if (enemy?.parsedShips?.length === 0) {
            const currentPlayer = roomUsers.find(user => user.index === indexPlayer);
            if (currentPlayer) currentPlayer.wins += 1;
            roomUsers.forEach(user => {
                const resData = { winPlayer: player?.index };
                const response = { type: 'finish', id: 0, data: JSON.stringify(resData) };
                if (user.ws) {
                    user.ws.send(JSON.stringify(response));
                }
            });
            updateWinnersAction();
            deleteRoomAction(currentRoom.roomId)
        }


    }
};