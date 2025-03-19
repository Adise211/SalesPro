import moment from "moment";

export function convertTime(value) {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = Math.floor((value % 3600) % 60);
  const miliseconds = value * 1000;
  const time12hFormat = moment(value, "HH:mm").format("h:mm A");
  const time24hFormat = moment(value, "h:mm A").format("HH:mm");

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

export function convertDate(value) {
  const currentValue = new Date(value);
  const ISOFormat = moment(currentValue).format("YYYY-MM-DD");
  const MDYFormat = moment(currentValue).format("MM/DD/YYYY");
  const MDYWith24H = moment(currentValue).format("MM/DD/YYYY HH:mm");
  const MDYWith12H = moment(currentValue).format("MM/DD/YYYY h:mm A");
  const MilliTimestamp = moment(currentValue).format("x");

  return {
    ISOFormat,
    MDYFormat,
    MDYWith24H,
    MDYWith12H,
    MilliTimestamp
  };
}

export function convertEpochMilliToDate(value) {
  return moment(value, "x").format("MM/DD/YYYY");
}

export function changePropertiesToLowerCase(obj) {
  const updatedObj = Object.keys(obj).reduce((acc, key) => {
    const newKey = key.charAt(0).toLowerCase() + key.slice(1);
    acc[newKey] = obj[key];
    return acc;
  }, {});

  return updatedObj;
}
