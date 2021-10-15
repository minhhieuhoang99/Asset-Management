import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App/App';
import "bootstrap-icons/font/bootstrap-icons.css";
import Authorization from './Shared/Constant/Intercreptors/Authorization'
Authorization();
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
