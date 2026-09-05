import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteSessionService,
  getAllSessions,
  getOneSession,
  getSpeechSessions,
} from "./practiceService";
import _ from "lodash";

const initialState = {
  sessions: null,
  sessionDetails: null,
  speechSessions: null,
  loading: false,
  error: null,
};

export const getSessions = createAsyncThunk(
  "practice/getSessions",
  async (_arg, { rejectWithValue }) => {
    try {
      return await getAllSessions();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getSession = createAsyncThunk(
  "practice/getSession",
  async (sessionId, { rejectWithValue }) => {
    try {
      return await getOneSession(sessionId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getSessionsForSpeech = createAsyncThunk(
  "practice/getSessionsForSpeech",
  async (speechId, { rejectWithValue }) => {
    try {
      return await getSpeechSessions(speechId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteSession = createAsyncThunk(
  "practice/deleteSession",
  async (sessionId, { rejectWithValue }) => {
    try {
      return await deleteSessionService(sessionId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const practiceSlice = createSlice({
  name: "practice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.sessions = null;
        state.sessionDetails = null;
      })
      .addCase(getSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = _.orderBy(
          action.payload.sessions,
          (el) => el?.createdAt,
          ["desc"]
        );
      })
      .addCase(getSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSession.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.sessionDetails = null;
      })
      .addCase(getSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionDetails = action.payload.session;
      })
      .addCase(getSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSessionsForSpeech.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.speechSessions = null;
      })
      .addCase(getSessionsForSpeech.fulfilled, (state, action) => {
        state.loading = false;
        state.speechSessions = action.payload;
      })
      .addCase(getSessionsForSpeech.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default practiceSlice.reducer;
