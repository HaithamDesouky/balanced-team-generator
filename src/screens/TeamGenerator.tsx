import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Switch,
    Modal,
    TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import useThemePalette from 'src/components/hooks/useThemePalette';
import { createFairTeams } from 'src/helper/teamCreation';
import { ColorPalette, Player } from 'src/helper/types';
import { RootState } from 'src/state/store';
import { updateNextGame, updatePlayers } from 'src/state/playerSlice';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import EditableText from 'src/components/EditableText/EditableText';
import * as Clipboard from 'expo-clipboard';

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
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        },
        modalContent: {
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            width: '80%'
        },
        modalButtons: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: 20
        },
        textArea: {
            height: 300,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 8,
            padding: 15,
            fontSize: 16,
            textAlignVertical: 'top',
            backgroundColor: '#f9f9f9',
            marginBottom: 10
        },
        counter: {
            display: 'flex',
            flexDirection: 'column',
            fontSize: 14,
            color: '#666',
            textAlign: 'left'
        },
        label: {
            fontSize: 14
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
    const navigation = useNavigation();

    const { players: playersForStore, nextGame } = useSelector(
        (state: RootState) => state.players
    );
    const [teams, setTeams] = useState<[Player[], Player[]]>(
        createFairTeams(nextGame)
    );
    const [showTeamRatings, setShowTeamRatings] = useState(true);
    const [matchGeneratorWizardOpen, setMatchGeneratorWizardOpen] =
        useState(false);

    const [attendanceList, setAttendanceList] = useState('');
    const colorPalette = useThemePalette();
    const [colorTeamSkill, setColorTeamSkill] = useState<number>(0);
    const [colorTeamFitness, setColorTeamFitness] = useState<number>(0);
    const [whiteTeamSkill, setWhiteTeamSkill] = useState<number>(0);
    const [whiteTeamFitness, setWhiteTeamFitness] = useState<number>(0);
    const [successMessage, setSuccessMessage] = useState('');

    const findDuplicatePlayers = (arr: string[]) => {
        const countMap = new Map<string, number>();
        const duplicates = new Set<string>();

        arr.forEach((str) => {
            const normalized = normalizeName(str);
            countMap.set(normalized, (countMap.get(normalized) || 0) + 1);
            if (countMap.get(normalized)! > 1) {
                duplicates.add(normalized);
            }
        });

        return duplicates.size > 0 ? (
            <Text
                style={{ color: 'red', fontWeight: 'bold', textAlign: 'left' }}
            >
                WARNING: The following players are duplicated:{' '}
                {Array.from(duplicates).join(', ')}
            </Text>
        ) : null;
    };

    const cleanName = (name: string) => {
        // Strict cleaning for pasted content (removes all whitespace)
        return name.replace(
            /^[\s\u200B-\u200D\uFEFF\u0080-\uFFFF]+|[\s\u200B-\u200D\uFEFF\u0080-\uFFFF]+$/g,
            ''
        );
    };

    const handleTextChange = (text: string) => {
        // Detect paste operation (significant text change)
        if (Math.abs(text.length - attendanceList.length) > 1) {
            // Strict cleaning for pasted content
            const cleaned = text
                .split('\n')
                .map((line) => {
                    const match = line.match(/^\s*\d+[\.\s)]\s*(.+)/);
                    return match ? cleanName(match[1]) : null;
                })
                .filter((name) => name !== null && name !== '')
                .join('\n');

            setAttendanceList(cleaned);
        } else {
            // For manual typing - only remove completely empty lines
            // Preserve all whitespace and formatting during typing
            setAttendanceList(text);
        }
    };
    useEffect(() => {
        setTeams(createFairTeams(nextGame));
    }, [nextGame]);
    useEffect(() => {
        const colorSkill = teams[0].reduce((total, player) => {
            return (total += player.skillLevel);
        }, 0);
        const whiteSkill = teams[1].reduce(
            (total, player) => (total += player.skillLevel),
            0
        );
        setColorTeamSkill(colorSkill);
        setWhiteTeamSkill(whiteSkill);
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

    useEffect(() => {
        // Function to read clipboard content
        const fetchClipboardContent = async () => {
            try {
                const clipboardContent = await Clipboard.getStringAsync();

                const cleaned = clipboardContent
                    .split('\n')
                    .map((line) => {
                        const match = line.match(/^\s*\d+[\.\s)]\s*(.+)/);
                        return match ? cleanName(match[1]) : null;
                    })
                    .filter((name) => name !== null && name !== '')
                    .join('\n');
                setAttendanceList(cleaned); // Set clipboard content to the TextInput
            } catch (error) {
                console.error('Failed to fetch clipboard content:', error);
            }
        };

        fetchClipboardContent(); // Initialize with clipboard content
    }, [matchGeneratorWizardOpen]);

    const handleRegenerateTeams = () => {
        setTeams(createFairTeams(nextGame));
    };

    const handleClearTeams = async () => {
        setTeams([[], []]);
        dispatch(updateNextGame([]));
        await AsyncStorage.removeItem('NextGame');
    };

    const normalizeName = (name: string) =>
        name
            .normalize('NFD') // Decompose accented characters
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .trim() // Remove leading and trailing whitespace
            .toLowerCase(); // Case insensitive

    const handleTeamGenerationWizard = async () => {
        try {
            // Process attendance list
            const playersToMatch = attendanceList
                .split('\n')
                .map(normalizeName)
                .filter(Boolean);

            // Retrieve stored players
            const playersJSON = await AsyncStorage.getItem('Players');
            const existingPlayers: Player[] =
                JSON.parse(playersJSON || '[]') || [];

            const matchedPlayers: Player[] = [];
            const unmatchedNames: string[] = [];

            // Match existing players
            playersToMatch.forEach((attendanceName) => {
                const matchedPlayer = existingPlayers.find(
                    (player) => normalizeName(player.name) === attendanceName
                );

                matchedPlayer
                    ? matchedPlayers.push(matchedPlayer)
                    : unmatchedNames.push(attendanceName);
            });

            // Create new players for unmatched names
            if (unmatchedNames.length > 0) {
                const newPlayers: Player[] = unmatchedNames.map((name) => ({
                    name: name
                        .trim()
                        .toLowerCase()
                        .split(' ')
                        .filter(Boolean) // Remove empty parts caused by extra spaces
                        .map(
                            (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(' '),
                    position: 'DEF',
                    skillLevel: 5,
                    fitnessLevel: 5,
                    id: uuid.v4() as string
                }));

                const updatedPlayers = [...existingPlayers, ...newPlayers];

                await AsyncStorage.setItem(
                    'Players',
                    JSON.stringify(updatedPlayers)
                );
                dispatch(updatePlayers(updatedPlayers));

                // Add new players to matched list
                matchedPlayers.push(...newPlayers);

                setSuccessMessage(
                    `The following players have been created: ${newPlayers
                        .map((p) => p.name)
                        .join(', ')}`
                );

                // Auto-clear success message after 10 seconds
                setTimeout(() => setSuccessMessage(''), 10000);
            }

            // Store and update matched players for next game
            await AsyncStorage.setItem(
                'NextGame',
                JSON.stringify(matchedPlayers)
            );
            dispatch(updateNextGame(matchedPlayers));

            setMatchGeneratorWizardOpen(false);

            return matchedPlayers;
        } catch (error) {
            console.error('Error processing players:', error);
            return [];
        }
    };

    const getNumberOfPlayersToCreate = () => {
        let playersThatDontExist = 0;
        const playerNames = attendanceList
            .split('\n')
            .filter((name) => name.trim() !== '');

        playerNames.forEach((attendanceName) => {
            const matchedPlayer = playersForStore.find((player) => {
                console.log({
                    attendanceNameNormalized: normalizeName(attendanceName),
                    normalizeName: normalizeName(player.name)
                });
                return (
                    normalizeName(player.name) === normalizeName(attendanceName)
                );
            });

            if (!matchedPlayer) playersThatDontExist++;
        });

        return playersThatDontExist;
    };
    const matchGeneratorModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={matchGeneratorWizardOpen}
            >
                <View style={styles(colorPalette).modalContainer}>
                    <View style={styles(colorPalette).modalContent}>
                        <Text style={styles(colorPalette).label}>
                            Player Attendance:
                        </Text>
                        <Text style={{ opacity: 0.6, marginBottom: 8 }}>
                            Please make sure the names are exact as in your
                            player list
                        </Text>
                        <TextInput
                            style={styles(colorPalette).textArea}
                            multiline
                            numberOfLines={10}
                            onChangeText={handleTextChange}
                            value={attendanceList}
                            placeholder="Paste player list (1. Name, 2. Name...)"
                            placeholderTextColor="#999"
                        />
                        <Text style={styles(colorPalette).counter}>
                            {successMessage ? (
                                <Text>{successMessage}</Text>
                            ) : (
                                <>
                                    {findDuplicatePlayers(
                                        attendanceList
                                            .split('\n')
                                            .filter(
                                                (name) => name.trim() !== ''
                                            )
                                    )}
                                    <Text>
                                        New players:
                                        {getNumberOfPlayersToCreate()}
                                    </Text>
                                    <Text>
                                        Total players registered:
                                        {
                                            attendanceList
                                                .split('\n')
                                                .filter(
                                                    (name) => name.trim() !== ''
                                                ).length
                                        }
                                    </Text>
                                </>
                            )}
                        </Text>

                        <View style={styles(colorPalette).modalButtons}>
                            <Pressable
                                onPress={handleTeamGenerationWizard}
                                style={{
                                    backgroundColor: colorPalette.tertiary,
                                    width: '46%',
                                    borderRadius: 2,
                                    padding: 10
                                }}
                            >
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: colorPalette.contrast
                                    }}
                                >
                                    Save
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() =>
                                    setMatchGeneratorWizardOpen(false)
                                }
                                style={{
                                    backgroundColor: colorPalette.contrast,
                                    width: '46%',
                                    borderRadius: 2,
                                    padding: 10
                                }}
                            >
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: colorPalette.surface
                                    }}
                                >
                                    Cancel
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    if (nextGame.length < 2) {
        return (
            <SafeAreaView>
                <Text style={styles(colorPalette).header}>Team Generator</Text>
                <View style={{ padding: 8 }}>
                    <Text
                        style={{
                            backgroundColor: colorPalette.tertiary,
                            margin: 'auto',
                            alignSelf: 'center',
                            padding: 5,
                            borderRadius: 2,
                            textAlign: 'center'
                        }}
                    >
                        You have no players selected for the next game. Either
                        auto generate new teams with the attendance list or go
                        to the player list screen.
                    </Text>

                    <Pressable
                        style={{
                            backgroundColor: colorPalette.tertiary,
                            width: '100%',
                            borderRadius: 6,
                            padding: 10,
                            marginBottom: 10,
                            marginTop: 24
                        }}
                        onPress={() => {
                            setMatchGeneratorWizardOpen(true);
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                color: colorPalette.contrast
                            }}
                        >
                            Auto Generate Teams From List
                        </Text>
                    </Pressable>
                    <Pressable
                        style={{
                            backgroundColor: colorPalette.contrast,
                            width: '100%',
                            borderRadius: 6,
                            padding: 10,
                            marginTop: 24
                        }}
                        onPress={handleRegenerateTeams}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                color: colorPalette.surface
                            }}
                            onPress={() =>
                                navigation.navigate('Player List' as never)
                            }
                        >
                            Go to Player List Screen
                        </Text>
                    </Pressable>
                    {matchGeneratorModal()}
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView>
            <Text style={styles(colorPalette).header}>Team Generator</Text>
            <View style={{ padding: 8 }}>
                {nextGame.length < 2 && (
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
                        Go to the player list and select atleast players for the
                        next game.
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
                                    <EditableText defaultColor="Color" />
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
                                    <EditableText defaultColor="White" />
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
                        justifyContent: 'center',
                        marginBottom: 8,
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
                        <Text>Left Team</Text>
                        <Text>Skill Rating: {Number(colorTeamSkill)}</Text>
                        <Text>Fitness Rating: {Number(colorTeamFitness)}</Text>
                        {Object.entries(countPositions(teams[0])).map(
                            ([position, count]) => (
                                <Text key={position}>
                                    {position}: {count}
                                </Text>
                            )
                        )}
                    </View>
                    <View>
                        <Text>Right Team</Text>
                        <Text>Skill Rating: {Number(whiteTeamSkill)}</Text>
                        <Text>Fitness Rating: {Number(whiteTeamFitness)}</Text>
                        {Object.entries(countPositions(teams[1])).map(
                            ([position, count]) => (
                                <Text key={position}>
                                    {position}: {count}
                                </Text>
                            )
                        )}
                    </View>
                </View>
                <Text>Tip: Click on the team names to edit them!</Text>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                        marginBottom: 10,
                        display: nextGame.length === 0 ? 'none' : 'flex'
                    }}
                >
                    <Text style={{ marginRight: 8 }}>Show Team Ratings</Text>
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
                            backgroundColor: colorPalette.contrast,
                            width: '100%',
                            borderRadius: 6,
                            padding: 10,
                            marginBottom: 10
                        }}
                        onPress={() => {
                            setMatchGeneratorWizardOpen(true);
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                color: colorPalette.surface
                            }}
                        >
                            Auto Generate Teams From List
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
            </View>
            {matchGeneratorModal()}
        </SafeAreaView>
    );
};
