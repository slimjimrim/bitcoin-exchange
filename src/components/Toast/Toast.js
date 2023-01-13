import React from "react";

import "./toast.scss";

const Toast = (props) => {
  const { showCloseAll, position } = props;
  const cssDirection = showCloseAll ? "in" : "out";

  return (
    <div className={`notification-container ${position}-${cssDirection}`}>
      <div className={`notification toast ${position}-${cssDirection}`}>
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
