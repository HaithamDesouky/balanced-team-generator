export const calculateTotalLevel = (team: Player[]): number => {
  return team.reduce((total, player) => total + player.level, 0);
};

export const createFairTeams = (players: Player[]): [Player[], Player[]] => {
  players.sort((a, b) => b.level - a.level);

  const team1: Player[] = [];
  const team2: Player[] = [];

  const middleIndex = Math.floor(players.length / 2);
  const strongerPlayers = players.slice(0, middleIndex);
  const weakerPlayers = players.slice(middleIndex);

  strongerPlayers.forEach((player) => {
    const randomFactor = Math.random();

    if (
      (team1.length <= team2.length &&
        calculateTotalLevel(team1) + player.level <=
          calculateTotalLevel(team2) + 3) ||
      (calculateTotalLevel(team1) <= calculateTotalLevel(team2) &&
        randomFactor < 0.7)
    ) {
      team1.push(player);
    } else {
      team2.push(player);
    }
  });

  weakerPlayers.forEach((player) => {
    const randomFactor = Math.random();
    if (
      (team1.length > team2.length &&
        calculateTotalLevel(team2) + player.level <=
          calculateTotalLevel(team1) + 3) ||
      (calculateTotalLevel(team1) > calculateTotalLevel(team2) &&
        randomFactor < 0.7)
    ) {
      team2.push(player);
    } else {
      team1.push(player);
    }
  });

  return [team1, team2];
};
