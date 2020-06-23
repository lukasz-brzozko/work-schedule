export const arrowType = "fas fa-angle-down";

const date = new Date();

const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();
const today = `${year}-${month < 10 ? "0" + month : month}-${
  day < 10 ? "0" + day : day
}`;

const dateWithoutYear = today.slice(4);
const minYearValue = `${year - 1}${dateWithoutYear}`;
const maxYearValue = `${year + 1}${dateWithoutYear}`;

const GlobalVars = {
  date,
  today,
  minYearValue,
  maxYearValue
};
export default GlobalVars;
