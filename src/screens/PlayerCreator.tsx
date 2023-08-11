import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    TextInput,
    Pressable,
    StyleSheet,
    Text,
    Keyboard
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableWithoutFeedback, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import { useDispatch } from 'react-redux';
import { updatePlayers } from 'src/state/playerSlice';
import { ColorPalette, Player } from 'src/helper/types';
import useThemePalette from 'src/components/hooks/useThemePalette';
import { Dimensions } from 'react-native';

const PlayerCreator = () => {
    const [name, setName] = useState('');
    const [position, setPosition] = useState('DEF');
    const [level, setLevel] = useState('1');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [textFocused, setTextFocused] = useState(false);

    const colorPalette = useThemePalette();
    const deviceWidth = Dimensions.get('window').width;

    const localInputRef = useRef<TextInput>();

    const dispatch = useDispatch();

    const keyboardDidHideCallback = () => {
        localInputRef?.current?.blur?.();
    };

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        const keyboardDidHideSubscription = Keyboard.addListener(
            'keyboardDidHide',
            keyboardDidHideCallback
        );

        return () => {
            keyboardDidHideSubscription?.remove();
        };
    }, []);

    const handleSave = async () => {
        if (!name.trim()) {
            setErrorMessage('Please enter a name.');
            return;
        }

        try {
            const playersJSON = await AsyncStorage.getItem('Players');
            const existingPlayers = JSON.parse(playersJSON || '[]') || [];

            // Check if a player with the same name already exists
            if (
                existingPlayers.some((player: Player) => player.name === name)
            ) {
                setErrorMessage('Player already exists.');
                return;
            }

            // Create a new player object
            const newPlayer = { name, position, level, id: uuid.v4() };

            // Add the new player to the existing array
            const updatedPlayers = [...existingPlayers, newPlayer];

            // Update AsyncStorage with the updated array
            await AsyncStorage.setItem(
                'Players',
                JSON.stringify(updatedPlayers)
            );
            dispatch(updatePlayers(updatedPlayers));

            // Clear the form fields
            setName('');
            setPosition('DEF');
            setLevel('1');
            setErrorMessage('');
            setSuccessMessage(`${name} has been added to the list`);
        } catch (error) {
            console.error('Error saving player:', error);
        }
        /*  } */

        // Clear the form fields
        setName('');
        setPosition('DEF');
        setLevel('1');
        setErrorMessage('');
    };

    const handleCancel = () => {
        // You can perform any cancel actions here
        setName('');
        setPosition('DEF');
        setLevel('1');
    };
    const handleNameChange = (text: string) => {
        // Clear the error message when the user starts typing
        setErrorMessage('');
        setErrorMessage('');
        setName(text);
    };

    return (
        <SafeAreaView style={styles(colorPalette).mainContainer}>
            <View
                style={{
                    backgroundColor: colorPalette.contrast,
                    height: '10%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Text
                    style={{
                        color: colorPalette.surface,
                        textAlign: 'center',
                        fontSize: 20,
                        fontWeight: 'bold'
                        //  fontFamily: 'sans serif'
                    }}
                >
                    Create A Player
                </Text>
            </View>
            <View style={styles(colorPalette).container}>
                <View
                    style={{
                        height: deviceWidth * 0.4,
                        width: deviceWidth * 0.4,
                        marginTop: '5%',
                        marginBottom: '10%',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}
                >
                    <Image
                        style={{
                            width: null,
                            height: null,
                            flex: 1
                        }}
                        source={require('./../../assets/free-agent-icon.png')}
                    />
                </View>

                <View>
                    <Text
                        style={{
                            color: colorPalette.contrast,
                            fontWeight: 'bold',
                            fontSize: 16,
                            marginBottom: 5
                        }}
                    >
                        Name
                    </Text>
                    <TextInput
                        ref={(ref) => {
                            localInputRef &&
                                (localInputRef.current =
                                    (ref as TextInput) || null);
                        }}
                        style={{
                            ...styles(colorPalette).input,
                            borderColor: textFocused
                                ? colorPalette.tertiary
                                : colorPalette.contrast,
                            backgroundColor: textFocused
                                ? colorPalette.surface
                                : colorPalette.inputInactive
                        }}
                        placeholder="Enter a name"
                        value={name}
                        onFocus={() => setTextFocused(true)}
                        onBlur={() => setTextFocused(false)}
                        onChangeText={handleNameChange}
                        onEndEditing={() => setTextFocused(false)}
                    />
                    <TouchableWithoutFeedback
                        onPress={() => {
                            setTextFocused(false);
                            localInputRef?.current?.blur();
                        }}
                    >
                        <>
                            <Text
                                style={{
                                    color: colorPalette.contrast,
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                    marginBottom: 5
                                }}
                            >
                                Position
                            </Text>
                            <Picker
                                style={styles(colorPalette).input}
                                selectedValue={position}
                                onFocus={() => {
                                    setTextFocused(false);
                                    localInputRef?.current?.blur();
                                }}
                                onValueChange={(itemValue) =>
                                    setPosition(itemValue)
                                }
                            >
                                <Picker.Item label="DEF" value="DEF" />
                                <Picker.Item label="ATT" value="ATT" />
                            </Picker>
                            <Text
                                style={{
                                    color: colorPalette.contrast,
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                    marginBottom: 5
                                }}
                            >
                                {'Level (from 1-10)'}
                            </Text>
                            <Picker
                                style={styles(colorPalette).input}
                                selectedValue={level}
                                onValueChange={(itemValue) =>
                                    setLevel(itemValue)
                                }
                                onFocus={() => {
                                    setTextFocused(false);
                                    localInputRef?.current?.blur();
                                }}
                            >
                                {Array.from({ length: 10 }, (_, index) => (
                                    <Picker.Item
                                        key={index}
                                        label={String(index + 1)}
                                        value={String(index + 1)}
                                    />
                                ))}
                            </Picker>
                        </>
                    </TouchableWithoutFeedback>
                </View>
                <>
                    {errorMessage && (
                        <Text style={styles(colorPalette).errorText}>
                            {errorMessage}
                        </Text>
                    )}
                    {successMessage && (
                        <Text style={styles(colorPalette).successMessage}>
                            {successMessage}
                        </Text>
                    )}
                </>
                <View style={styles(colorPalette).buttonContainer}>
                    <Pressable
                        onPress={handleSave}
                        style={{
                            backgroundColor: colorPalette.tertiary,
                            width: '46%',
                            borderRadius: 6,
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
                        onPress={handleCancel}
                        style={{
                            backgroundColor: colorPalette.contrast,
                            width: '46%',
                            borderRadius: 6,
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
        </SafeAreaView>
    );
};

const styles = (colorPalette: ColorPalette) =>
    StyleSheet.create({
        mainContainer: {
            height: '100%'
        },
        container: {
            flex: 1,
            height: '100%',
            paddingHorizontal: 10
        },
        input: {
            borderTopWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            marginBottom: 10,
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderRadius: 4,
            backgroundColor: colorPalette.inputInactive
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: 30
        },
        errorText: {
            color: 'red',
            marginBottom: 10
        },
        successMessage: {
            backgroundColor: colorPalette.contrast,
            color: colorPalette.tertiary,
            width: 'auto',
            padding: 5,
            borderRadius: 2,
            textAlign: 'center'
        }
    });

export { PlayerCreator };
