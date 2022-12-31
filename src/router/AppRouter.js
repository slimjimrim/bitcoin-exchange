import React, { useState } from "react";
import {
  BrowserRouter,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import { useQuery, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import FirstStep from "../components/FirstStep";
import Header from "../components/Header";
import Home from "../components/Home";
import Login from "../components/Login";
import SecondStep from "../components/SecondStep";
import Charts from "../components/Charts/Charts";

const queryClient = new QueryClient();

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
      <div className="">
        <br />
        <Header />
        <br />
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
          <Route render={(props) => <QueryClientProvider client={queryClient}><Charts { ...props } user={ user } /><ReactQueryDevtools /></QueryClientProvider>} path="/charts" />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
        <br />
        <br />
        <br />
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
