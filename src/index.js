import React from "react";
import { createRoot } from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.scss";

import AppRouter from "./router/AppRouter";

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<AppRouter />);
