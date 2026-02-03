import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/Calendar';
import { ErrorBoundary } from './components/ErrorBoundary';

// Placeholder pages for routing structure
const ListsPage = () => <div className="p-8 text-center text-slate-500">Lists Module Coming Soon</div>;
const SettingsPage = () => <div className="p-8 text-center text-slate-500">Settings Module Coming Soon</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={
          <ErrorBoundary>
            <Dashboard />
          </ErrorBoundary>
        } />
        <Route path="calendar" element={
          <ErrorBoundary>
            <CalendarPage />
          </ErrorBoundary>
        } />
        <Route path="lists" element={<ListsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;

