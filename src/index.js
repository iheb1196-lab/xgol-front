import "primereact/resources/themes/lara-light-purple/theme.css";
import "react-toastify/dist/ReactToastify.css";
import "./global.css";
import "config/moment.config";
import App from "./App";
import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { store, persistor } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { PrimeReactProvider } from "primereact/api";
import ToastProvider from "./components/toasts/ToastProvider";
import { ThemeProvider } from "@mui/material";
import theme from "constants/theme.constant";

const root = ReactDOM.createRoot(document.getElementById("root"));
if (process.env.NODE_ENV === "development") {
  //setupLocatorUI();
}
root.render(
  <HelmetProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PrimeReactProvider>
          <BrowserRouter>
            <Suspense>
              <ToastProvider>
                <ThemeProvider theme={theme}>
                  <App />
                </ThemeProvider>
              </ToastProvider>
            </Suspense>
          </BrowserRouter>
        </PrimeReactProvider>
      </PersistGate>
    </Provider>
  </HelmetProvider>
);
