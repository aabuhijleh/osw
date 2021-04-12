const isDST = require("is-dst");
const HijrahDate = require("hijrah-date");

const getDateFromDateString = (dateString) => {
  const dateParts = dateString.split("/");
  return new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0], "12");
};

const isRamadan = (date) =>
  new HijrahDate(date).format("MMMM", "en") === "Ramadan";

const getWorkPeriod = (dateString) => {
  const date = getDateFromDateString(dateString);

  let start = "08:30";
  let end = isDST(date) ? "05:30" : "05:00";

  if (isRamadan(date)) {
    start = "09:00";
    end = "03:30";
  }

  return { start, end };
};

module.exports = getWorkPeriod;
