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
      <div className="navigation-container">
        <Link className="link" to="/settings">Go to settings</Link>
      </div>
    </div>
  )
}

export default MainPage