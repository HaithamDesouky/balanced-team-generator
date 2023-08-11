import { Player } from './types';

export const createFairTeams = (
    playersInput: Player[]
): [Player[], Player[]] => {
    const players = [...playersInput];
    players.sort((a, b) => b.skillLevel - a.skillLevel);

    const team1: Player[] = [];
    const team2: Player[] = [];

    const middleIndex = Math.floor(players.length / 2);
    const strongerPlayers = players.slice(0, middleIndex);
    const weakerPlayers = players.slice(middleIndex);

    const applyVariation = (value: number, range: number): number => {
        const min = Math.max(1, value - range / 2);
        const max = Math.min(10, value + range / 2);
        const randomFactor = Math.random();
        const newValue = Math.floor(min + randomFactor * (max - min + 1));
        return newValue;
    };

    strongerPlayers.forEach((player) => {
        const team1SkillLevel =
            calculateTotalLevel(team1) + applyVariation(player.skillLevel, 3);
        const team2SkillLevel = calculateTotalLevel(team2);
        const team1FitnessLevel =
            calculateTotalFitness(team1) +
            applyVariation(player.fitnessLevel, 10);
        const team2FitnessLevel = calculateTotalFitness(team2);

        if (
            (team1.length <= team2.length ||
                (team1SkillLevel <= team2SkillLevel + 3 &&
                    team1FitnessLevel <= team2FitnessLevel + 10)) &&
            (Math.random() < 0.7 || team1SkillLevel <= team2SkillLevel + 2)
        ) {
            team1.push(player);
        } else {
            team2.push(player);
        }
    });

    weakerPlayers.forEach((player) => {
        const team2SkillLevel =
            calculateTotalLevel(team2) + applyVariation(player.skillLevel, 3);
        const team1SkillLevel = calculateTotalLevel(team1);
        const team2FitnessLevel =
            calculateTotalFitness(team2) +
            applyVariation(player.fitnessLevel, 10);
        const team1FitnessLevel = calculateTotalFitness(team1);

        if (
            (team2.length <= team1.length ||
                (team2SkillLevel <= team1SkillLevel + 3 &&
                    team2FitnessLevel <= team1FitnessLevel + 10)) &&
            (Math.random() < 0.7 || team2SkillLevel <= team1SkillLevel + 2)
        ) {
            team2.push(player);
        } else {
            team1.push(player);
        }
    });

    return [team1, team2];
};

const calculateTotalLevel = (team: Player[]): number => {
    return team.reduce((total, player) => total + player.skillLevel, 0);
};

const calculateTotalFitness = (team: Player[]): number => {
    return team.reduce((total, player) => total + player.fitnessLevel, 0);
};
