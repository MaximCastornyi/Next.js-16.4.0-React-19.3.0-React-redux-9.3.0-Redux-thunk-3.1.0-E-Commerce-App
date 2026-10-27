import dayjs from "dayjs";

export function calcaulateDiff(targetTimeInMs) {
  const now = dayjs();
  const target = dayjs(targetTimeInMs);
  const diffInMs = target.diff(now);

  if (diffInMs <= 0) {
    return {
      seconds: "00",
      minutes: "00",
      hours: "00",
      days: "00",
    };
  }

  const secondsTotal = Math.floor(diffInMs / 1000);
  const seconds = secondsTotal % 60;
  
  const minutesTotal = Math.floor(secondsTotal / 60);
  const minutes = minutesTotal % 60;
  
  const hoursTotal = Math.floor(minutesTotal / 60);
  const hours = hoursTotal % 24;
  
  const days = Math.floor(hoursTotal / 24);

  return {
    seconds: padWithZeros(seconds, 2),
    minutes: padWithZeros(minutes, 2),
    hours: padWithZeros(hours, 2),
    days: padWithZeros(days, 2), // или days.toString()
  };
}

function padWithZeros(number, length) {
  const numberString = number.toString();
  if (numberString.length >= length) return numberString;
  return "0".repeat(length - numberString.length) + numberString;
}