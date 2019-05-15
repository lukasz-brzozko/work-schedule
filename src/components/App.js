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
    threeDaysLaterResultContent: ""
  };

  handleInputChange = e => {
    this.setState({
      inputValue: e.target.value,
      todayResultContent: "",
      oneDayLaterResultContent: "",
      twoDaysLaterResultContent: "",
      threeDaysLaterResultContent: ""
    });
  };

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
        <section id="next-days">
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
