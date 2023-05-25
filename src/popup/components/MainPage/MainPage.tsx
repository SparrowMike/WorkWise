import { Link } from 'react-router-dom'
import Clock from '../Shared/Clock'
import Joke from '../Shared/Joke'
import Quote from './Quote'
import Tracker from './Tracker'

import Settings from './../../../assets/svg/settings.svg'
function MainPage() {
  return (
    <div className='popup'>
      <div className="popup__header container">
        <div className="settings-icon">
          <Link className="link" to="/settings">
            <Settings />
          </Link>
        </div>
        <Clock />
      </div>
      <div className="popup__quote container">
        <Quote />
      </div>
      <div className="popup__reminders">
        <Tracker />
      </div>

      {/* <Joke /> */}
    </div>
  )
}

export default MainPage