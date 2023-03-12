import { useApiCall } from "../../hooks/useApiCall";
import { ChuckNorrisJoke } from '../../interfaces/api'

function Joke() {
  const { data, isLoading, error, refetch } = useApiCall<ChuckNorrisJoke>('https://api.chucknorris.io/jokes/random');

  const handleRefetchClick = () => {
    refetch();
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
      <button onClick={handleRefetchClick}>Refetch</button>
    </>
  )
}

export default Joke
