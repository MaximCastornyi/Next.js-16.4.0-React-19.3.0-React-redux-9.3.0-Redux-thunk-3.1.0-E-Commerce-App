import { useEffect, useState, useMemo } from "react";
import styles from "./styles.module.scss";
import { calcaulateDiff } from "./utils";

export default function Countdown({ date }) {
  // Превращаем date в миллисекунды стабильно, чтобы объект не сбрасывал таймер зря
  const targetTime = useMemo(() => {
    return date instanceof Date ? date.getTime() : new Date(date).getTime();
  }, [date]);

  const [remainingTime, setRemainingTime] = useState(() => calcaulateDiff(targetTime));

  useEffect(() => {
    // Сразу обновляем при монтировании или смене даты
    setRemainingTime(calcaulateDiff(targetTime));

    const interval = setInterval(() => {
      // Каждый тик заново вычисляем разницу между целевой датой и текущим моментом времени (dayjs())
      setRemainingTime(calcaulateDiff(targetTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  return (
    <div className={styles.countdown}>
      {/* Вывод дней (если дней больше нет, можно оставить или выводить посимвольно) */}
      <span>{remainingTime?.days?.slice(0, 1)}</span>
      <span>{remainingTime?.days?.slice(1, 2)}</span>
      <b>:</b>
      <span>{remainingTime?.hours?.slice(0, 1)}</span>
      <span>{remainingTime?.hours?.slice(1, 2)}</span>
      <b>:</b>
      <span>{remainingTime?.minutes?.slice(0, 1)}</span>
      <span>{remainingTime?.minutes?.slice(1, 2)}</span>
      <b>:</b>
      <span>{remainingTime?.seconds?.slice(0, 1)}</span>
      <span>{remainingTime?.seconds?.slice(1, 2)}</span>
    </div>
  );
}