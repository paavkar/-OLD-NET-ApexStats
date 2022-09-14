import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { reducer, StateProvider } from "./state";

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
root.render(
<StateProvider reducer={reducer}>
  <App />
</StateProvider>);