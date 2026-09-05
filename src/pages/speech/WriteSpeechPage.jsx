import React from 'react'
import WriteSpeech from '../../views/speeches/createSpeech';
import { Helmet } from 'react-helmet-async';

const WriteSpeechPage = () => {
  return (
    <>
      <Helmet>
        <title>Write your speeches </title>
      </Helmet>

      <WriteSpeech />
    </>
  );
}

export default WriteSpeechPage