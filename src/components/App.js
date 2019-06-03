import React from "react";
import "./css/App.css";
import Input from "./Input";
import Loader from "./Loader";
import DayInfo from "./DayInfo";
import Arrows from "./Arrows";
import { today, fetchErrTxt } from "./GlobalVars";
class App extends React.Component {
  state = {
    inputValue: today,
    todayResultContent: "",
    oneDayLaterResultContent: "",
    twoDaysLaterResultContent: "",
    threeDaysLaterResultContent: "",
    mainLoaderVisible: true,
    nxtDaysloaderVisible: true,
    mobCompisVisible: false
  };

  handleInputChange = e => {
    this.setState({
      inputValue: e.target.value,
      todayResultContent: "",
      oneDayLaterResultContent: "",
      twoDaysLaterResultContent: "",
      threeDaysLaterResultContent: "",
      mainLoaderVisible: true,
      nxtDaysloaderVisible: true
    });
    this.fetchData(e.target.value);
  };
  handleButtonClick = e => {
    const nextDaysSec = document.getElementById("next-days");
    nextDaysSec.scrollIntoView({
      behavior: "smooth",
      // block: "start",
      block: "center",
      inline: "center"
    });
  };

  formatID = number =>
    number.toLocaleString("en-US", {
      minimumIntegerDigits: 3,
      useGrouping: false
    });

  checkStateForMobComp = () => {
    const width = window.innerWidth;
    if (width < 415) this.setState({ mobCompisVisible: true });
    else this.setState({ mobCompisVisible: false });
  };

  setTxtColor = (resultDay, index) => {
    let results;
    if (index === 1) {
      results = document.querySelectorAll("#main-result");
    } else {
      results = document.querySelectorAll(".next-days-section .result");
    }
    results.forEach((result, index) => {
      switch (resultDay[index]) {
        case "NA DZIEŃ":
          result.className = "result day";
          break;
        case "NA NOC":
          result.className = " result night";
          break;
        case "BRAK DANYCH":
          result.className = "result no-data";
          break;
        default:
          result.className = "result day-off";
      }
    });
  };
  fetchData = date => {
    fetch(
      `https://schedule-20022.firebaseio.com/workdays/items.json?orderBy=%22day%22&equalTo=%22${date}%22`
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error();
        }
      })
      .then(res => {
        const keyName = Object.keys(res);
        const result = [res[keyName[0]].work];
        let objectID = res[keyName[0]].id;
        objectID = parseInt(objectID);
        const startData = this.formatID(objectID + 1);
        const endData = this.formatID(objectID + 3);
        this.setTxtColor(result, 1);

        this.setState({
          mainLoaderVisible: false,
          todayResultContent: result
        });
        return fetch(
          `https://schedule-20022.firebaseio.com/workdays/items.json?orderBy=%22id%22&startAt=%22${startData}%22&endAt=%22${endData}%22`
        )
          .then(response => response.json())
          .then(nextRes => {
            const keyNames = Object.keys(nextRes);
            const result = [];
            const oneDayRes = nextRes[keyNames[0]].work;
            const twoDaysRes = nextRes[keyNames[1]].work;
            const threeDaysRes = nextRes[keyNames[2]].work;

            result.push(oneDayRes, twoDaysRes, threeDaysRes);
            this.setTxtColor(result, 2);
            this.setState({
              nxtDaysloaderVisible: false,
              oneDayLaterResultContent: oneDayRes,
              twoDaysLaterResultContent: twoDaysRes,
              threeDaysLaterResultContent: threeDaysRes
            });
          });
      })
      .catch(err => {
        document
          .querySelectorAll(".result")
          .forEach(result => (result.className = "result no-data"));
        this.setState({
          mainLoaderVisible: false,
          todayResultContent: fetchErrTxt,
          nxtDaysloaderVisible: false,
          oneDayLaterResultContent: fetchErrTxt,
          twoDaysLaterResultContent: fetchErrTxt,
          threeDaysLaterResultContent: fetchErrTxt
        });
      });
  };
  componentDidMount() {
    this.checkStateForMobComp();
    this.fetchData(today);
    window.addEventListener("resize", this.checkStateForMobComp);
  }
  componentWillUnmount() {
    window.removEventListener("resize", this.checkStateForMobComp);
  }
  render() {
    return (
      <React.Fragment>
        <section id="now" className="now-section">
          <header className="title-header">
            <h1 className="title">Wybierz dzień</h1>
          </header>
          <div className="center">
            <Input
              value={this.state.inputValue}
              change={this.handleInputChange}
            />
            <div className="container main">
              {this.state.mainLoaderVisible ? <Loader /> : null}
              <span id="main-result" className="result">
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
            date={this.state.inputValue}
            miliseconds="86400000"
            answer={this.state.oneDayLaterResultContent}
            loaderVisibility={this.state.nxtDaysloaderVisible}
          />
          {/* 1 day later*/}
          <DayInfo
            date={this.state.inputValue}
            miliseconds="172800000"
            answer={this.state.twoDaysLaterResultContent}
            loaderVisibility={this.state.nxtDaysloaderVisible}
          />
          {/* 2 days later*/}
          <DayInfo
            date={this.state.inputValue}
            miliseconds="259200000"
            answer={this.state.threeDaysLaterResultContent}
            loaderVisibility={this.state.nxtDaysloaderVisible}
          />
          {/* 3 days later*/}
        </section>
      </React.Fragment>
    );
  }
}
export default App;
