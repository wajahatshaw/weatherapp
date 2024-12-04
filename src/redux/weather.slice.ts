import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WeatherState {
  unit: 'celsius' | 'fahrenheit';
}

const initialState: WeatherState = {
  unit: 'celsius',
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setUnit: (state, action: PayloadAction<'celsius' | 'fahrenheit'>) => {
      state.unit = action.payload;
    },
  },
});

export const { setUnit } = weatherSlice.actions;
export default weatherSlice.reducer;
