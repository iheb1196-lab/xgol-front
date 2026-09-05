import { ReactInternetSpeedMeter } from "react-internet-meter";
import "react-internet-meter/dist/index.css";

export default ({ onChange, onDisconnect }) => {
  return (
    <ReactInternetSpeedMeter
      outputType="empty"
      customClassName={null}
      txtMainHeading="Opps..."
      pingInterval={3000} // milliseconds
      thresholdUnit="megabyte"
      threshold={8}
      imageUrl="https://www.sammobile.com/wp-content/uploads/2019/03/keyguard_default_wallpaper_silver.png"
      downloadSize="2550420" //bytes
      callbackFunctionOnError={() => {
        console.log("no connection");
        onDisconnect();
      }}
      callbackFunctionOnNetworkTest={(speed) => {
        console.log("speed is now", speed);
        onChange(speed);
      }}
    />
  );
};
