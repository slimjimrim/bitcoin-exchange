import React from "react";
import { withRouter } from "react-router-dom";

import Progress from "./Progress";

const Header = ({ location }) => {
  const isLoginPage = location.pathname === "/";
  const isRegisterPage = location.pathname === "/first" || location.pathname === "/second";

  return (
    isLoginPage || isRegisterPage ?
    (
      <div>
        {isLoginPage ? (<h1>Login</h1>) : (<h1>Registration</h1>)}
        <Progress />
      </div>
    ) :
    (
      <div>
      </div>
    )
  );
};

export default withRouter(Header);
