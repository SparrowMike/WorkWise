import React, { useContext } from 'react';
import { PreferenceContext } from '../../../context/PreferenceContext';

function Quote() {
  const { preference } = useContext(PreferenceContext);

  if (!preference.quote?.text.length) {
    return (
      <div className='loading-spinner-container'>
        <div className="loading-spinner"></div>
        <div className="text">Loading...</div>
      </div>
    )
  }

  return (
    <div className="quote-list">
      <div className="quote">
        <blockquote className="sidekick">
          <p>{preference.quote?.text}</p>
          <cite> {preference.quote?.author || 'Anonymous'} </cite>
        </blockquote>
      </div>
    </div>
  );
}

export default React.memo(Quote);