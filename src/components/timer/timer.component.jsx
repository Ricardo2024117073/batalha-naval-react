import { useEffect, useState } from "react";

// Timer counts down from `timeout` seconds.
// Calls onTimer(seconds) whenever the value changes.
// Resets when the component is remounted with a new key.
function Timer(props) {
  const { timeout, onTimer } = props;

  const [seconds, setSeconds] = useState(() => timeout);

  useEffect(() => {
    if (seconds <= 0) return undefined;

    const interval = setInterval(() => {
      setSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  useEffect(() => {
    if (onTimer) onTimer(seconds);
  }, [seconds, onTimer]);

  return <>{seconds}</>;
}

export default Timer;
