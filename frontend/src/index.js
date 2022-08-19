import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { TripContextProvider } from './context/TripContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TripContextProvider>
      <App />
    </TripContextProvider>
      
  </React.StrictMode>
);

