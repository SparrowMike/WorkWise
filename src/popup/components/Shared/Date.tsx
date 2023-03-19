import { useState, useEffect } from 'react'

function CurrentDate() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)

    return () => clearInterval(timer);
  }, []);

  const day = time.getDate().toString().padStart(2, '0');
  const weekDay = new Date().toLocaleString('default', { weekday: 'short' });

  // const month = (time.getMonth() + 1).toString().padStart(2, '0');
  const month = new Date().toLocaleString('default', { month: 'short' });

  return (
    <div className="date">
      {weekDay} {day}-{month}
    </div>
  )
}

export default CurrentDate;