// authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  activateAccount,
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  resetAdminAccount,
  getUserEmail,
} from "./authService";
import { removeLocalStorage } from "services/storage.service";

const initialState = {
  isAuthenticated: false,
  user: null,
  message: null,
  loading: false,
  loadingToken: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const user = await login(credentials);
      localStorage.setItem("accessToken", user.accessToken);
      return user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const userLogout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await logout();
      removeLocalStorage("accessToken");
      removeLocalStorage("hasSeenWalkthrough");
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await signup(userData);
      return user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const activateAccountAction = createAsyncThunk(
  "auth/activateAccount",
  async (token, { rejectWithValue }) => {
    try {
      const response = await activateAccount(token);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const forgotPasswordAction = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    console.log(email.email);
    try {
      const message = await forgotPassword(email.email);
      return message;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const resetPasswordAction = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const message = await resetPassword(token, password);
      return message;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const resetAdminAccess = createAsyncThunk(
  "auth/resetAdminAccess",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const message = await resetAdminAccount(token, password);
      return message;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getEmailFromToken = createAsyncThunk(
  "auth/getEmailFromToken",
  async ({ token }, { rejectWithValue }) => {
    try {
      const message = await getUserEmail(token);
      return message;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // logout(state) {
    //   state.isAuthenticated = false;
    //   state.user = null;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.message = "login sucess";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(userLogout.pending, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogout.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.loadingToken = false;
        state.isAuthenticated = false;
        state.error = null;
        state.message = null;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.user = null;
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(activateAccountAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activateAccountAction.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        // Optionally, you can update the state here to indicate the account has been activated
      })
      .addCase(activateAccountAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(forgotPasswordAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordAction.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(forgotPasswordAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPasswordAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordAction.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(resetPasswordAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetAdminAccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetAdminAccess.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(resetAdminAccess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getEmailFromToken.pending, (state) => {
        state.loadingToken = true;
        state.error = null;
      })
      .addCase(getEmailFromToken.fulfilled, (state, action) => {
        state.loadingToken = false;
        state.message = action.payload;
      })
      .addCase(getEmailFromToken.rejected, (state, action) => {
        state.loadingToken = false;
        state.error = action.payload;
      });
  },
});

// export const { logout } = authSlice.actions;

export default authSlice.reducer;
