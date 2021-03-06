import React from "react";
import Topbar from "./Topbar";
import HomeView from "./HomeView";
import LoginView from "./LoginView";
import PanelView from "./PanelView";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

const App = () => {
  return (
    <>
      <Router>
        <Topbar />
        <Switch>
          <Route exact path="/" component={HomeView} />
          <Route path="/login" component={LoginView} />
          <Route path="/panel" component={PanelView} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </>
  );
};

export default App;
