import React from 'react';
import "./time.scss"



const SpeechCard = () => {
  return (
   <div className='time-card'>
    <div className='time-button'>
    <img src="/assets/icons/speech/iconStat.svg" alt="" />
        <div className='paragraph-container'>
            <div className='text'> Speeches you have completed</div>
            <div className='sub-text'>0 speech </div>

        </div>
    </div>

   </div>
  
  );
};

export default SpeechCard;