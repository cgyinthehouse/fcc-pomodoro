import {
  LuPlayCircle,
  LuTimerReset,
  LuAlarmMinus,
  LuAlarmPlus,
  LuPauseCircle,
} from "react-icons/lu";
import { useState, useReducer, useEffect, useRef } from "react";

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return mins + ":" + secs;
}

export default function Timer() {
  const [isOnBreak, toggleOnBreak] = useReducer((pre) => !pre, false);
  const [paused, togglePaused] = useReducer((pre) => !pre, true);
  const [breakLength, setBreakLength] = useState<number>(5);
  const [sessionLength, setSessionLength] = useState<number>(25);
  const [timerlength, setTimerLength] = useState<number>(sessionLength * 60);
  const audio = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (timerlength === 0) {
      audio?.current?.play().catch((error) => {
        console.error("An error occurred while playing the audio:", error);
      });
      toggleOnBreak();
      setTimerLength((isOnBreak ? sessionLength : breakLength) * 60);
    }
  }, [breakLength, isOnBreak, sessionLength, timerlength]);

  useEffect(() => {
    if (paused) return;
    const timerId = setInterval(() => {
      setTimerLength((pre) => pre - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [paused]);

  function reset() {
    paused || togglePaused();
    isOnBreak && toggleOnBreak();
    audio.current!.pause()
    audio.current!.currentTime = 0;
    setBreakLength(5);
    setSessionLength(25);
    setTimerLength(1500);
  }

  // FIXME: find out why the tester reports 'Time has reached zero but didn't switch to Break/Session time' sometimes

  const decease = (sessionState: "break" | "session") => {
    if (!paused) return;
    const length = sessionState == "break" ? breakLength : sessionLength;
    const newLength = length < 2 ? 1 : length - 1;
    if (sessionState == "break") setBreakLength(newLength);
    else setSessionLength(newLength);
    if (
      (!isOnBreak && sessionState == "session") ||
      (isOnBreak && sessionState == "break")
    )
      setTimerLength(newLength * 60);
  };

  const increase = (sessionState: "break" | "session") => {
    if (!paused) return;
    const length = sessionState == "break" ? breakLength : sessionLength;
    const newLength = length > 59 ? 60 : length + 1;
    if (sessionState == "break") setBreakLength(newLength);
    else setSessionLength(newLength);
    if (
      (!isOnBreak && sessionState == "session") ||
      (isOnBreak && sessionState == "break")
    )
      setTimerLength(newLength * 60);
  };

  return (
    <section className="timer">
      <div>
        <label htmlFor="break-length" id="break-label">
          Break Length
        </label>
        <div id="break-length">{breakLength}</div>
        <button id="break-decrement" onClick={() => decease("break")}>
          <LuAlarmMinus title="decrease break length by 1" />
        </button>
        <button id="break-increment" onClick={() => increase("break")}>
          <LuAlarmPlus title="increase break length by 1" />
        </button>
      </div>

      <div>
        <label htmlFor="session-length" id="session-label">
          Session Length
        </label>
        <div id="session-length">{sessionLength}</div>
        <button id="session-decrement" onClick={() => decease("session")}>
          <LuAlarmMinus title="decrease session length by 1" />
        </button>
        <button id="session-increment" onClick={() => increase("session")}>
          <LuAlarmPlus title="increase session length by 1" />
        </button>
      </div>

      <div>
        <label htmlFor="time-left" id="timer-label">
          {isOnBreak ? "Break" : "Session"}
        </label>
        <div id="time-left">{formatTime(timerlength)}</div>
        <button id="start_stop" onClick={togglePaused}>
          {paused ? (
            <LuPlayCircle title="start" />
          ) : (
            <LuPauseCircle title="stop" />
          )}
        </button>
        <button id="reset" onClick={reset}>
          <LuTimerReset title="reset" />
        </button>
      </div>
      <audio id="beep" ref={audio} preload="auto" src="/rr-trimed.mov"></audio>
    </section>
  );
}
