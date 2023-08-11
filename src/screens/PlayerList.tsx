import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Modal,
    TextInput,
    Pressable
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import { updateNextGame, updatePlayers } from 'src/state/playerSlice';
import type { RootState } from 'src/state/store';
import { ColorPalette, Player } from 'src/helper/types';
import useThemePalette from 'src/components/hooks/useThemePalette';
import Fontisto from 'react-native-vector-icons/Fontisto';
import * as IoniIcon from 'react-native-vector-icons/Ionicons';

export const PlayerList: React.FC = () => {
    const { players, nextGame } = useSelector(
        (state: RootState) => state.players
    );
    const [modalVisible, setModalVisible] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
    const [editedName, setEditedName] = useState('');
    const [editedLevel, setEditedLevel] = useState(1);
    const [editedPosition, setEditedPosition] = useState('');
    const [deletePlayer, setDeletePlayer] = useState<Player | null>(null);

    const dispatch = useDispatch();

    const colorPalette = useThemePalette();

    useEffect(() => {
        fetchPlayerList();
    }, []);

    const fetchPlayerList = async () => {
        try {
            const playersJSON = await AsyncStorage.getItem('Players');
            const savedPlayers: Player[] = JSON.parse(playersJSON || '[]');
            dispatch(updatePlayers(savedPlayers));

            const nextGame = await AsyncStorage.getItem('NextGame');
            const savedNextGame: Player[] = JSON.parse(nextGame || '[]');
            dispatch(updateNextGame(savedNextGame));
        } catch (error) {
            console.error('Error fetching player list:', error);
        }
    };

    const handleEditPlayer = (player: Player) => {
        setEditingPlayer(player);
        setEditedName(player.name);
        setEditedLevel(player.level);
        setEditedPosition(player.position);
        setModalVisible(true);
    };

    const handleSaveEdit = async () => {
        if (editingPlayer) {
            const updatedPlayers = players.map((player: Player) =>
                player.id === editingPlayer.id
                    ? {
                          ...player,
                          name: editedName,
                          level: editedLevel,
                          position: editedPosition
                      }
                    : player
            );
            await AsyncStorage.setItem(
                'Players',
                JSON.stringify(updatedPlayers)
            );
            dispatch(updatePlayers(updatedPlayers));
            setModalVisible(false);
        }
    };

    const handleCancelEdit = () => {
        setModalVisible(false);
    };

    const handleDeletePlayerModal = (player: Player) => {
        setDeletePlayer(player);
    };

    const handleDeletePlayer = async (playerId: string) => {
        try {
            const updatedPlayers = players.filter(
                (player: Player) => player.id !== playerId
            );
            await AsyncStorage.setItem(
                'Players',
                JSON.stringify(updatedPlayers)
            );
            dispatch(updatePlayers(updatedPlayers));
            setDeletePlayer(null);
            setModalVisible(false);
        } catch (error) {
            console.error('Error deleting player:', error);
        }
    };

    const getPlayerIcon = (position: string) => {
        switch (position) {
            case 'DEF':
                return 'shield';
            case 'ATT':
                return 'rocket-sharp';
            default:
                return 'shield';
        }
    };

    const handlePlayerParticipation = async (player: Player) => {
        try {
            const nextGame = await AsyncStorage.getItem('NextGame');
            let savedNextGame: Player[] = JSON.parse(nextGame || '[]');

            // Check if the player already exists in the nextGame array
            const playerIndex = savedNextGame.findIndex(
                (p) => p.id === player.id
            );

            if (playerIndex !== -1) {
                // Player exists, so remove them from the array
                savedNextGame = savedNextGame.filter((p) => p.id !== player.id);
            } else {
                // Player doesn't exist, so add them to the array
                savedNextGame.push(player);
            }

            await AsyncStorage.setItem(
                'NextGame',
                JSON.stringify(savedNextGame)
            );

            dispatch(updateNextGame(savedNextGame)); // Dispatch the action to update Redux state
            console.log({ savedNextGame });
        } catch (error) {
            console.error('Error participating player:', error);
        }
    };

    const handleCancelDelete = () => {
        setDeletePlayer(null);
        setModalVisible(false);
    };

    const deletePlayerModal = () => {
        if (!deletePlayer) return;
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={!!deletePlayer}
            >
                <View style={styles(colorPalette).modalContainer}>
                    <View style={styles(colorPalette).modalContent}>
                        <Text style={{ color: colorPalette.contrast }}>
                            {`Are you sure you want to delete ${deletePlayer.name}?`}
                        </Text>
                        <View style={styles(colorPalette).modalButtons}>
                            <Pressable
                                onPress={() =>
                                    handleDeletePlayer(deletePlayer.id)
                                }
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
                                    Delete
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={handleCancelDelete}
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

    const editPlayerModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles(colorPalette).modalContainer}>
                    <View style={styles(colorPalette).modalContent}>
                        <TextInput
                            style={styles(colorPalette).input}
                            placeholder="Name"
                            value={editedName}
                            onChangeText={setEditedName}
                        />
                        <Picker
                            style={styles(colorPalette).input}
                            selectedValue={editedLevel}
                            onValueChange={setEditedLevel}
                        >
                            {Array.from({ length: 10 }, (_, index) => (
                                <Picker.Item
                                    key={index}
                                    label={String(index + 1)}
                                    value={index + 1}
                                />
                            ))}
                        </Picker>
                        <Picker
                            style={styles(colorPalette).input}
                            selectedValue={editedPosition}
                            onValueChange={setEditedPosition}
                        >
                            <Picker.Item label="DEF" value="DEF" />
                            <Picker.Item label="ATT" value="ATT" />
                        </Picker>
                        <View style={styles(colorPalette).modalButtons}>
                            <Pressable
                                onPress={handleSaveEdit}
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
                                onPress={handleCancelEdit}
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

    const renderPlayer = ({ item }: { item: Player }) => {
        return (
            <View style={styles(colorPalette).playerContainer}>
                <IoniIcon.default
                    name={getPlayerIcon(item.position)}
                    size={30}
                    color={colorPalette.contrast}
                />
                <View style={styles(colorPalette).playerDetails}>
                    <Text
                        style={{
                            color: colorPalette.contrast,
                            fontWeight: 'bold',
                            fontSize: 18
                        }}
                    >
                        {item.name}
                    </Text>
                    <Text style={{ color: colorPalette.contrast }}>
                        {item.position}
                    </Text>
                    <Text style={{ color: colorPalette.contrast }}>
                        {item.level}
                    </Text>
                </View>
                <View style={styles(colorPalette).buttonContainer}>
                    <TouchableOpacity
                        onPress={() => handlePlayerParticipation(item)}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <IoniIcon.default
                            name={
                                nextGame?.some((plyr) => plyr.id === item.id)
                                    ? 'checkmark-circle-sharp'
                                    : 'radio-button-off'
                            }
                            size={24}
                            color={
                                nextGame?.some((plyr) => plyr.id === item.id)
                                    ? colorPalette.tertiary
                                    : colorPalette.contrast
                            }
                            style={{ margin: 'auto' }}
                        />

                        <Text>Playing</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleEditPlayer(item)}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <IoniIcon.default
                            name="pencil"
                            size={24}
                            color={colorPalette.contrast}
                            style={{ margin: 'auto' }}
                        />
                        <Text>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={() => handleDeletePlayerModal(item)}
                    >
                        <IoniIcon.default
                            name="trash-sharp"
                            size={24}
                            color={colorPalette.contrast}
                        />
                        <Text>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles(colorPalette).mainContainer}>
            <Text style={styles(colorPalette).pageTitle}>
                <Fontisto
                    name="persons"
                    size={20}
                    style={{ paddingRight: 20 }}
                    // color={colorPalette.contrast}
                />
                {'   '}Player List
            </Text>
            <FlatList data={players} renderItem={renderPlayer} />

            {deletePlayerModal()}

            {editPlayerModal()}
        </SafeAreaView>
    );
};

const styles = (colorPalette: ColorPalette) =>
    StyleSheet.create({
        mainContainer: {
            backgroundColor: colorPalette.contrast,
            height: '100%'
        },
        pageTitle: {
            backgroundColor: colorPalette.contrast,
            color: colorPalette.surface,
            fontSize: 18,
            paddingTop: 5,
            paddingLeft: 10,
            paddingBottom: 5,
            marginBottom: 15,
            fontWeight: 'bold'
        },
        playerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'space-between',
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderColor: 'gray',
            backgroundColor: colorPalette.surface,
            minHeight: 60,
            width: '100%'
        },
        playerDetails: {
            display: 'flex',
            flexDirection: 'column',
            marginLeft: 16
        },
        buttonContainer: {
            margin: 'auto',
            marginLeft: 'auto',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            //backgroundColor: 'yellow',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '50%'
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
        input: {
            marginBottom: 10,
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 4
        },
        modalButtons: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: 20
        }
    });
