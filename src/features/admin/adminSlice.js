// authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { assignLicense, getAllCorporateLicensesAdmin, getAllCorporateSpeechStatistics, addExpert, getUnassignedExperts } from "./adminService";

const initialState = {
  status: false,
  response: null,
  loading: false,
  error: null,
};

export const getCorporateSpeechStatistics = createAsyncThunk(
  "admin/getCorporateSpeechStatistics",
  async (licenceId, { rejectWithValue }) => {
    try {
      const response = await getAllCorporateSpeechStatistics(licenceId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getCorporateLicensesAdmin = createAsyncThunk(
  "admin/getCorporateLicensesAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllCorporateLicensesAdmin();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const assignLicenseAdmin = createAsyncThunk(
  "admin/assignLicense",
  async ({ email, licenseId }, { rejectWithValue }) => {
    try {
      const response = await assignLicense(email,licenseId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const assignExpert = createAsyncThunk(
  "admin/addExpert",
  async ({ email, licenseId, firstName, lastName ,maxEvaluation}, { rejectWithValue }) => {
    try {
      const response = await addExpert(email,licenseId,firstName,lastName,maxEvaluation);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getUnExperts = createAsyncThunk(
  "admin/getUnassignedExperts",
  async (licenceId, { rejectWithValue }) => {
    try {
      const response = await getUnassignedExperts(licenceId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCorporateSpeechStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.response = null;
      })
      .addCase(getCorporateSpeechStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
        state.status = action.payload.status;
      })
      .addCase(getCorporateSpeechStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = false;
      })
      .addCase(getUnExperts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.response = null;
      })
      .addCase(getUnExperts.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
        state.status = action.payload.status;
      })
      .addCase(getUnExperts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = false;
      })
      .addCase(getCorporateLicensesAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.response = null;
      })
      .addCase(getCorporateLicensesAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
        state.status = action.payload.status;
      })
      .addCase(getCorporateLicensesAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = false;
      })
      .addCase(assignLicenseAdmin.pending, (state) => {
        state.loadingAssign = true;
        state.errorAssign = null;
        state.responseAssign = null;
      })
      .addCase(assignLicenseAdmin.fulfilled, (state, action) => {
        state.loadingAssign = false;
        state.responseAssign = action.payload;
        state.status = action.payload.status;
      })
      .addCase(assignLicenseAdmin.rejected, (state, action) => {
        state.loadingAssign = false;
        state.errorAssign = action.payload;
        state.status = false;
      })
      .addCase(assignExpert.pending, (state) => {
        state.loadingAssign = true;
        state.errorAssign = null;
        state.responseAssign = null;
      })
      .addCase(assignExpert.fulfilled, (state, action) => {
        state.loadingAssign = false;
        state.responseAssign = action.payload;
        state.status = action.payload.status;
      })
      .addCase(assignExpert.rejected, (state, action) => {
        state.loadingAssign = false;
        state.errorAssign = action.payload;
        state.status = false;
      })
  },
});

export default adminSlice.reducer;
