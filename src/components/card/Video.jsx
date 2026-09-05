import React from 'react';
import "./time.scss"



const VideoCard = () => {
  return (
   <div className='time-card'>
    <div className='time-button'>
    <img src="/assets/icons/video/videoStat.svg" alt="" />
        <div className='paragraph-container'>
            <div className='text'> Videos you have recorded</div>
            <div className='sub-text'> 0 Videos</div>

        </div>
    </div>

   </div>
  
  );
};

export default VideoCard;