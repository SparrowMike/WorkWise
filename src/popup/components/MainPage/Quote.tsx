import React, { useState, useEffect, useContext } from 'react';
import { PreferenceContext } from '../../../context/PreferenceContext';
import useApiRequest from "../../../hooks/useApiRequest";
import { QuoteType } from "../../../interfaces/api";

function Quote() {
  const { preference } = useContext(PreferenceContext);

  if (!preference.quote?.text.length) {
    return <div>Loading...</div>
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