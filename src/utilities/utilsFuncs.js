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
  return rand() + rand();
}

export function convertDate(value) {
  const ISOFormat = moment(new Date(value)).format("YYYY-MM-DD");
  const MDYFormat = moment(new Date(value)).format("MM/DD/YYYY");

  return {
    ISOFormat,
    MDYFormat
  };
}
