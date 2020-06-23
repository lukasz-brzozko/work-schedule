import React from "react";
import Input from "./Input";
import Loader from "./Loader";
import DayInfo from "./DayInfo";
import Arrows from "./Arrows";
import GlobalVars from "./GlobalVars";
import { getDatabase } from "../common/firebase";
import moment from "moment";
import "moment/locale/pl";

class HomeView extends React.Component {
  constructor() {
    super();
    this.queryParam = "date";
    this.noDataTxt = "BRAK DANYCH";
  }

  state = {
    inputValue: GlobalVars.today,
    todayResultContent: "",
    oneDayLaterResultContent: "",
    twoDaysLaterResultContent: "",
    threeDaysLaterResultContent: "",
    isLoaderVisible: true,
    mobCompisVisible: false,
  };

  handleInputChange = (e) => {
    const value = e.target.value;

    this.setState({
      inputValue: value,
      todayResultContent: "",
      oneDayLaterResultContent: "",
      twoDaysLaterResultContent: "",
      threeDaysLaterResultContent: "",
      isLoaderVisible: true,
    });
    this.fetchData(value);
  };
  handleButtonClick = (e) => {
    const nextDaysSec = document.getElementById("next-days");
    nextDaysSec.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  };

  checkStateForMobComp = () => {
    const width = window.innerWidth;
    if (width < 415) this.setState({ mobCompisVisible: true });
    else this.setState({ mobCompisVisible: false });
  };

  setTxtColor = (content) => {
    switch (content) {
      case "NA DZIEŃ":
        return " day";
      case "NA NOC":
        return " night";
      case "BRAK DANYCH":
        return " no-data";
      default:
        return " day-off";
    }
  };
  setNoData = () => {
    this.setState({
      isLoaderVisible: false,
      todayResultContent: this.noDataTxt,
      oneDayLaterResultContent: this.noDataTxt,
      twoDaysLaterResultContent: this.noDataTxt,
      threeDaysLaterResultContent: this.noDataTxt,
    });
  };

  fetchData = async (startDate, init = false) => {
    moment.locale("pl");
    let requestedDate = startDate;

    if (init) {
      requestedDate = this.getQueryParam(this.queryParam);
    }

    if (!requestedDate) {
      this.setNoData();
      return;
    }
    const nextDates = [];
    for (let i = 1; i < 4; i++) {
      const date = moment(requestedDate).add(i, "days").format("YYYY-MM-DD");
      nextDates.push(date);
    }

    const db = await getDatabase();
    db.ref(`/workdays2`)
      .orderByKey()
      .startAt(requestedDate)
      .endAt(nextDates[nextDates.length - 1])
      .once(
        "value",
        (snap) => {
          const data = snap.val();
          if (data) {
            this.setState({
              isLoaderVisible: false,
              todayResultContent: data[requestedDate] || this.noDataTxt,
              oneDayLaterResultContent: data[nextDates[0]] || this.noDataTxt,
              twoDaysLaterResultContent: data[nextDates[1]] || this.noDataTxt,
              threeDaysLaterResultContent: data[nextDates[2]] || this.noDataTxt,
            });
          } else {
            this.setNoData();
          }
        },
        (err) => {
          console.log(err);
        }
      );
  };

  isDateFormatValid = (data) => {
    const isValid = moment(data, "YYYY-MM-DD", true).isValid();
    return isValid;
  };

  getQueryParam = (param) => {
    const urlParams = new URLSearchParams(this.props.location.search);
    const myParam = urlParams.get(param);

    const isDataValid = this.isDateFormatValid(myParam);
    if (isDataValid) {
      this.setState({ inputValue: myParam });
      return myParam;
    }
    return GlobalVars.today;
  };

  componentDidMount() {
    this.checkStateForMobComp();
    this.fetchData(this.state.inputValue, true);
    window.addEventListener("resize", this.checkStateForMobComp);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.checkStateForMobComp);
  }
  render() {
    const { maxYearValue, minYearValue } = GlobalVars;
    return (
      <React.Fragment>
        {/* <Topbar /> */}
        <section id="now" className="now-section">
          <div className="center">
            <Input
              value={this.state.inputValue}
              change={this.handleInputChange}
              min={minYearValue}
              max={maxYearValue}
            />
            <div className="container main">
              {this.state.isLoaderVisible && <Loader />}
              <span
                id="main-result"
                className={`result${
                  this.state.todayResultContent &&
                  this.setTxtColor(this.state.todayResultContent)
                }`}
              >
                {this.state.todayResultContent}
              </span>
            </div>
          </div>
          {this.state.mobCompisVisible ? (
            <Arrows click={this.handleButtonClick} />
          ) : (
            <p className="show-more">Kolejne 3 dni</p>
          )}
        </section>
        <section id="next-days" className="next-days-section">
          <DayInfo
            setTxtColor={this.setTxtColor}
            date={moment(this.state.inputValue)
              .add(1, "d")
              .format("dd, DD.MM.YYYY")}
            loaderVisibility={this.state.isLoaderVisible}
          >
            {this.state.oneDayLaterResultContent}
          </DayInfo>
          <DayInfo
            setTxtColor={this.setTxtColor}
            date={moment(this.state.inputValue)
              .add(2, "d")
              .format("dd, DD.MM.YYYY")}
            loaderVisibility={this.state.isLoaderVisible}
          >
            {this.state.twoDaysLaterResultContent}
          </DayInfo>
          <DayInfo
            setTxtColor={this.setTxtColor}
            date={moment(this.state.inputValue)
              .add(3, "d")
              .format("dd, DD.MM.YYYY")}
            loaderVisibility={this.state.isLoaderVisible}
          >
            {this.state.threeDaysLaterResultContent}
          </DayInfo>
        </section>
      </React.Fragment>
    );
  }
}
export default HomeView;
