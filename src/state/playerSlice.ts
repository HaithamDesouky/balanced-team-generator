import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Player } from 'src/helper/types';

// Define a type for the slice state
interface PlayerState {
    players: Player[];
    nextGame: Player[];
}

// Define the initial state using that type
const initialState: PlayerState = {
    players: [],
    nextGame: []
};

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        updatePlayers: (state, action: PayloadAction<Player[]>) => {
            return { ...state, players: action.payload };
        },
        updateNextGame: (state, action: PayloadAction<Player[]>) => {
            return { ...state, nextGame: action.payload };
        }
    }
});

export const { updatePlayers, updateNextGame } = playerSlice.actions;
export const reducer = playerSlice.reducer;

export default playerSlice.reducer;
