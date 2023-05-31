import {  Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from '../../@types/interfaces/socket';
import { socketIo } from '../..';

function socketConnection(socket:Socket<ServerToClientEvents, ClientToServerEvents>) {
  console.log(`Socket ${socket.id} has connected.`);

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} has disconnected.`);
  });
}

export function notifyToClient(message:string) {
  socketIo.emit('notify', message);
}

export function SocketInit() {
  socketIo.on('connection', (socket) => {
    socketConnection(socket);
  });
}
