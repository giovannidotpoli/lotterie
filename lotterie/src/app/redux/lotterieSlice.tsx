import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchApiData } from './API';

const initialState = {
  value: 0,
  status: 'idle',
  lotto: [],
  superenalotto: [],
  milionday: [],
};

export const fetchData = createAsyncThunk(
  'app/fetchData',
  async (obj:any) => {
    const response = await fetchApiData(obj);
    return {
      type: obj.type,
      data: response
    }
  }
);


export const lotterieSlice = createSlice({
  name: 'app',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    resetLotto: (state) => {
      state.lotto = [];
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder

      .addCase(fetchData.pending, (state) => {
        state.status = 'loading';
        state.lotto = [];
        state.milionday = [];
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = 'idle';
        const type:string = action.payload.type;
        switch(type) {
          case 'lotto':
            state.lotto = action.payload.data;
            break;
          case 'milionday':
            state.milionday = action.payload.data;
            break;
        }
      })
  },
});

export const { resetLotto } = lotterieSlice.actions;
export const selectEstrazioniLotto = (state:any) => state.app.lotto;
export const selectEstrazioniSuperEnalotto = (state:any) => state.app.superenalotto;
export const selectEstrazioniMilionDay = (state:any) => state.app.milionday;
export default lotterieSlice.reducer;
