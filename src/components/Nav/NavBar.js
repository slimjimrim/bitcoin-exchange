import React from 'react';
import { Link, withRouter } from "react-router-dom";

import "./navbar.scss";

const NavBar = () => {
  return (
    <div className="nav-bar">
      <span><Link to="/home">Home</Link></span>
      <span><Link to="/charts">Charts</Link></span>
    </div>
  );
}

export default NavBar;
