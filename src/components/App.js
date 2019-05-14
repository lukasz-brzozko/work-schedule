import React from "react";
import "./css/App.css";
import Input from "./Input";
import DayInfo from "./DayInfo";
import GlobalVars from "./GlobalVars";

class App extends React.Component {
  state = {
    inputValue: GlobalVars.today,
    todayResultContent: ""
  };

  handleInputChange = e => {
    this.setState({
      inputValue: e.target.value,
      todayResultContent: ""
    });
  };

  render() {
    return (
      <React.Fragment>
        <section id="now" className="now-section">
          <header>
            <h1 className="title">Wybierz dzień</h1>
          </header>
          <Input
            value={this.state.inputValue}
            change={this.handleInputChange}
          />
          <DayInfo />
        </section>
      </React.Fragment>
    );
  }
}

export default App;
