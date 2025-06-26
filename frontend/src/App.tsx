import React from "react";
import { Sidebar } from "./components/sidebar";
import { CostDashboard } from "./components/cost-dashboard";
import { CloudCosts } from "./components/cloud-costs";
import { SaasLicenses } from "./components/saas-licenses";
import { Recommendations } from "./components/recommendations";
import { Budgets } from "./components/budgets";
import { Alerts } from "./components/alerts";
import { Integrations } from "./components/integrations";
import { Configuration } from "./components/configuration";

function App() {
  const [activeView, setActiveView] = React.useState("dashboard");

  const handleNavigation = (view: string) => {
    setActiveView(view);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onNavigation={handleNavigation} activeView={activeView} />
      <main className="flex-1 overflow-auto p-6">
        {activeView === "dashboard" && <CostDashboard />}
        {activeView === "cloud-costs" && <CloudCosts />}
        {activeView === "saas" && <SaasLicenses />}
        {activeView === "recommendations" && <Recommendations />}
        {activeView === "budgets" && <Budgets />}
        {activeView === "alerts" && <Alerts />}
        {activeView === "integrations" && <Integrations />}
        {activeView === "configuration" && <Configuration />}
      </main>
    </div>
  );
}

export default App;