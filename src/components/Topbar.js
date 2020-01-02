import React from "react";
import { ReactComponent as HomeLogo } from "../assets/home.svg";
import { ReactComponent as LogoutLogo } from "../assets/logout.svg";
import { ReactComponent as UserLogo } from "../assets/user.svg";
import { NavLink } from "react-router-dom";
import { getAuth } from "../common/firebase";
import { withRouter } from "react-router-dom";

class Topbar extends React.Component {
  constructor() {
    super();
    this.getUnsubscribeRef = null;
  }
  state = {
    userIsLogged: false
  };

  addAuthListening = () => {
    const auth = getAuth();
    const ref = auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ userIsLogged: true });
      } else {
        this.setState({ userIsLogged: false });
      }
    });
    return ref;
  };
  signUserOut = () => {
    const auth = getAuth();
    auth.signOut();
  };

  checkIfLinkShouldBeDisabled = (event, linkPath) => {
    const currentLocation = this.props.location.pathname;
    if (currentLocation === linkPath) {
      return event.preventDefault();
    }
  };
  componentDidMount() {
    this.getUnsubscribeRef = this.addAuthListening();
  }

  componentWillUnmount() {
    this.getUnsubscribeRef();
  }

  render() {
    return (
      <div
        className={`topbar${
          this.props.modifier ? " topbar" + this.props.modifier : ""
        }`}
      >
        <nav className="topbar__menu">
          <ul className="topbar__menu-list">
            <li className="topbar__menu-item">
              <NavLink
                exact
                to={"/"}
                className="topbar__menu-item-link"
                activeClassName={"topbar__menu-item-link--active"}
                label="Strona główna"
                onClick={e => this.checkIfLinkShouldBeDisabled(e, "/")}
              >
                <HomeLogo />
              </NavLink>
            </li>
            <li className="topbar__menu-item">
              <NavLink
                to="/panel"
                className="topbar__menu-item-link"
                activeClassName={"topbar__menu-item-link--active"}
                label="Panel administracyjny"
                onClick={e => this.checkIfLinkShouldBeDisabled(e, "/panel")}
              >
                <UserLogo />
              </NavLink>
            </li>
            {this.state.userIsLogged && (
              <li className="topbar__menu-item">
                <button
                  href="#"
                  className="topbar__menu-item-link topbar__menu-item-link--sign-out"
                  onClick={this.signUserOut}
                >
                  <LogoutLogo />
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    );
  }
}
export default withRouter(Topbar);
