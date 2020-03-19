export const arrowType = "fas fa-angle-down";
const date = new Date();
const year = date.getFullYear();

const today = date.toISOString().slice(0, 10);
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
