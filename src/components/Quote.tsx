import { useState, useEffect } from 'react';
import { typeFitQuote } from '../interfaces/api';

function Quote() {
  // ? free motivational API
  // https://type.fit/api/quotes
  // https://favqs.com/api/
  // https://quotes.rest/
  // http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en


  const [quote, setQuote] = useState<typeFitQuote | null>(null);

  useEffect(() => {
    fetch('https://type.fit/api/quotes')
      .then(response => response.json())
      .then(data => {
        const randomIndex = Math.floor(Math.random() * data.length);
        setQuote(data[randomIndex]);
      })
      .catch(error => console.error('Error fetching quote:', error));
  }, []);

  return (
    <div className="quote">
      <blockquote className="sidekick">
        {quote?.text} <cite> {quote?.author} </cite>
      </blockquote>
    </div>
  )
}

export default Quote