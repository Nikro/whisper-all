import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import MainComponent from './components/main';
import SettingsComponent from './components/settings';

const AppRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const removeListener = window.electronAPI.on(
      'navigate',
      (event: Electron.IpcRendererEvent, path: string) => {
        console.log('Navigating to:', path);
        navigate(path);
      }
    );

    // Cleanup function to remove the IPC listener
    return () => {
      removeListener();
    };
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<MainComponent />} />
      <Route path="/settings" element={<SettingsComponent />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <div>
        <AppRoutes />
      </div>
    </Router>
  );
};

export default App;
