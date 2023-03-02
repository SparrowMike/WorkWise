import { ChuckNorrisJoke } from "../interfaces/chuckJoke";

export const getFunnyChuck = async ()  => {
  const response = await fetch(`https://api.chucknorris.io/jokes/random`);
  if (!response.ok) {
    throw new Error('Network response was not ok.');
  }
  const data = await response.json();
  return data as ChuckNorrisJoke;
};