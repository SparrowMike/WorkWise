import { useState, useEffect } from 'react'

type TimeState = {
  time: Date
}
function Time() {
  const [state, setState] = useState<TimeState>({ time: new Date() });

  useEffect(() => {
    const timer = setInterval(() => setState({ time: new Date() }), 1000)

    return () => clearInterval(timer);
  }, []);

  const { time } = state;
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className="time">
      {hours}:{minutes}:{seconds}
    </div>
  )
}

export default Time;