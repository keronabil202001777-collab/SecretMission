import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// Serve static frontend build if dist folder exists
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

interface Player {
  id: string;
  socketId: string;
  name: string;
  color: string;
  sticker: string;
  isHost: boolean;
  score: number;
  drinksTaken: number;
  isDrinking: boolean;
}

interface Room {
  code: string;
  hostSocketId: string;
  players: Player[];
  intensity: string;
  activeGames: string[];
  secretMissionsEnabled: boolean;
  currentRound: number;
  currentGameId?: string;
}

const rooms = new Map<string, Room>();

io.on('connection', (socket: Socket) => {
  console.log(`[Socket Connected] ${socket.id}`);

  // Create Room
  socket.on('create-room', (data: { code: string; hostPlayer: Omit<Player, 'socketId'>; intensity: string; activeGames: string[] }) => {
    const room: Room = {
      code: data.code,
      hostSocketId: socket.id,
      players: [{ ...data.hostPlayer, socketId: socket.id, isHost: true }],
      intensity: data.intensity,
      activeGames: data.activeGames,
      secretMissionsEnabled: true,
      currentRound: 1,
    };
    rooms.set(data.code, room);
    socket.join(data.code);
    socket.emit('room-updated', room);
    console.log(`[Room Created] ${data.code} by ${data.hostPlayer.name}`);
  });

  // Join Room
  socket.on('join-room', (data: { code: string; player: Omit<Player, 'socketId'> }) => {
    const room = rooms.get(data.code);
    if (!room) {
      socket.emit('error-message', 'الكود غير صحيح أو الروم مش موجودة');
      return;
    }

    const newPlayer: Player = {
      ...data.player,
      socketId: socket.id,
      isHost: false,
    };

    room.players.push(newPlayer);
    socket.join(data.code);
    io.to(data.code).emit('room-updated', room);
    console.log(`[Player Joined] ${data.player.name} -> ${data.code}`);
  });

  // Start Game
  socket.on('start-game', (code: string) => {
    const room = rooms.get(code);
    if (!room) return;
    io.to(code).emit('game-started');
  });

  // Drawing Canvas Broadcast
  socket.on('draw-stroke', (data: { code: string; x: number; y: number; color: string; isStart: boolean }) => {
    socket.to(data.code).emit('receive-stroke', data);
  });

  // Trigger Secret Mission Verification
  socket.on('trigger-secret-mission', (data: { code: string; targetPlayerId: string; attempterName: string; missionText: string }) => {
    const room = rooms.get(data.code);
    if (!room) return;
    const target = room.players.find(p => p.id === data.targetPlayerId);
    if (target) {
      io.to(target.socketId).emit('receive-secret-verification', {
        fromPlayerId: socket.id,
        attempterName: data.attempterName,
        missionText: data.missionText,
      });
    }
  });

  // Respond Secret Mission Verification
  socket.on('respond-secret-verification', (data: { code: string; fromPlayerId: string; accepted: boolean }) => {
    io.to(data.fromPlayerId).emit('secret-verification-result', {
      accepted: data.accepted,
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    rooms.forEach((room, code) => {
      const idx = room.players.findIndex(p => p.socketId === socket.id);
      if (idx !== -1) {
        room.players.splice(idx, 1);
        if (room.players.length === 0) {
          rooms.delete(code);
        } else {
          io.to(code).emit('room-updated', room);
        }
      }
    });
  });
});

// SPA catch-all route to serve index.html for client-side routing
if (fs.existsSync(distPath)) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = Number(process.env.PORT) || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Server Ready] Fullstack game listening on port ${PORT}`);
});
