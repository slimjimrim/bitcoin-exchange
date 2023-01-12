import React from "react";

import "./toast.scss";

const Toast = (props) => {
  const { show, position } = props;

  return (
    <div className={`notification-container ${position}`}>
      <div className={`notification toast ${position}`}>
        <button>
            X
        </button>
        <div className="notification-image">
            <img src="" alt="" />
        </div>
        <div>
            <p className="notification-title">Title</p>
            <p className="notification-message">Message</p>
        </div>
      </div>
    </div>
  );
}

export default Toast;
