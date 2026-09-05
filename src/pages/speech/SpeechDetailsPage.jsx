import React from 'react'
import { Helmet } from 'react-helmet-async';
import SpeechDetailsView from '../../views/speeches/speechDetails';

const SpeechDetailsPage = () => {
  return (
    <>
      <Helmet>
        <title>manage speech</title>
      </Helmet>

      <SpeechDetailsView />
    </>
  );
}

export default SpeechDetailsPage