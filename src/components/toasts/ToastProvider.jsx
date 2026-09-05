import React, { createContext, useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  const [toastInfo, setToastInfo] = useState({ type: "", msg: "" });
  const toastConfig = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    closeButton: false,
  };
  const toastStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0px 0px 0px 20px",
    color: "#111322",
    fontSize: "14px",
    fontFamily: "Poppins",
    width: "95%",
  };
  const { type } = toastInfo;

  const showToast = (msg, type, config) => {
    setToastInfo({ msg, type });
    switch (type) {
      case "success":
        toast.success(
          <div style={toastStyle}>
            {msg}
            {(config?.showCloseButton) && (
              <img src="/assets/icons/toast/close-x.svg" alt="" />
            )}
          </div>,
          {
            ...toastConfig,
            ...config,
            icon: <img src="/assets/icons/toast/success-toast.svg" alt="" />,
          }
        );
        break;
      case "error":
        toast.error(
          <div style={toastStyle}>
            {msg}
            {(config?.showCloseButton) && (
              <img src="/assets/icons/toast/close-x.svg" alt="" />
            )}
          </div>,
          {
            ...toastConfig,
            ...config,
            icon: <img src="/assets/icons/toast/error-toast.svg" alt="" />,
          }
        );
        break;
      default:
        break;
    }
  };

  const getToastBodyStyle = () => {
    switch (type) {
      case "success":
        return { border: "1px solid #12B76A" };
      //   case "info":
      //     return { background: "blue" };
      //   case "warning":
      //     return { background: "yellow" };

      default:
        return;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ToastContainer toastStyle={getToastBodyStyle()} />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

export default ToastProvider;
