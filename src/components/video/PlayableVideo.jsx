import classNames from "classnames";
import PlayIcon from "components/icons/PlayIcon";
import { forwardRef, useRef, useState } from "react";

export default forwardRef(({ className, ...props }, controlledRef) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const currentRef = useRef();

  const ref = controlledRef ?? currentRef;

  const onPlayClick = () => {
    setIsPlaying(true);
    setTimeout(() => {
      ref?.current?.play();
    }, 500);
  };

  return (
    <div className={classNames("w-full h-auto relative pl-2", className)}>
      {isPlaying ? (
      <video
      ref={ref}
       className="block mx-auto max-w-[320px] max-h-[240px] rounded-lg"
      controls
      {...props}
    />
      ) : (
        <div className="w-full h-[200px] rounded-lg absolute top-0 left-0 bg-black flex flex-col items-center justify-center">
          <PlayIcon onClick={onPlayClick} />
        </div>
      )}
    </div>
  );
});
