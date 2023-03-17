import { Link } from 'react-router-dom'
import Joke from '../Shared/Joke'
import Quote from './Quote'
import Tracker from './Tracker'

function MainPage() {
  return (
    <div>      
      {/* <Joke /> */}
      <Quote />
      <Tracker />
      <Link to="/settings">Got to settings</Link>
    </div>
  )
}

export default MainPage