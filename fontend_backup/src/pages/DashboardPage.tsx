import React from 'react';

const DashboardPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-600">Tailwind is working</h1>
      <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 shadow rounded-xl">
          <h2 className="text-sm font-semibold text-gray-500">Total Cloud Spend</h2>
          <p className="text-2xl font-bold text-blue-600">$4,230.15</p>
        </div>
        <div className="bg-white p-4 shadow rounded-xl">
          <h2 className="text-sm font-semibold text-gray-500">Active Integrations</h2>
          <p className="text-2xl font-bold text-blue-600">3</p>
        </div>
        <div className="bg-green-500 text-white p-4">
          Tailwind está funcionando
        </div>
        <div className="bg-white p-4 shadow rounded-xl">
          <h2 className="text-sm font-semibold text-gray-500">Last Import</h2>
          <p className="text-2xl font-bold text-blue-600">Today at 02:14</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
