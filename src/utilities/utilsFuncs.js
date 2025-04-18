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

// Function to convert full time string to a shortened version
export function shortenTimeString(timeString) {
  const conversions = {
    minute: "min",
    minutes: "min",
    hour: "hr",
    hours: "hrs",
    day: "d",
    days: "d",
    month: "mo",
    months: "mos",
    year: "yr",
    years: "yrs"
  };

  // Loop through the conversions and replace full words with short forms
  Object.keys(conversions).forEach((key) => {
    const regex = new RegExp(`\\b${key}\\b`, "g"); // To match full words
    timeString = timeString.replace(regex, conversions[key]);
  });

  return timeString;
}

export function convertEpochMilliToTimeFromNow(value) {
  const timeFromNow = moment(value, "x").fromNow(true);
  const shortenedResult = shortenTimeString(timeFromNow).replace(/a|an/, "1");

  return shortenedResult;
}

export function changePropertiesToLowerCase(obj) {
  const updatedObj = Object.keys(obj).reduce((acc, key) => {
    const newKey = key.charAt(0).toLowerCase() + key.slice(1);
    acc[newKey] = obj[key];
    return acc;
  }, {});

  return updatedObj;
}

export function convertLocationToString(locationObject) {
  const ORDERED_ARR = [];
  if (locationObject.Address1) ORDERED_ARR.push(locationObject.Address1);
  if (locationObject.Address2) ORDERED_ARR.push(locationObject.Address2);
  if (locationObject.City) ORDERED_ARR.push(locationObject.City);
  if (locationObject.State) ORDERED_ARR.push(locationObject.State);
  if (locationObject.Country) ORDERED_ARR.push(locationObject.Country);
  if (locationObject.ZipeCode) ORDERED_ARR.push(locationObject.ZipeCode);

  return ORDERED_ARR.toString();
}
