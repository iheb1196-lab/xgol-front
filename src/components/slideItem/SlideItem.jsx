import "./slideItem.scss";

const SlideItem = ({ item }) => {
  const { icon, title, text } = item ?? {};

  return (
    <div className="slide-item">
      {icon}

      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
};

export default SlideItem;
