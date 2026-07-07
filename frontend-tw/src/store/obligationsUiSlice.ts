import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SortDirection, SortField } from "@/lib/types/obligation";

export interface ObligationsUiState {
  searchQuery: string;
  sortField: SortField;
  sortDirection: SortDirection;
}

const initialState: ObligationsUiState = {
  searchQuery: "",
  sortField: "dueDate",
  sortDirection: "asc",
};

const obligationsUiSlice = createSlice({
  name: "obligationsUi",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSortField(state, action: PayloadAction<SortField>) {
      state.sortField = action.payload;
    },
    setSortDirection(state, action: PayloadAction<SortDirection>) {
      state.sortDirection = action.payload;
    },
  },
});

export const { setSearchQuery, setSortField, setSortDirection } =
  obligationsUiSlice.actions;
export default obligationsUiSlice.reducer;
