import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  LoginPage,
  DashboardPage,
  IntegrationsPage,
  CostOverviewPage,
  TenantSettingsPage,
} from './pages';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          }
        />
        <Route
          path="/integrations"
          element={
            <MainLayout>
              <IntegrationsPage />
            </MainLayout>
          }
        />
        <Route
          path="/cost-overview"
          element={
            <MainLayout>
              <CostOverviewPage />
            </MainLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <MainLayout>
              <TenantSettingsPage />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
