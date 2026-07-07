import { configureStore } from "@reduxjs/toolkit";
import obligationsUiReducer from "./obligationsUiSlice";

export const makeStore = () =>
  configureStore({
    reducer: { obligationsUi: obligationsUiReducer },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
