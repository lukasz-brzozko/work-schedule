import React from "react";
import { getAuth, getDatabase } from "../common/firebase";
import Input from "./Input";
import Topbar from "./Topbar";
import ConfirmationWidget from "./ConfirmationWidget";
import moment from "moment";

class PanelView extends React.Component {
  constructor() {
    super();
    this.getUnsubscribeRef = null;
    this.user = null;
  }
  state = {
    txtInputValue: "",
    firstDay: "",
    secondDay: "",
    loading: true,
    logged: false,
    mode: "day",
    sendingSuccess: false,
    sendingFailed: false,
    isConfirmationVisible: false
  };

  addAuthListening = () => {
    const auth = getAuth();
    const ref = auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          logged: true
        });
      } else {
        this.props.history.push("/login");
      }
    });
    return ref;
  };

  signUserOut = () => {
    const auth = getAuth();
    auth.signOut();
    this.props.history.goBack();
  };
  handleModeSelectionChange = e => {
    this.setState({ mode: e.target.value });
  };

  hideSendingSuccess = e => {
    this.setState({
      sendingSuccess: false,
      txtInputValue: ""
    });
  };

  handleTxtInputChange = e => {
    this.setState({
      txtInputValue: e.target.value,
      sendingFailed: false
    });
  };
  handleDateInputChange = (e, dayId = 1) => {
    if (dayId === 1) {
      return this.setState({ firstDay: e.target.value });
    }
    this.setState({ secondDay: e.target.value });
  };
  showConfirmation = e => {
    e.preventDefault();
    if (this.state.firstDay && this.state.txtInputValue) {
      if (
        (this.state.mode === "range" && this.state.secondDay) ||
        this.state.mode === "day"
      ) {
        this.setState({ isConfirmationVisible: true });
      }
    }
  };
  hideConfirmationWidget = () => {
    this.setState({ isConfirmationVisible: false });
  };
  sendToDatabase = async e => {
    const { mode } = this.state;
    this.hideConfirmationWidget();
    const txtInputValue = this.state.txtInputValue.toUpperCase();
    const { firstDay, secondDay } = this.state;
    if (txtInputValue && firstDay) {
      const db = await getDatabase();
      if (mode === "day") {
        db.ref("workdays2").update(
          {
            [firstDay]: txtInputValue
          },
          err => {
            if (!err) {
              this.setState({
                txtInputValue: "Sukces \u2713",
                sendingSuccess: true
              });
              setTimeout(this.hideSendingSuccess, 2000);
              return;
            }
            return this.setState({ sendingFailed: true });
          }
        );
      } else {
        if (secondDay && secondDay > firstDay) {
          const firstDayDateObj = moment(firstDay, moment.ISO_8601);
          const secondDayDateObj = moment(secondDay, moment.ISO_8601);
          const fullDays =
            (secondDayDateObj - firstDayDateObj) / 1000 / 60 / 60 / 24;
          const payload = {};
          for (let i = 0; i <= fullDays; i++) {
            const date = moment(firstDay, moment.ISO_8601).add(i, "days")._d;
            const year = moment(date).isoWeekYear();
            const month = moment(date).month() + 1;
            const day = moment(date).date();

            const dateInFormat = `${year}-${month < 10 ? "0" + month : month}-${
              day < 10 ? "0" + day : day
            }`;
            payload[dateInFormat] = txtInputValue;
          }
          db.ref("workdays2").update(payload, err => {
            if (!err) {
              this.setState({
                txtInputValue: "Sukces \u2713",
                sendingSuccess: true
              });
              setTimeout(this.hideSendingSuccess, 2000);
              return;
            }
            return this.setState({ sendingFailed: true });
            // dodać handler dla błędu
          });
        }
      }
    }
  };

  signUserOut = () => {
    const auth = getAuth();
    auth.signOut();
    this.props.history.goBack();
  };

  componentDidMount() {
    this.getUnsubscribeRef = this.addAuthListening();
  }

  componentWillUnmount() {
    this.getUnsubscribeRef();
  }

  render() {
    return (
      <>
        {this.state.logged && (
          <>
            <Topbar />
            <section className="panel-view">
              <form
                className={`panel-view__form${
                  this.state.isConfirmationVisible
                    ? " panel-view__form--blurred"
                    : ""
                }`}
              >
                <select
                  className="panel-view__mode-selection"
                  onChange={this.handleModeSelectionChange}
                  defaultValue="day"
                >
                  <option className="panel-view__mode-option" value="day">
                    Dzień
                  </option>
                  <option className="panel-view__mode-option" value="range">
                    Zakres dni
                  </option>
                </select>
                <div className="panel-view__date-container">
                  <Input
                    modifier="--smaller"
                    name="first-day"
                    value={this.state.firstDay}
                    change={e => this.handleDateInputChange(e, 1)}
                  />
                  {this.state.mode === "range" && (
                    <Input
                      modifier="--smaller"
                      name="second-day"
                      value={this.state.secondDay}
                      change={e => this.handleDateInputChange(e, 2)}
                    />
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Dodaj opis"
                  className={`panel-view__input panel-view__input--text${
                    this.state.sendingSuccess
                      ? " panel-view__input--text-success"
                      : ""
                  }${
                    this.state.sendingFailed
                      ? " panel-view__input--text-fail"
                      : ""
                  }`}
                  maxLength={20}
                  minLength={3}
                  value={this.state.txtInputValue}
                  onChange={this.handleTxtInputChange}
                  required
                />
                <button
                  className="panel-view__button"
                  onClick={this.showConfirmation}
                >
                  Wyślij
                </button>
              </form>
              {this.state.isConfirmationVisible && (
                <ConfirmationWidget
                  yesBtn={this.sendToDatabase}
                  noBtn={this.hideConfirmationWidget}
                >
                  Czy na pewno wysłać?
                </ConfirmationWidget>
              )}
            </section>
          </>
        )}
      </>
    );
  }
}

export default PanelView;