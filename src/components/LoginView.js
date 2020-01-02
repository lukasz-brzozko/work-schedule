import React from "react";
import * as firebase from "firebase/app";
import { getAuth } from "../common/firebase";
import firebaseui from "firebaseui/dist/npm__pl";
class LoginView extends React.Component {
  constructor() {
    super();
    this.getUnsubscribeRef = null;
  }
  state = {
    loading: true
  };

  generateFirebaseUI = () => {
    let ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl = "/panel") => {
          // this.setState({ logged: true });
          // this.props.history.push({
          //   pathname: redirectUrl
          // });
        },
        uiShown: () => {
          this.setState({ loading: false });
        }
      },
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,

      signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID]
    };
    ui.start("#firebaseui-auth-container", uiConfig);
  };

  addAuthListening = () => {
    const auth = getAuth();
    const ref = auth.onAuthStateChanged(user => {
      if (user) {
        // this.props.history.push("/panel");
        this.props.history.replace("/panel");
      } else {
        this.generateFirebaseUI();
      }
    });
    return ref;
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
        {/* <Topbar /> */}
        <div
          id="firebaseui-auth-container"
          className="firebaseui-auth-container"
        ></div>
      </>
    );
  }
}

export default LoginView;
