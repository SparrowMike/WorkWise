/*global chrome*/
import './styles/css/style.css';
import Clock from './components/Clock';
import Joke from './components/Joke';

function App() {
  return (
    <div className="App">
      <Clock/>
      <Joke/> 
    </div>
  )
}

export default App
