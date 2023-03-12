import { useApiCall } from "../../hooks/useApiCall";
import { QuoteType } from "../../interfaces/api";

function Quote() {
  const { data, isLoading, error } = useApiCall<QuoteType[]>('https://type.fit/api/quotes');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  const randomIndex = Math.floor(Math.random() * (data?.length ?? 0));

  return (
    <div className="quote-list">
      <div className="quote">
        <blockquote className="sidekick">
          {(data as QuoteType[])[randomIndex]?.text} <cite> {(data as QuoteType[])[randomIndex]?.author || 'Anonymous'} </cite>
        </blockquote>
      </div>
    </div>
  );
}

export default Quote;
