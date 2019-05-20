const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();
export const today = `${year}-${month < 10 ? "0" + month : month}-${
  day < 10 ? "0" + day : day
}`;
let nextDay;
export const fetchErrTxt = "Brak danych";

const GlobalVars = {
  date,
  year,
  month,
  day,
  today,
  nextDay
};
export default GlobalVars;
