import "./buttonLink.scss";
import RouterLink from "../../routes/components/router-link";
import { classNames } from "primereact/utils";

const ButtonLink = ({ path, text, primary, handleClick, className }) => {
  const styles = primary
    ? {
        backgroundColor: "#af49fa",
        color: "white",
        borderColor: "#af49fa",
      }
    : null;
  return (
    <RouterLink href={path ? path : null}>
      <div
        className={classNames("button", className)}
        style={styles}
        onClick={handleClick}
      >
        {text}
      </div>
    </RouterLink>
  );
};

export default ButtonLink;
