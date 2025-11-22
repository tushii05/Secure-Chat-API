import http from 'http';
import app from './app';
import attachSockets from './sockets';
import config from './config';
import prisma from './prismaClient';

async function start() {
  try {
    await prisma.$connect();
    console.log("Connected to DB");

    const server = http.createServer(app);

    attachSockets(server);
    console.log("Socket.io attached");

    server.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });

  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
}

start();
