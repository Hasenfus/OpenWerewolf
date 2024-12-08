/*
  Copyright 2017-2018 James V. Craster
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
      http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License. 
*/

import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import session from 'express-session';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import { readFile } from 'node:fs/promises';
import { createConnection } from 'mysql2/promise';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

declare module 'express-session' {
  interface SessionData {
    userId: string;
    gameId: string;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface GameConfig {
  games: Array<{
    location: string;
    name: string;
  }>;
}

// Read config asynchronously
const loadConfig = async (): Promise<GameConfig> => {
  const configPath = join(__dirname, 'games', 'games.json');
  const configData = await readFile(configPath, 'utf-8');
  return JSON.parse(configData);
};

// Dynamic game imports
const loadGames = async (config: GameConfig) => {
  const configGameList = [];
  for (const game of config.games) {
    try {
      const module = await import(game.location);
      configGameList.push({
        constructor: module[game.name],
        name: game.name,
      });
    } catch (e) {
      console.log(`Non-critical warning, game is missing: ${game.name}`, e);
    }
  }
  return configGameList;
};

// Database connection
const createDbConnection = async () => {
  try {
    const connection = await createConnection({
      host: "localhost",
      user: "jcraster",
      password: "password",
      database: "OPENWEREWOLF"
    });
    return connection;
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
};

// Main application setup
const setupApp = async () => {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer);
  
  // Redis setup
  const RedisStore = connectRedis(session);
  const redisClient = new Redis();
  
  // Session middleware
  const sessionMiddleware = session({
    store: new RedisStore({ client: redisClient }) as session.Store,
    secret: "sakhasdjhasdkjhadkjahsd",
    resave: false,
    saveUninitialized: true,
  });

  // Apply session middleware to express
  app.use(sessionMiddleware);

  // Socket.IO middleware
  io.use((socket: Socket, next) => {
    const req = socket.request as Request;
    const res = {} as Response;
    sessionMiddleware(req, res, (err?: any) => {
      if (err) {
        next(err);
      } else {
        next();
      }
    });
  });

  return { app, httpServer, io };
};

// Main execution
const main = async () => {
  try {
    const config = await loadConfig();
    const configGameList = await loadGames(config);
    const { app, httpServer } = await setupApp();
    
    const port = 8081;
    httpServer.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

main();
