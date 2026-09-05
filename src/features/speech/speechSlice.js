// speechSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addSpeechAction,
  deleteSpeechService,
  getAllSpeeches,
  getOneSpeech,
} from "./speechService";
import _ from "lodash";

const initialState = {
  status: false,
  speeches: null,
  speechDetails: null,
  loading: false,
  error: null,
};

export const getSpeeches = createAsyncThunk(
  "speech/getSpeeches",
  async (_, { rejectWithValue }) => {
    try {
      const speeches = await getAllSpeeches();
      return speeches;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getSpeech = createAsyncThunk(
  "speech/getSpeech",
  async (speechId, { rejectWithValue }) => {
    try {
      const speech = await getOneSpeech(speechId);
      return speech;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addSpeech = createAsyncThunk(
  "speech/addSpeech",
  async (speechDetails, { rejectWithValue }) => {
    try {
      const response = await addSpeechAction(speechDetails);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteSpeech = createAsyncThunk(
  "speech/deleteSpeech",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteSpeechService(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const speechSlice = createSlice({
  name: "speech",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSpeeches.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.speeches = null;
        state.speechDetails = null;
      })
      .addCase(getSpeeches.fulfilled, (state, action) => {
        state.loading = false;
        state.speeches = _.orderBy(
          action.payload.speeches,
          (el) => el?.createdAt,
          ["desc"]
        );
        state.status = action.payload.status;
      })
      .addCase(getSpeeches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = false;
      })
      .addCase(getSpeech.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = false;
        state.speeches = null;
        state.speechDetails = null;
      })
      .addCase(getSpeech.fulfilled, (state, action) => {
        state.loading = false;
        state.speechDetails = action.payload.speech;
        state.status = action.payload.status;
      })
      .addCase(getSpeech.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addSpeech.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = false;
        state.speeches = null;
        state.speechDetails = null;
      })
      .addCase(addSpeech.fulfilled, (state, action) => {
        state.loading = false;
        state.speechDetails = action.payload.speech;
        state.status = action.payload.status;
      })
      .addCase(addSpeech.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default speechSlice.reducer;
