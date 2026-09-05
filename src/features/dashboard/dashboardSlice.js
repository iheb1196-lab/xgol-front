// authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getClientStatistics, getClientTransactionsService,assignSnackExpert, getUserActiveLicense, getUserCreditsService, upgradeUserLicence, getExpertStatistics } from "./dashboardService";

const initialState = {
  status: false,
  response: null,
  licenceResponse: null,
  loading: false,
  licenseLoading: false,
  error: null,
};

export const getDashboardData = createAsyncThunk(
  "dashboard/getDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getClientStatistics();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getExpertPortalData = createAsyncThunk(
  "dashboard/getExpertPortaldData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getExpertStatistics();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getActiveLicense = createAsyncThunk(
  "dashboard/getActiveLicense",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserActiveLicense();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const upgradeLicence = createAsyncThunk(
  "dashboard/upgradeLicence",
  async (secretId, { rejectWithValue }) => {
    try {
      const response = await upgradeUserLicence(secretId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getUserCredits = createAsyncThunk(
  "dashboard/user-credits",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await getUserCreditsService();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const assignSnackCoachingExpert = createAsyncThunk(
  "dashboard/user-assign",
  async (expertId, { rejectWithValue }) => {
    try {
      const response = await assignSnackExpert(expertId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getClientTranscations = createAsyncThunk(
  "dashboard/client/transactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getClientTransactionsService();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.response = null;
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload.data;
        state.status = action.payload.status;
      })
      .addCase(getDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = false;
      })
      .addCase(getExpertPortalData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.response = null;
      })
      .addCase(getExpertPortalData.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload.data;
        state.status = action.payload.status;
      })
      .addCase(getExpertPortalData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = false;
      })
      .addCase(getActiveLicense.pending, (state) => {
        //state.loading = true;
        state.licenseLoading = true;
        state.error = null;
        state.licenceResponse = null;
      })
      .addCase(getActiveLicense.fulfilled, (state, action) => {
        //state.loading = false;
        state.licenseLoading = false;
        state.licenceResponse = action.payload.data;
        state.status = action.payload.status;
      })
      .addCase(getActiveLicense.rejected, (state, action) => {
       //state.loading = false;
        state.licenseLoading = false;
        state.error = action.payload;
        state.status = false;
      })
      .addCase(upgradeLicence.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.response = null;
      })
      .addCase(upgradeLicence.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload.data;
        state.status = action.payload.status;
      })
      .addCase(upgradeLicence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = false;
      })
      .addCase(assignSnackCoachingExpert.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.response = null;
      })
      .addCase(assignSnackCoachingExpert.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload.data;
        state.status = action.payload.status;
      })
      .addCase(assignSnackCoachingExpert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = false;
      });
  },
});

export default dashboardSlice.reducer;
