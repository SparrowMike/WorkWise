import { useEffect, useState } from 'react'
import { getFunnyChuck } from '../api/funnyChuck'
import { ChuckNorrisJoke } from '../interfaces/chuckJoke'

function Joke() {
  const [joke, setJoke] = useState<ChuckNorrisJoke | null>(null)

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

  }, [])

  return (
    <h4>{joke?.value}</h4>
  )
}

export default Joke