import React, { useState, useEffect } from 'react';
import { PreferenceContext } from '../../../context/PreferenceContext';
import useApiRequest from "../../../hooks/useApiRequest";
import { QuoteType } from "../../../interfaces/api";

function isQuoteTypeArray(data: QuoteType | QuoteType[]): data is QuoteType[] {
  return Array.isArray(data);
}

function Quote() {
  const [quote, setQuote] = useState<QuoteType>()

  //?======================= feeding quote from preference to avoiding the delay when loading popup
  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'LOAD_QUOTE' }, (response) => {
      if (response && response.quote !== undefined && response.quote !== null) {
        setQuote(response.quote);
      } else {
        setQuote({ text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" })
      }
    });
  }, []);

  // const { data, isLoading, error } = useApiRequest<QuoteType>({
  //   url: "https://type.fit/api/quotes",
  //   method: "GET",
  // });

  // if (isLoading || !data) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error fetching data: {error.message}</div>;
  // }

  // const quoteData = isQuoteTypeArray(data) ? data : [data];
  // const randomIndex: number = Math.floor(Math.random() * quoteData.length);

  return (
    <div className="quote-list">
      <div className="quote">
        <blockquote className="sidekick">

          {/* <p>{quote[randomIndex]?.text}</p>
          <cite> {quote[randomIndex]?.author || 'Anonymous'} </cite> */}

          <p>{quote?.text}</p>
          <cite> {quote?.author || 'Anonymous'} </cite>
        </blockquote>
      </div>
    </div>
  );
}

export default React.memo(Quote);
