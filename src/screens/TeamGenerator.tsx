import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import useThemePalette from 'src/components/hooks/useThemePalette';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createFairTeams } from 'src/helper/teamCreation';
import { ColorPalette, Player } from 'src/helper/types';
import { RootState } from 'src/state/store';
import { updateNextGame } from 'src/state/playerSlice';

const styles = (colorPalette: ColorPalette) =>
    StyleSheet.create({
        baseText: {
            marginBottom: 8
        },
        titleText: {
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: 10,
            marginBottom: 10,
            textAlign: 'left'
        },
        header: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
            backgroundColor: colorPalette.contrast,
            color: colorPalette.surface,
            padding: 8
        },
        skillLevelText: {
            fontSize: 18
        },

        button: {
            backgroundColor: 'blue',
            padding: 10,
            borderRadius: 5,
            marginTop: 10,
            alignSelf: 'center'
        },

        buttonText: {
            color: 'white',
            fontWeight: 'bold'
        }
    });

const countPositions = (team: Player[]): Record<string, number> => {
    const positionCounts: Record<string, number> = {};
    team.forEach((player) => {
        if (positionCounts[player.position]) {
            positionCounts[player.position]++;
        } else {
            positionCounts[player.position] = 1;
        }
    });
    return positionCounts;
};

export const TeamGenerator: React.FC = () => {
    const dispatch = useDispatch();
    const nextGame = useSelector((state: RootState) => state.players.nextGame);
    const [teams, setTeams] = useState<[Player[], Player[]]>(
        createFairTeams(nextGame)
    );
    const [showTeamRatings, setShowTeamRatings] = useState(true);

    const colorPalette = useThemePalette();
    const [colorTeamSkill, setColorTeamSkill] = useState<number>(0);
    const [colorTeamFitness, setColorTeamFitness] = useState<number>(0);
    const [whiteTeamSkill, setWhiteTeamSkill] = useState<number>(0);
    const [whiteTeamFitness, setWhiteTeamFitness] = useState<number>(0);

    useEffect(() => {
        // Check if the nextGame array has changed and regenerate teams if so
        setTeams(createFairTeams(nextGame));
        console.log({ nextGame });
    }, [nextGame]);

    useEffect(() => {
        // Calculate the skill levels of the Color and White teams
        const colorSkill = teams[0].reduce((total, player) => {
            return (total += player.skillLevel);
        }, 0);
        const whiteSkill = teams[1].reduce(
            (total, player) => (total += player.skillLevel),
            0
        );
        setColorTeamSkill(colorSkill);
        setWhiteTeamSkill(whiteSkill);
        // Calculate the skill levels of the Color and White teams
        const colorFitness = teams[0].reduce((total, player) => {
            return (total += player.fitnessLevel);
        }, 0);
        const whiteFitness = teams[1].reduce(
            (total, player) => (total += player.fitnessLevel),
            0
        );
        setColorTeamFitness(colorFitness);
        setWhiteTeamFitness(whiteFitness);
    }, [teams]);

    const handleRegenerateTeams = () => {
        setTeams(createFairTeams(nextGame));
    };

    const handleClearTeams = async () => {
        setTeams([[], []]);
        dispatch(updateNextGame([]));
        await AsyncStorage.removeItem('NextGame');
    };

    return (
        <SafeAreaView>
            <Text style={styles(colorPalette).header}>Team Generator</Text>
            {nextGame.length === 0 && (
                <Text
                    style={{
                        backgroundColor: colorPalette.tertiary,
                        margin: 'auto',
                        width: '90%',
                        alignSelf: 'center',
                        padding: 5,
                        borderRadius: 2,
                        textAlign: 'center'
                    }}
                >
                    Go to the player list and select players for the next game.
                </Text>
            )}

            {teams[0].length > 0 && teams[1].length > 0 && (
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginBottom: 10,
                        width: '100%',
                        justifyContent: 'space-around'
                    }}
                >
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={styles(colorPalette).titleText}>
                                Color:
                            </Text>
                        </View>
                        {teams[0].map((player) => (
                            <Text
                                style={styles(colorPalette).baseText}
                                key={player.name}
                            >
                                {player.name}
                            </Text>
                        ))}
                    </View>
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={styles(colorPalette).titleText}>
                                White:
                            </Text>
                        </View>
                        {teams[1].map((player) => (
                            <Text
                                style={styles(colorPalette).baseText}
                                key={player.name}
                            >
                                {player.name}
                            </Text>
                        ))}
                    </View>
                </View>
            )}

            <Text
                style={{
                    width: '100%',
                    textAlign: 'center',
                    display:
                        nextGame.length === 0 || !showTeamRatings
                            ? 'none'
                            : 'flex'
                }}
            >
                Breakdown
            </Text>
            <View
                style={{
                    display:
                        nextGame.length === 0 || !showTeamRatings
                            ? 'none'
                            : 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginBottom: 20
                }}
            >
                <View>
                    <Text>Color Team</Text>
                    <Text>Skill Rating: {colorTeamSkill}</Text>
                    <Text>Fitness Rating: {colorTeamFitness}</Text>
                    {Object.entries(countPositions(teams[0])).map(
                        ([position, count]) => (
                            <Text key={position}>
                                {position}: {count}
                            </Text>
                        )
                    )}
                </View>
                <View>
                    <Text>White Team</Text>
                    <Text>Skill Rating: {whiteTeamSkill}</Text>
                    <Text>Fitness Rating: {whiteTeamFitness}</Text>
                    {Object.entries(countPositions(teams[1])).map(
                        ([position, count]) => (
                            <Text key={position}>
                                {position}: {count}
                            </Text>
                        )
                    )}
                </View>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                    display: nextGame.length === 0 ? 'none' : 'flex'
                }}
            >
                <Text>Show Team Ratings</Text>
                <Switch
                    value={showTeamRatings}
                    onValueChange={setShowTeamRatings}
                />
            </View>
            <View
                style={{
                    display: nextGame.length === 0 ? 'none' : 'flex'
                }}
            >
                <Pressable
                    style={{
                        backgroundColor: colorPalette.contrast,
                        width: '100%',
                        borderRadius: 6,
                        padding: 10,
                        marginBottom: 10
                    }}
                    onPress={handleRegenerateTeams}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            color: colorPalette.surface
                        }}
                    >
                        Regenerate Teams
                    </Text>
                </Pressable>
                <Pressable
                    style={{
                        backgroundColor: colorPalette.tertiary,
                        width: '100%',
                        borderRadius: 6,
                        padding: 10,
                        marginBottom: 10
                    }}
                    onPress={handleClearTeams}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            color: colorPalette.contrast
                        }}
                    >
                        Clear Teams
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};
