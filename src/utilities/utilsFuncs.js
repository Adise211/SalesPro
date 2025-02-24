import moment from "moment";

export function convertTime(value) {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = Math.floor((value % 3600) % 60);
  const miliseconds = value * 1000;
  const time12hFormat = moment(`${value}`, ["h:mm A"]).format("HH:mm");
  const time24hFormat = moment(`${value}`, ["HH:mm"]).format("h:mm A");

  return {
    hours,
    minutes,
    seconds,
    miliseconds,
    time12hFormat,
    time24hFormat
  };
}

export function generatedId() {
  const rand = () => {
    return Math.random().toString(36).slice(2);
  };
  return rand();
}

export function convertDate(value, fromEpochTime) {
  const currentValue = fromEpochTime ? value * 1000 : new Date(value);

  const ISOFormat = moment(currentValue).format("YYYY-MM-DD");
  const MDYFormat = moment(currentValue).format("MM/DD/YYYY");
  const FullDateWith12H = moment(currentValue).format("MM/DD/YYYY HH:mm");
  const FullDateWith24H = moment(currentValue).format("MM/DD/YYYY h:mm A");

  return {
    ISOFormat,
    MDYFormat,
    FullDateWith12H,
    FullDateWith24H
  };
}

export function changePropertiesToLowerCase(obj) {
  const updatedObj = Object.keys(obj).reduce((acc, key) => {
    const newKey = key.charAt(0).toLowerCase() + key.slice(1);
    acc[newKey] = obj[key];
    return acc;
  }, {});

  return updatedObj;
}
