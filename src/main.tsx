import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './theme/variables.css';
import { app, createMembersCollectionIfNotExists } from './firebaseConfig';


const container = document.getElementById('root');
const root = createRoot(container!);
createMembersCollectionIfNotExists();

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);