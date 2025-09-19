import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BusinessState {
  id: number | null;
  name?: string;
}

const initialState: BusinessState = {
  id: null,
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setBusinessId(state, action: PayloadAction<number>) {
      state.id = action.payload;
    },
    clearBusiness(state) {
      state.id = null;
      state.name = undefined;
    },
  },
});

export const { setBusinessId, clearBusiness } = businessSlice.actions;
export default businessSlice.reducer;
export type { BusinessState };