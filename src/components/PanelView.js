import React from "react";
import { getAuth, getDatabase } from "../common/firebase";
import Input from "./Input";
import ConfirmationWidget from "./ConfirmationWidget";
import moment from "moment";
import InputcheckBox from "./InputCheckbox";

class PanelView extends React.Component {
  constructor() {
    super();
    this.getUnsubscribeRef = null;
    this.user = null;
    this.confirmationTxt = "";
    this.topbar = null;
    this.notification = {
      url: "https://onesignal.com/api/v1/notifications",
      key: null,
    };
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
    isConfirmationVisible: false,
    dbResetActive: false,
    isFormFilled: false,
    sendNotificationInputChecked: true,
  };

  addAuthListening = () => {
    const auth = getAuth();
    const ref = auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          logged: true,
        });
      } else {
        this.props.history.replace("/login");
      }
    });
    return ref;
  };

  signUserOut = () => {
    const auth = getAuth();
    auth.signOut();
    this.props.history.goBack();
  };
  handleModeSelectionChange = (e) => {
    const value = e.target.value;

    if (value === "day") {
      this.setState({ secondDay: "" });
    }
    this.setState({ mode: e.target.value });
  };

  hideSendingSuccess = (e) => {
    this.setState({
      sendingSuccess: false,
      txtInputValue: "",
    });
  };

  handleTxtInputChange = (e) => {
    this.setState({
      txtInputValue: e.target.value,
      sendingFailed: false,
    });
  };

  handleCheckboxInputChange = () => {
    this.setState((prevState) => ({
      sendNotificationInputChecked: !prevState.sendNotificationInputChecked,
    }));
  };
  handleDateInputChange = (e, dayId = 1) => {
    if (dayId === 1) {
      this.setState({ firstDay: e.target.value });
    } else {
      this.setState({ secondDay: e.target.value });
    }
  };
  showConfirmation = (e, modeVariant) => {
    const { mode, firstDay, secondDay, txtInputValue } = this.state;
    e.preventDefault();
    if (modeVariant === "send") {
      if (firstDay && txtInputValue) {
        if (
          mode === "day" ||
          (mode === "range" && secondDay && secondDay > firstDay)
        ) {
          this.confirmationTxt = "Czy na pewno wysłać?";
          this.setState({
            isConfirmationVisible: true,
            dbResetActive: false,
          });
        }
      }
    } else {
      this.confirmationTxt =
        "Czy na pewno chcesz zrestować bazę danych od dnia dzisiejszego?";
      this.setState({
        isConfirmationVisible: true,
        dbResetActive: true,
      });
    }
  };
  hideConfirmationWidget = () => {
    this.setState({ isConfirmationVisible: false });
  };

  setMaxMinForInputDate = (date, mode = "add") => {
    let newDate = date;
    if (date) {
      newDate = moment(date)[mode](1, "d").format("YYYY-MM-DD");
    }
    return newDate;
  };

  getAdminKey = async () => {
    const db = await getDatabase();
    try {
      await db
        .ref("admin/key")
        .once("value", (snapshot) => (this.notification.key = snapshot.val()));
    } catch (err) {
      this.notification.key = null;
    }
  };

  updateDatabase = async (path = "workdays2", payload, isResetMode = false) => {
    const db = await getDatabase();
    db.ref(path).update(payload, (err) => {
      if (!err) {
        this.setState({
          txtInputValue: "Sukces \u2713",
          sendingSuccess: true,
        });
        if (!isResetMode) {
          let message = "";

          const Objkeys = Object.keys(payload)
          const formatedDates = this.formatDate(Objkeys)

          if (Objkeys.length > 1) {
            const startDate = formatedDates[0].slice(0, 5)
            const endDate = formatedDates[Objkeys.length - 1].slice(0, 5)

            message += `${startDate} - ${endDate}: ${payload[Objkeys[0]]}`;
          }
          else {
            message += `${formatedDates[0]}: ${payload[Objkeys[0]]}`;
          }

          message = message.trim();

          if (this.state.sendNotificationInputChecked) {
            const dateToUrl = Objkeys[0];

            this.sendNotification(message, dateToUrl);
          }
        }
        setTimeout(this.hideSendingSuccess, 2000);
        return;
      }
      return this.setState({
        sendingFailed: true,
      });
    });
  };

  formatDate = (dateArr) => {

    const formatedDates = dateArr.map(date => moment(date).format('DD.MM.YYYY'))
    return formatedDates
  }

  sendNotification = (message, dateToUrl) => {
    const { key, url } = this.notification;

    if (key) {
      var headers = {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Basic ${key}`,
      };

      var payload = {
        app_id: "70cb9b8b-12ad-4124-9681-f7fea8f6abb0",
        included_segments: ["All"],
        headings: { en: "Aktualizacja grafiku" },
        contents: { en: message },
        url: `https://grafik.brzozko.pl/?date=${dateToUrl}`,
      };

      var options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      };

      fetch(url, options);
    }
  };

  sendToDatabase = async (e) => {
    const { mode } = this.state;
    this.hideConfirmationWidget();
    const txtInputValue = this.state.txtInputValue.toUpperCase();
    const { firstDay, secondDay } = this.state;
    if (txtInputValue && firstDay) {
      if (mode === "day") {
        const payload = {
          [firstDay]: txtInputValue,
        };
        this.updateDatabase("workdays2", payload);
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
          this.updateDatabase("workdays2", payload);
        }
      }
    }
  };
  resetDB = async () => {
    this.hideConfirmationWidget();
    const db = await getDatabase();
    let data = null;
    await db.ref("/workdays-copy").once("value", (snap) => {
      data = snap.val();
    });
    this.updateDatabase("workdays2", data, true);
  };
  signUserOut = () => {
    const auth = getAuth();
    auth.signOut();
    this.props.history.goBack();
  };
  getTopbarElement = () => {
    const topbar = document.querySelector(".topbar");
    this.topbar = topbar;
  };

  componentDidMount() {
    this.getUnsubscribeRef = this.addAuthListening();
    this.getTopbarElement();
    this.getAdminKey();
  }

  componentWillUnmount() {
    this.getUnsubscribeRef();
  }

  render() {
    const {
      mode,
      isConfirmationVisible,
      firstDay,
      secondDay,
      txtInputValue,
      sendingSuccess,
      sendingFailed,
      logged,
      dbResetActive,
    } = this.state;

    if (this.topbar) {
      isConfirmationVisible
        ? this.topbar.classList.add("topbar--blurred")
        : this.topbar.classList.remove("topbar--blurred");
    }

    return (
      <>
        {logged && (
          <>
            <section className="panel-view">
              <form
                className={`panel-view__form${
                  isConfirmationVisible ? " panel-view__form--blurred" : ""
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
                    value={firstDay}
                    max={
                      this.state.mode === "range"
                        ? this.setMaxMinForInputDate(secondDay, "subtract")
                        : null
                    }
                    change={(e) => this.handleDateInputChange(e, 1)}
                  />
                  {mode === "range" && (
                    <Input
                      modifier="--smaller"
                      name="second-day"
                      value={secondDay}
                      min={this.setMaxMinForInputDate(firstDay, "add")}
                      change={(e) => this.handleDateInputChange(e, 2)}
                    />
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Dodaj opis"
                  className={`panel-view__input panel-view__input--text${
                    sendingSuccess ? " panel-view__input--text-success" : ""
                    }${sendingFailed ? " panel-view__input--text-fail" : ""}`}
                  maxLength={20}
                  minLength={3}
                  value={txtInputValue}
                  onChange={this.handleTxtInputChange}
                  required
                />
                <InputcheckBox
                  checked={this.state.sendNotificationInputChecked}
                  change={this.handleCheckboxInputChange}
                />

                <button
                  className="panel-view__button panel-view__button--send"
                  onClick={(e) => {
                    this.showConfirmation(e, "send");
                  }}
                  disabled={
                    !(
                      (firstDay &&
                        txtInputValue &&
                        mode === "day" &&
                        sendingSuccess === false) ||
                      (firstDay &&
                        secondDay &&
                        txtInputValue &&
                        mode === "range" &&
                        sendingSuccess === false)
                    )
                  }
                >
                  Wyślij
                </button>
                <button
                  className="panel-view__button panel-view__button--reset"
                  onClick={(e) => {
                    this.showConfirmation(e, "reset");
                  }}
                >
                  Resetuj bazę
                </button>
              </form>
              {isConfirmationVisible && (
                <ConfirmationWidget
                  yesBtn={dbResetActive ? this.resetDB : this.sendToDatabase}
                  noBtn={this.hideConfirmationWidget}
                >
                  {this.confirmationTxt}
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
