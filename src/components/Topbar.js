import React from "react";
import { ReactComponent as HomeLogo } from "../assets/home.svg";
import { ReactComponent as LogoutLogo } from "../assets/logout.svg";
import { ReactComponent as UserLogo } from "../assets/user.svg";
import { Link } from "react-router-dom";
import { getAuth } from "../common/firebase";

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
  componentDidMount() {
    this.getUnsubscribeRef = this.addAuthListening();
  }

  componentWillUnmount() {
    this.getUnsubscribeRef();
  }

  render() {
    return (
      <div className="topbar">
        <nav className="topbar__menu">
          <ul className="topbar__menu-list">
            <li className="topbar__menu-item">
              <Link
                to="/"
                label="Strona główna"
                className="topbar__menu-item-link"
              >
                <HomeLogo />
              </Link>
            </li>
            <li className="topbar__menu-item">
              <Link
                to="/panel"
                label="Strona główna"
                className="topbar__menu-item-link"
              >
                <UserLogo />
              </Link>
            </li>
            {this.state.userIsLogged && (
              <li className="topbar__menu-item">
                <a
                  className="topbar__menu-item-link"
                  onClick={this.signUserOut}
                >
                  <LogoutLogo />
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    );
  }
}
export default Topbar;
