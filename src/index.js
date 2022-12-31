import React from "react";
import { createRoot } from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.scss";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import AppRouter from "./router/AppRouter";

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<AppRouter />);
