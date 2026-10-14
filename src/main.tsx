import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { AdminConfigProvider } from './context/AdminConfigContext';
import { AdminPasscodeProvider } from './context/AdminPasscodeContext';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <CurrencyProvider>
      <AdminPasscodeProvider>
        <AdminConfigProvider>
          <App />
        </AdminConfigProvider>
      </AdminPasscodeProvider>
    </CurrencyProvider>
  </ThemeProvider>
);

