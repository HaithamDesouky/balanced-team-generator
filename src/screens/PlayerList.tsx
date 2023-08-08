import React, { useState } from 'react';
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
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library you are using
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import { updatePlayers } from 'src/state/playerSlice';
import type { RootState } from 'src/state/store';
import { Player } from 'src/helper/types';

export const PlayerList: React.FC = () => {
    const { players } = useSelector((state: RootState) => state.players);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
    const [editedName, setEditedName] = useState('');
    const [editedLevel, setEditedLevel] = useState(1);
    const [editedPosition, setEditedPosition] = useState('');
    const dispatch = useDispatch();

    console.log({ players });

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
        } catch (error) {
            console.error('Error deleting player:', error);
        }
    };

    const renderPlayer = ({ item }: { item: Player }) => {
        console.log({ item, help: 'renderrrr' });

        return (
            <View style={styles.playerContainer}>
                <Text>{item.name}</Text>
                <TouchableOpacity onPress={() => handleEditPlayer(item)}>
                    <Icon name="edit" size={24} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeletePlayer(item.id)}>
                    <Icon name="delete" size={24} color="red" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView>
            <Text>flat list below</Text>
            <FlatList data={players} renderItem={renderPlayer} />
            {/* Edit Player Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={editedName}
                            onChangeText={setEditedName}
                        />
                        <Picker
                            style={styles.input}
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
                            style={styles.input}
                            selectedValue={editedPosition}
                            onValueChange={setEditedPosition}
                        >
                            <Picker.Item label="DEF" value="DEF" />
                            <Picker.Item label="ATT" value="ATT" />
                        </Picker>
                        <View style={styles.modalButtons}>
                            <Pressable onPress={handleSaveEdit}>
                                <Text>Save</Text>
                            </Pressable>
                            <Pressable onPress={handleCancelEdit}>
                                <Text>Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    playerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: 'gray'
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
