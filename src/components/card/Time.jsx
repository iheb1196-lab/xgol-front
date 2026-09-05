import React from 'react';
import "./time.scss"
import TimerIcon from '../icons/Time';


const TimeCard = () => {
  return (
   <div className='time-card'>
    <div className='time-button'>
    <img src="/assets/icons/time/timeIcon.svg" alt="" />
        <div className='paragraph-container'>
            <div className='text'> Time you spent practicing</div>
            <div className='sub-text'> 0 Minutes </div>

        </div>
    </div>

   </div>
  
  );
};

export default TimeCard;