import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SelectedPicture = string;
export type RejectedPicture = string;
export type SelectedPictures = SelectedPicture[];
export type RejectedPictures = RejectedPicture[];

interface InitialState {
  selectedPictures: SelectedPictures;
  rejectedPictures: RejectedPictures;
}

const initialState: InitialState = {
  selectedPictures: [],
  rejectedPictures: [],
};

const picturesSlice = createSlice({
  name: "pictures",
  initialState,
  reducers: {
    addSelectedPicture(state, action: PayloadAction<SelectedPicture>) {
      state.selectedPictures = [...state.selectedPictures, action.payload];
    },
    addRejectedPicture(state, action: PayloadAction<RejectedPicture>) {
      state.rejectedPictures = [...state.rejectedPictures, action.payload];
    },
  },
});

export const picturesSliceReducer = picturesSlice.reducer;
export const PicturesSliceAction = picturesSlice.actions;
