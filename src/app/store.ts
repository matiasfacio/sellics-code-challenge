import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { picturesSliceReducer } from "../features/pictures/picturesSlice";

export const store = configureStore({
  reducer: {
    pictures: picturesSliceReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
