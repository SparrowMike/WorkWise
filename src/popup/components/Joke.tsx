import { useState } from 'react';
import useApiRequest from '../../hooks/useApiRequest';
import { ChuckNorrisJoke } from '../../interfaces/api';

function Joke() {
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const { data, isLoading, error } = useApiRequest<ChuckNorrisJoke>({
    url: 'https://api.chucknorris.io/jokes/random',
    method: 'GET',
    refetch: shouldRefetch, 
  });

  const handleRefetch = () => {
    setShouldRefetch(!shouldRefetch);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  const joke = Array.isArray(data) ? data[0] : data;

  return (
    <>
      <h4>{joke?.value}</h4>
      <button onClick={handleRefetch}>Refetch</button>
    </>
  );
}

export default Joke;
