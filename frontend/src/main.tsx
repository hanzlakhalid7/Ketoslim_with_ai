import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { HashRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  </StrictMode>
);
