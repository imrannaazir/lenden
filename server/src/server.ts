/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import colors from 'colors';
import mongoose from 'mongoose';
import config from './app/config';
import { Server } from 'http';
import app from './app';

let server: Server;

// immediately invoked
(async () => {
  try {
    await mongoose.connect(config.db_connection_uri as string);

    server = app.listen(config.port, () => {
      console.log(colors.green.bold(`App listening on port : ${config.port}`));
    });
  } catch (error: any) {
    console.log(colors.red(error));
  }
})();

// handle unhandled rejection error
process.on('unhandledRejection', () => {
  console.log(`😈 unhandledRejection is detected , shutting down ...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// handle unhandled exception error
process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
