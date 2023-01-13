import React from "react";

import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

import "./toast.scss";

const Toast = (props) => {
  const { showCloseAll, position } = props;
  const cssDirection = showCloseAll ? "in" : "out";

  return (
    <div onClick={() => props.closeAll()} className={`notification-container ${position}-${cssDirection}`}>
      <div className={`notification toast ${position}-${cssDirection}`}>
        <div>
          <span>Close all rows</span>
        </div>
        <div>
          <CloseIcon />
        </div>
      </div>
    </div>
  );
}

export default Toast;
