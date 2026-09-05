import { useEffect, useState } from "react";

export default ({ children, timeout }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, timeout);
  }, []);

  if (!isVisible) {
    return <></>;
  }

  return <>{children}</>;
};
