import { MiniGameMeta } from '../data/games';

export interface Player {
  id: string;
  name: string;
  color: string;
  sticker: string;
  isHost: boolean;
  score: number;
  drinksTaken: number;
  isDrinking: boolean; // whether playing with Pepsi/drinks or pure fun
  currentMission?: {
    id: string;
    targetId: string;
    targetName: string;
    targetColor: string;
    targetSticker: string;
    text: string;
    completed: boolean;
    pendingVerification: boolean;
  };
}

export interface VerificationRequest {
  id: string;
  fromPlayerId: string;
  fromPlayerName: string;
  fromPlayerColor: string;
  fromPlayerSticker: string;
  toPlayerId: string;
  missionText: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export type IntensityLevel = 'lite' | 'medium' | 'hardcore';

export interface GameRoom {
  code: string;
  hostId: string;
  players: Player[];
  intensity: IntensityLevel;
  penaltyType: 'pepsi' | 'ahkam' | 'both';
  activeGames: string[]; // selected mini game ids
  secretMissionsEnabled: boolean;
  currentRound: number;
  totalRounds: number;
  currentGame?: MiniGameMeta;
  activeVerification?: VerificationRequest;
}

export const CANDY_COLORS = [
  '#FF2A85', // Neon Pink
  '#CCFF00', // Electric Lime
  '#00E5FF', // Cyan
  '#FF6B00', // Orange
  '#8B5CF6', // Purple
  '#FFE600', // Yellow
  '#00FF88', // Emerald
  '#FF88CC', // Bubblegum
  '#2563EB', // Electric Blue
  '#EF4444', // Crimson
];

export const STICKER_AVATARS = [
  '🐸', '🦊', '🦄', '🐙', '🦖', '🐼', '🦩', '🐯',
  '🐳', '🦥', '🦜', '🐨', '🦁', '🐷', '👽', '🦆',
];
