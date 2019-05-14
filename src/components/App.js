import React from "react";
import "./App.css";
import Input from "./Input";

class App extends React.Component {
  state = {
    inputValue: "",
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
        </section>
      </React.Fragment>
    );
  }
}

export default App;
