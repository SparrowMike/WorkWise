import './styles/css/style.css';
import Clock from './components/Clock';
import Joke from './components/Joke';
import Tracker from './components/Tracker';
import Quote from './components/Quote';

function App() {

  return (
    <div className="App">
      <Clock/>
      {/* <Joke/>  */}
      <Quote/>
      <Tracker/>
    </div>
  )
}

export default App
