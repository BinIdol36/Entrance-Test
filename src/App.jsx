import { useEffect, useState } from 'react';

const textButton = {
  play: 'Play',
  restart: 'Restart',
};

const titleStatus = {
  start: "LET'S PLAY",
  win: 'ALL CLEARED',
  lose: 'GAME OVER',
};

function App() {
  const [points, setPoints] = useState(3);
  const [numbers, setNumbers] = useState([]);
  const [textBtn, setTextBtn] = useState(textButton.play);
  const [time, setTime] = useState(0);
  const [runTime, setRunTime] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [title, setTitle] = useState(titleStatus.start);

  useEffect(() => {
    let interval = null;

    if (runTime) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else if (!runTime && time !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [runTime, time]);

  const formatTime = (time) => {
    const seconds = (time / 1000).toFixed(1);
    return seconds;
  };

  const handleChangePoints = (number) => {
    const check = Number(number);

    if (!check) {
      console.log('Input is not number!');
      setPoints(1);
    } else if (number <= 0) {
      console.log('Input must be greater than or equal to 1!');
      setPoints(1);
    } else {
      setPoints(number);
    }
  };

  const handlePlay = (text) => {
    const newNumbers = [];

    for (let i = 1; i <= points; i++) {
      newNumbers.push({
        value: i,
        x: Math.random() * 90 + '%',
        y: Math.random() * 90 + '%',
        zIndex: points - i + 1,
      });
    }

    if (text === textButton.play) {
      setNumbers(newNumbers);
      setRunTime(true);
      setTextBtn(textButton.restart);
    } else if (text === textButton.restart) {
      setNumbers(newNumbers);
      setTime(0);
      setRunTime(true);
      setCurrentNumber(1);
      setTitle(titleStatus.start);
    }
  };

  const handleClick = (value) => {
    if (title === titleStatus.start) {
      if (value === currentNumber) {
        setNumbers(
          numbers.map((number) =>
            number.value === value ? { ...number, clicked: true } : number,
          ),
        );
        setCurrentNumber(currentNumber + 1);
      } else {
        setRunTime(false);
        setTitle(titleStatus.lose);
      }
    }
  };

  useEffect(() => {
    if (
      textButton.restart === textBtn &&
      numbers.every((number) => number.clicked)
    ) {
      setRunTime(false);
      setTitle(titleStatus.win);
    }
  }, [numbers, textBtn]);

  return (
    <main>
      <h2
        style={{
          color:
            titleStatus.win === title
              ? 'green'
              : titleStatus.lose === title
              ? 'red'
              : 'black',
        }}>
        {title}
      </h2>
      <div>
        <p>Points:</p>
        <input
          type='text'
          value={points}
          onChange={(e) => handleChangePoints(e.target.value)}
        />
      </div>
      <div>
        <p>Time:</p>
        <p>{formatTime(time)}s</p>
      </div>
      <div>
        <button onClick={() => handlePlay(textBtn)}>{textBtn}</button>
      </div>
      <div className='box'>
        {numbers.map((number, index) => (
          <div
            key={index}
            className='box_item'
            onClick={() => handleClick(number.value, title)}
            style={{
              position: 'absolute',
              left: number.x,
              top: number.y,
              zIndex: number.zIndex,
              backgroundColor: number.clicked ? 'red' : 'white',
              opacity: number.clicked ? '0' : '1',
              transition: 'opacity 1s',
              cursor: number.clicked ? 'default' : 'pointer',
              pointerEvents: number.clicked ? 'none' : 'auto',
            }}>
            {number.value}
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
