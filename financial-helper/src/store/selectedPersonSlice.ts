import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Person } from '../models';

type State = {
    selectedPerson: Person | null;
};

const initialState: State = {
    selectedPerson: null,
};

const slice = createSlice({
    name: 'selectedPerson',
    initialState,
    reducers: {
        setSelectedPerson(state, action: PayloadAction<Person | null>) {
            state.selectedPerson = action.payload;
        },
        clearSelectedPerson(state) {
            state.selectedPerson = null;
        }
    }
});

export const { setSelectedPerson, clearSelectedPerson } = slice.actions;
export default slice.reducer;