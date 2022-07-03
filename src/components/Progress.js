import React from "react";
import { Link, withRouter } from "react-router-dom";

const Progress = ({ location }) => {
  const isLoginPage = location.pathname === "/";
  const isFirstStep = location.pathname === "/first";
  const isSecondStep = location.pathname === "/second";

  return (
    <React.Fragment>
      {
        isLoginPage ? (<div></div>) :
        (
          <div className="steps">
            <div className={`${isFirstStep ? "step active" : "step"}`}>
              <div>1</div>
              <div>{isSecondStep ? (<Link to="/first">Step 1</Link>) : ("Step 1")}</div>
            </div>
            <div className={`${isSecondStep ? "step active" : "step"}`}>
              <div>2</div>
              <div>{isFirstStep ? (<Link to="/second">Step 2</Link>) : ("Step 2")}</div>
            </div>
          </div>
        )
      }
    </React.Fragment>
  );
};

export default withRouter(Progress);
