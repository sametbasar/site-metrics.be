import Chalk from 'chalk';
import { Server } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from './@types/interfaces/socket';

import app from './app';
import { SocketInit } from './utils/socket';

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(Chalk.green(`Listening: http://localhost:${port}`));
});


export const socketIo = new Server<ServerToClientEvents, ClientToServerEvents>(server, {
  cors: {
    origin: '*', // Allow any origin for testing purposes. This should be changed on production.
  },
});

SocketInit();

