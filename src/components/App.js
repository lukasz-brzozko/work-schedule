import React from "react";
import "./css/App.css";
import Input from "./Input";
import Loader from "./Loader";
import DayInfo from "./DayInfo";
import { today } from "./GlobalVars";
class App extends React.Component {
  state = {
    inputValue: today,
    todayResultContent: "",
    oneDayLaterResultContent: "",
    twoDaysLaterResultContent: "",
    threeDaysLaterResultContent: "",
    imgVisible: true
  };

  handleInputChange = e => {
    this.setState({
      inputValue: e.target.value,
      todayResultContent: "",
      oneDayLaterResultContent: "",
      twoDaysLaterResultContent: "",
      threeDaysLaterResultContent: "",
      imgVisible: true
    });
    this.fetchData(e.target.value);
  };

  formatID = number =>
    number.toLocaleString("en-US", {
      minimumIntegerDigits: 3,
      useGrouping: false
    });

  fetchData = (date, dayOffset) => {
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
        const result = res[keyName[0]].work;
        let objectID = res[keyName[0]].id;
        objectID = parseInt(objectID);
        const startData = this.formatID(objectID + 1);
        const endData = this.formatID(objectID + 3);

        this.setState({
          imgVisible: false,
          todayResultContent: result
        });
        return fetch(
          `https://schedule-20022.firebaseio.com/workdays/items.json?orderBy=%22id%22&startAt=%22${startData}%22&endAt=%22${endData}%22`
        )
          .then(response => response.json())
          .then(nextRes => {
            const keyNames = Object.keys(nextRes);
            const oneDayRes = nextRes[keyNames[0]].work;
            const twoDaysRes = nextRes[keyNames[1]].work;
            const threeDaysRes = nextRes[keyNames[2]].work;
            console.log(nextRes);
            this.setState({
              oneDayLaterResultContent: oneDayRes,
              twoDaysLaterResultContent: twoDaysRes,
              threeDaysLaterResultContent: threeDaysRes
            });
          });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          imgVisible: false,
          todayResultContent: "Brak danych"
        });
      });
  };
  componentDidMount() {
    this.fetchData(today);
  }

  render() {
    return (
      <React.Fragment>
        <section id="now" className="now-section">
          <header>
            <h1 className="title">Wybierz dzień</h1>
          </header>
          <div className="center">
            <Input
              value={this.state.inputValue}
              change={this.handleInputChange}
            />
            <div className="container">
              {this.state.imgVisible ? <Loader /> : null}

              <span id="main-result" className="result">
                {this.state.todayResultContent}
              </span>
            </div>
          </div>
        </section>
        <section id="next-days" className="next-days-section">
          <DayInfo
            date={this.state.inputValue}
            miliseconds="86400000"
            answer={this.state.oneDayLaterResultContent}
            loaderVisibility={this.state.imgVisible}
          />
          {/* 1 day later*/}
          <DayInfo
            date={this.state.inputValue}
            miliseconds="172800000"
            answer={this.state.twoDaysLaterResultContent}
            loaderVisibility={this.state.imgVisible}
          />
          {/* 2 days later*/}
          <DayInfo
            date={this.state.inputValue}
            miliseconds="259200000"
            answer={this.state.threeDaysLaterResultContent}
            loaderVisibility={this.state.imgVisible}
          />
          {/* 3 days later*/}
        </section>
      </React.Fragment>
    );
  }
}
export default App;
