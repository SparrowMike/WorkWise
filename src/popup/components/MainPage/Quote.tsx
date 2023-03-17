import React from 'react';
import useApiRequest from "../../../hooks/useApiRequest";
import { QuoteType } from "../../../interfaces/api";

function isQuoteTypeArray(data: QuoteType | QuoteType[]): data is QuoteType[] {
  return Array.isArray(data);
}

function Quote() {
  const { data, isLoading, error } = useApiRequest<QuoteType>({
    url: "https://type.fit/api/quotes",
    method: "GET",
  });

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  const quoteData = isQuoteTypeArray(data) ? data : [data];
  const randomIndex: number = Math.floor(Math.random() * quoteData.length);

  return (
    <div className="quote-list">
      <div className="quote">
        <blockquote className="sidekick">
          {quoteData[randomIndex]?.text} <cite> {quoteData[randomIndex]?.author || 'Anonymous'} </cite>
        </blockquote>
      </div>
    </div>
  );
}

export default React.memo(Quote);
