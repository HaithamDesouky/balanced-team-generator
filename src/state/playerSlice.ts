import { initialPlayers } from '../mock/mockPlayerList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state
interface PlayerState {
    players: Player[];
}

// Define the initial state using that type
const initialState: PlayerState = {
    players: []
};

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        updatePlayers: (state, action: PayloadAction<Player[]>) => {
            return { ...state, players: action.payload };
        }
    }
});

console.log({ playerSlice });
export const { updatePlayers } = playerSlice.actions;
export const reducer = playerSlice.reducer;

export default playerSlice.reducer;
