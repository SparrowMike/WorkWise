import { useEffect, useState } from 'react'
import { getFunnyChuck } from '../../api/funnyChuck'
import { ChuckNorrisJoke } from '../../interfaces/api'

function Joke() {
  const [joke, setJoke] = useState<ChuckNorrisJoke | null>(null)
  const [reset, setReset] = useState<boolean>(true)

  useEffect(() => {
    const fetchJoke = async () => {
      try {
        const res: any = await getFunnyChuck();
        setJoke(res);
        triggerNoty()
      } catch (error) {
        console.error(error);
      }
    };
    fetchJoke();

  }, [reset])

  // ? This suppose to trigger notification when used as extension 
  // ! for experimentation only
  const triggerNoty = () => {
    chrome.runtime.sendMessage('', {
      type: 'notification',
      options: {
        title: 'Chuck Norris Joke',
        message: joke?.value,
        type: 'basic'
      }
    });
  }

  return (
    <>
      <h4>{joke?.value}</h4>
      <button onClick={() => setReset(!reset)}>Get New Joke</button>
    </>
  )
}

export default Joke