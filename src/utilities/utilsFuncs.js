export function convertTime(value) {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = Math.floor((value % 3600) % 60);
  const miliseconds = value * 1000;

  return {
    hours,
    minutes,
    seconds,
    miliseconds
  };
}

export function generatedId() {
  const rand = () => {
    return Math.random().toString(36).slice(2);
  };
  return rand() + rand();
}
