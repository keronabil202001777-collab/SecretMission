import React, { useState, useEffect } from 'react';
import { GameRoom, Player, IntensityLevel, VerificationRequest } from './types';
import { MINI_GAMES, CAFE_SECRET_MISSIONS, MiniGameMeta } from './data/games';
import { Header } from './components/Header';
import { LandingView } from './components/LandingView';
import { JoinView } from './components/JoinView';
import { IntensityView } from './components/IntensityView';
import { ProfileSetupView } from './components/ProfileSetupView';
import { LobbyView } from './components/LobbyView';
import { GameTransitionView } from './components/GameTransitionView';
import { ActiveGameHUD } from './components/ActiveGameHUD';
import { SecretMissionSheet } from './components/SecretMissionSheet';
import { TargetVerificationModal } from './components/TargetVerificationModal';
import { RoundResultsCard } from './components/RoundResultsCard';
import { ScoreboardModal } from './components/ScoreboardModal';

export function App() {
  const [view, setView] = useState<
    'landing' | 'join' | 'intensity' | 'profile' | 'lobby' | 'game-transition' | 'active-game' | 'round-results'
  >('landing');

  const [isHosting, setIsHosting] = useState(false);
  const [tempIntensity, setTempIntensity] = useState<IntensityLevel>('lite');
  const [isSecretSheetOpen, setIsSecretSheetOpen] = useState(false);
  const [isScoreboardOpen, setIsScoreboardOpen] = useState(false);
  const [lastLoserId, setLastLoserId] = useState<string | null>(null);
  const [loserReason, setLoserReason] = useState<string | null>(null);

  // Active game room state
  const [room, setRoom] = useState<GameRoom>({
    code: 'CZYS',
    hostId: 'p-1',
    players: [],
    intensity: 'lite',
    penaltyType: 'pepsi',
    activeGames: MINI_GAMES.map(g => g.id),
    secretMissionsEnabled: true,
    currentRound: 1,
    totalRounds: 15,
  });

  // Current local player
  const [currentPlayer, setCurrentPlayer] = useState<Player>({
    id: 'p-1',
    name: 'كيرو',
    color: '#CCFF00',
    sticker: '🐸',
    isHost: true,
    score: 0,
    drinksTaken: 0,
    isDrinking: true,
  });

  // Active verification request modal
  const [verificationRequest, setVerificationRequest] = useState<VerificationRequest | null>(null);

  // Generate random 4-letter room code
  const generateRoomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    let res = '';
    for (let i = 0; i < 4; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  // Helper to generate a single new secret mission for a player
  const getNewSecretMission = (playerId: string, playerList: Player[]) => {
    const targets = playerList.filter(o => o.id !== playerId);
    const target = targets.length > 0 ? targets[Math.floor(Math.random() * targets.length)] : playerList[0];
    const template = CAFE_SECRET_MISSIONS[Math.floor(Math.random() * CAFE_SECRET_MISSIONS.length)];
    const missionText = template.template.replace(/\[TARGET\]/g, target ? target.name : 'صاحبك');

    return {
      id: `${template.id}-${Date.now()}`,
      targetId: target ? target.id : 'target-1',
      targetName: target ? target.name : 'صاحبك',
      targetColor: target ? target.color : '#CCFF00',
      targetSticker: target ? target.sticker : '🐸',
      text: missionText,
      completed: false,
      pendingVerification: false,
    };
  };

  // Assign café-safe secret missions to players
  const assignSecretMissions = (playerList: Player[]) => {
    if (playerList.length < 2) return playerList;

    return playerList.map((p) => ({
      ...p,
      currentMission: getNewSecretMission(p.id, playerList),
    }));
  };

  // Intensity & Rounds selected by Host
  const handleSelectIntensity = (intensity: IntensityLevel, totalRounds: number = 15) => {
    setTempIntensity(intensity);
    setRoom(r => ({
      ...r,
      intensity,
      totalRounds,
      code: generateRoomCode(),
    }));
    setView('profile');
  };

  // Cycle rounds in lobby: 15 -> 30 -> 45 -> 15
  const handleCycleRounds = () => {
    setRoom(r => ({
      ...r,
      totalRounds: r.totalRounds === 15 ? 30 : r.totalRounds === 30 ? 45 : 15,
    }));
  };

  // Randomize mini-games with NO consecutive repeats!
  const pickRandomGame = (lastGameId?: string): MiniGameMeta => {
    const activeList = MINI_GAMES.filter(g => room.activeGames.includes(g.id));
    if (activeList.length === 0) return MINI_GAMES[0];
    if (activeList.length === 1) return activeList[0];

    // Exclude lastGameId so no consecutive mini games after each other
    const candidates = activeList.filter(g => g.id !== lastGameId);
    const pool = candidates.length > 0 ? candidates : activeList;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  // Host Flow start
  const handleHostClick = () => {
    setIsHosting(true);
    setView('intensity');
  };

  // Join Flow start
  const handleJoinClick = () => {
    setIsHosting(false);
    setView('join');
  };

  // Code entered in Join View
  const handleJoinCode = (enteredCode: string) => {
    setRoom(r => ({ ...r, code: enteredCode }));
    setView('profile');
  };

  // Profile setup completed
  const handleProfileComplete = (profile: { name: string; color: string; sticker: string; isDrinking: boolean }) => {
    const myId = isHosting ? 'host-1' : `player-${Date.now()}`;
    const newPlayer: Player = {
      id: myId,
      name: profile.name,
      color: profile.color,
      sticker: profile.sticker,
      isHost: isHosting,
      score: 0,
      drinksTaken: 0,
      isDrinking: profile.isDrinking,
    };

    setCurrentPlayer(newPlayer);

    // Initial players in room
    let initialPlayers = [newPlayer];

    // If hosting, pre-populate 2-3 sample friends for instant café testing!
    if (isHosting) {
      initialPlayers.push(
        {
          id: 'p-alex',
          name: 'نبيل',
          color: '#00E5FF',
          sticker: '🐳',
          isHost: false,
          score: 1,
          drinksTaken: 1,
          isDrinking: true,
        },
        {
          id: 'p-maya',
          name: 'مريم',
          color: '#FF2A85',
          sticker: '🦩',
          isHost: false,
          score: 2,
          drinksTaken: 0,
          isDrinking: true,
        }
      );
    }

    const withMissions = assignSecretMissions(initialPlayers);
    const myUpdated = withMissions.find(p => p.id === myId) || newPlayer;

    setCurrentPlayer(myUpdated);
    setRoom(r => ({
      ...r,
      hostId: isHosting ? myId : r.hostId,
      players: withMissions,
    }));

    setView('lobby');
  };

  // Add simulated friend player
  const handleAddBotPlayer = () => {
    const names = ['عمر', 'سارة', 'كريم', 'يوسف', 'نور'];
    const stickers = ['🦁', '🦊', '🦖', '🐼', '🐯'];
    const colors = ['#FFE600', '#FF6B00', '#00FF88', '#FF88CC', '#8B5CF6'];

    const idx = room.players.length % names.length;
    const botPlayer: Player = {
      id: `bot-${Date.now()}`,
      name: names[idx],
      color: colors[idx],
      sticker: stickers[idx],
      isHost: false,
      score: 0,
      drinksTaken: 0,
      isDrinking: true,
    };

    const updated = assignSecretMissions([...room.players, botPlayer]);
    setRoom(r => ({ ...r, players: updated }));
    const myUpdated = updated.find(p => p.id === currentPlayer.id);
    if (myUpdated) setCurrentPlayer(myUpdated);
  };

  // Start game from Lobby (Randomized first game!)
  const handleStartGame = () => {
    const firstGame = pickRandomGame();
    setRoom(r => ({
      ...r,
      currentRound: 1,
      currentGame: firstGame,
    }));
    setView('game-transition');
  };

  // Next round (Randomized next game with NO consecutive duplicates!)
  const handleNextRound = () => {
    const nextGame = pickRandomGame(room.currentGame?.id);
    setRoom(r => ({
      ...r,
      currentRound: r.currentRound + 1,
      currentGame: nextGame,
    }));
    setView('game-transition');
  };

  // Finish mini-game round
  const handleFinishGameRound = (loserId?: string, reason?: string) => {
    if (loserId) {
      setLastLoserId(loserId);
    } else {
      const candidates = room.players.filter(p => p.id !== currentPlayer.id);
      const randomLoser = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : currentPlayer;
      setLastLoserId(randomLoser.id);
    }
    if (reason) setLoserReason(reason);
    else setLoserReason(null);
    setView('round-results');
  };

  // Reroll secret mission if player wants a different task
  const handleRerollMission = () => {
    const nextMission = getNewSecretMission(currentPlayer.id, room.players);
    setCurrentPlayer(p => ({ ...p, currentMission: nextMission }));
  };

  // Get next mission upon completion
  const handleGetNewMission = () => {
    const nextMission = getNewSecretMission(currentPlayer.id, room.players);
    setCurrentPlayer(p => ({ ...p, currentMission: nextMission }));
  };

  // Trigger secret mission execution
  const handleExecuteSecretMission = () => {
    if (!currentPlayer.currentMission) return;

    // Set pending on current player
    setCurrentPlayer(p => ({
      ...p,
      currentMission: p.currentMission
        ? { ...p.currentMission, pendingVerification: true }
        : undefined,
    }));

    // Trigger verification alert modal
    setVerificationRequest({
      id: `verif-${Date.now()}`,
      fromPlayerId: currentPlayer.id,
      fromPlayerName: currentPlayer.name,
      fromPlayerColor: currentPlayer.color,
      fromPlayerSticker: currentPlayer.sticker,
      toPlayerId: currentPlayer.currentMission.targetId,
      missionText: currentPlayer.currentMission.text,
      status: 'pending',
    });
  };

  // Respond to verification
  const handleRespondVerification = (accepted: boolean) => {
    setVerificationRequest(null);

    if (accepted) {
      // Mission succeeded! Player earns +1 score AND immediately gets their NEXT secret mission!
      const newMission = getNewSecretMission(currentPlayer.id, room.players);
      setCurrentPlayer(p => ({
        ...p,
        score: p.score + 1,
        currentMission: newMission,
      }));
      setRoom(r => ({
        ...r,
        players: r.players.map(p =>
          p.id === currentPlayer.id
            ? { ...p, score: p.score + 1, currentMission: newMission }
            : p
        ),
      }));
    } else {
      // Mission rejected
      setCurrentPlayer(p => ({
        ...p,
        currentMission: p.currentMission
          ? { ...p.currentMission, pendingVerification: false }
          : undefined,
      }));
    }
  };

  // Host score adjustment
  const handleUpdateScore = (playerId: string, delta: number) => {
    setRoom(r => ({
      ...r,
      players: r.players.map(p =>
        p.id === playerId ? { ...p, score: Math.max(0, p.score + delta) } : p
      ),
    }));
    if (currentPlayer.id === playerId) {
      setCurrentPlayer(p => ({ ...p, score: Math.max(0, p.score + delta) }));
    }
  };

  // Host drink logging
  const handleAddDrink = (playerId: string) => {
    setRoom(r => ({
      ...r,
      players: r.players.map(p =>
        p.id === playerId ? { ...p, drinksTaken: p.drinksTaken + 1 } : p
      ),
    }));
    if (currentPlayer.id === playerId) {
      setCurrentPlayer(p => ({ ...p, drinksTaken: p.drinksTaken + 1 }));
    }
  };

  // Host kicks a player from room
  const handleKickPlayer = (playerId: string) => {
    const remaining = room.players.filter(p => p.id !== playerId);
    let myUpdated = currentPlayer;
    if (currentPlayer.currentMission?.targetId === playerId) {
      const newMission = getNewSecretMission(currentPlayer.id, remaining);
      myUpdated = { ...currentPlayer, currentMission: newMission };
      setCurrentPlayer(myUpdated);
    }
    setRoom(r => ({
      ...r,
      players: remaining.map(p =>
        p.id === myUpdated.id
          ? myUpdated
          : p.currentMission?.targetId === playerId
          ? { ...p, currentMission: getNewSecretMission(p.id, remaining) }
          : p
      ),
    }));
  };

  return (
    <div className="relative min-h-screen bg-darkBg text-white bg-ambient-glow font-arabic overflow-x-hidden">
      
      {/* Universal Top Header (Hidden on landing page to avoid duplicate headers) */}
      {view !== 'landing' && (
        <Header
          roomCode={room.code}
          playerAvatar={
            view !== 'join' && view !== 'intensity'
              ? { color: currentPlayer.color, sticker: currentPlayer.sticker, name: currentPlayer.name }
              : undefined
          }
          onReset={() => setView('landing')}
          onOpenScoreboard={() => setIsScoreboardOpen(true)}
        />
      )}

      {/* VIEW 1: LANDING (Matching user's screenshot) */}
      {view === 'landing' && (
        <LandingView
          onJoinClick={handleJoinClick}
          onHostClick={handleHostClick}
        />
      )}

      {/* VIEW 2: JOIN WITH CODE */}
      {view === 'join' && (
        <JoinView
          onBack={() => setView('landing')}
          onJoin={handleJoinCode}
          onGoToHost={handleHostClick}
        />
      )}

      {/* VIEW 3: INTENSITY SELECTOR */}
      {view === 'intensity' && (
        <IntensityView
          onBack={() => setView('landing')}
          onSelect={handleSelectIntensity}
        />
      )}

      {/* VIEW 4: PROFILE SETUP ("HELLO MY NAME IS" BADGE) */}
      {view === 'profile' && (
        <ProfileSetupView
          isHost={isHosting}
          onBack={() => setView(isHosting ? 'intensity' : 'join')}
          onComplete={handleProfileComplete}
        />
      )}

      {/* VIEW 5: MASTER LOBBY WITH QR & 33 GAMES */}
      {view === 'lobby' && (
        <LobbyView
          room={room}
          currentPlayer={currentPlayer}
          onStartGame={handleStartGame}
          onCycleRounds={handleCycleRounds}
          onKickPlayer={handleKickPlayer}
          onOpenScoreboard={() => setIsScoreboardOpen(true)}
          onToggleSecretMissions={() =>
            setRoom(r => ({ ...r, secretMissionsEnabled: !r.secretMissionsEnabled }))
          }
          onUpdateActiveGames={gameIds => setRoom(r => ({ ...r, activeGames: gameIds }))}
          onChangeLook={() => setView('profile')}
          onAddBotPlayer={handleAddBotPlayer}
        />
      )}

      {/* VIEW 6: GAME TRANSITION "NEXT UP" CARD */}
      {view === 'game-transition' && room.currentGame && (
        <GameTransitionView
          game={room.currentGame}
          roundNumber={room.currentRound}
          totalRounds={room.totalRounds}
          roomCode={room.code}
          onReady={() => setView('active-game')}
        />
      )}

      {/* VIEW 7: ACTIVE MINI-GAME HUD */}
      {view === 'active-game' && room.currentGame && (
        <ActiveGameHUD
          game={room.currentGame}
          roundNumber={room.currentRound}
          totalRounds={room.totalRounds}
          roomCode={room.code}
          players={room.players}
          currentPlayer={currentPlayer}
          onOpenSecretMission={() => setIsSecretSheetOpen(true)}
          onFinishGameRound={handleFinishGameRound}
        />
      )}

      {/* VIEW 8: ROUND RESULTS */}
      {view === 'round-results' && (
        <RoundResultsCard
          roundNumber={room.currentRound}
          totalRounds={room.totalRounds}
          loserPlayer={room.players.find(p => p.id === (lastLoserId || room.players[0]?.id)) || room.players[0]}
          currentPlayer={currentPlayer}
          penaltySips={room.currentGame?.penaltySips || 2}
          loserReason={loserReason || undefined}
          onNextRound={handleNextRound}
        />
      )}

      {/* SLIDING BOTTOM SHEET: SECRET MISSION */}
      <SecretMissionSheet
        isOpen={isSecretSheetOpen}
        onClose={() => setIsSecretSheetOpen(false)}
        mission={currentPlayer.currentMission}
        onExecute={handleExecuteSecretMission}
        onReroll={handleRerollMission}
        onGetNewMission={handleGetNewMission}
      />

      {/* TARGET INSTANT VERIFICATION MODAL */}
      {verificationRequest && (
        <TargetVerificationModal
          request={verificationRequest}
          onRespond={handleRespondVerification}
        />
      )}

      {/* MASTER SCOREBOARD & PLAYER MANAGEMENT MODAL */}
      <ScoreboardModal
        isOpen={isScoreboardOpen}
        onClose={() => setIsScoreboardOpen(false)}
        players={room.players}
        currentPlayer={currentPlayer}
        isHost={currentPlayer.isHost}
        onUpdateScore={handleUpdateScore}
        onAddDrink={handleAddDrink}
        onKickPlayer={handleKickPlayer}
      />

    </div>
  );
}

export default App;
