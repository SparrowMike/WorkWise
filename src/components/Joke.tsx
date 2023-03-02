import { useEffect, useState } from 'react'
import { getFunnyChuck } from '../api/funnyChuck'
import { ChuckNorrisJoke } from '../interfaces/chuckJoke'

function Joke() {
  const [joke, setJoke] = useState<ChuckNorrisJoke | null>(null)
  const [reset, setReset] = useState<boolean>(true)

  useEffect(() => {
    const fetchJoke = async () => {
      try {
        const res: any = await getFunnyChuck();
        setJoke(res);
      } catch (error) {
        console.error(error);
      }
    };
    fetchJoke();

  }, [reset])

  return (
    <>
      <h4>{joke?.value}</h4>
      <button onClick={() => setReset(!reset)}>Get New Joke</button>
    </>
  )
}

export default Joke