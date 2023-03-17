import { Link } from "react-router-dom"

function SettingsPage() {
  return (
    <div className='settings'>
      <div>Settings component</div>
      <Link to="/popup.html">Got to settings</Link>
    </div>
  )
}

export default SettingsPage