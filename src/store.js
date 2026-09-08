import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import speechSlice from "./features/speech/speechSlice";
import practiceSlice from "./features/practice/practiceSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; //
import adminSlice from "./features/admin/adminSlice";
import dashboardSlice from "./features/dashboard/dashboardSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};
const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    auth: authReducer,
    speech: speechSlice,
    practice: practiceSlice,
    admin: adminSlice,
    dashboard: dashboardSlice,
  })
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist dispatches non-serializable payloads by design
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
