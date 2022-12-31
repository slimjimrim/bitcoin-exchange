import React, { useState } from "react";
import {
  BrowserRouter,
  Route,
  Redirect,
  Switch
} from "react-router-dom";

import FirstStep from "../components/FirstStep";
import Header from "../components/Header";
import Home from "../components/Home";
import Login from "../components/Login";
import SecondStep from "../components/SecondStep";
import Charts from "../components/Charts/Charts";

const AppRouter = () => {
  const [user, setUser] = useState({});

  function updateUser(data) {
    setUser((userData) => {
      return {
        ...userData,
        ...data
      }
    });
  };

  function resetUser() {
    setUser({});
  };

  return (
    <BrowserRouter>
      <div className="container">
        <br />
        <Header />
        <Switch>
          <Route render={(props) => <Login { ...props } updateUser={ updateUser } />}
                 path="/"
                 exact={true}
          />
          <Route render={(props) => <FirstStep { ...props } user={ user } updateUser={ updateUser } />}
                 path="/first"
          />
          <Route render={(props) => <SecondStep { ...props } user={ user } updateUser={ updateUser } resetUser={ resetUser } />}
                 path="/second"
          />
          <Route render={(props) => <Home { ...props } user={ user } updateUser={ updateUser } />} path="/home" />
          <Route render={(props) => <Charts { ...props } user={ user } />} path="/charts" />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
        <br />
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
