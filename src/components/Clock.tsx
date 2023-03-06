import { useState, useEffect } from 'react'


function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  
  const day = time.getDate().toString().padStart(2, '0');
  const weekDay = new Date().toLocaleString('default', { weekday: 'short' });
  
  // const month = (time.getMonth() + 1).toString().padStart(2, '0');
  const month = new Date().toLocaleString('default', { month: 'short' });

  return (
    <div className="clock">
      <div className="time">
        {hours}:{minutes}:{seconds}
      </div>
      <div className="date">
        {weekDay} {day}-{month}
      </div>
    </div>
  )
}

export default Clock