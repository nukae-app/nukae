import React from "react";
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { Icon } from "@iconify/react";
import { CostChart } from "./cost-chart";
import { RecommendationCard } from "./recommendation-card";
import { Spinner } from "@heroui/react";

export const CostDashboard = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [dashboardData, setDashboardData] = React.useState({
    totalCost: 0,
    estimatedSavings: 0,
    topServices: [],
    saasLicenses: []
  });
  
  // Fetch dashboard data from backend
  React.useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/dashboard');
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const currentDate = new Date();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
        <p className="ml-2">Loading dashboard data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Icon icon="lucide:alert-triangle" className="text-danger text-4xl mb-2" />
        <p className="text-danger">{error}</p>
        <Button color="primary" variant="flat" className="mt-4" onPress={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button
          variant="flat"
          color="default"
          endContent={<Icon icon="lucide:chevron-down" />}
          className="bg-white"
        >
          {month} {year}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="space-y-2">
            <p className="text-default-600">Gasto Total Mensual</p>
            <p className="text-3xl font-semibold">${dashboardData.totalCost.toLocaleString()}</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="space-y-2">
            <p className="text-default-600">Ahorro Estimado</p>
            <p className="text-3xl font-semibold text-green-600">${dashboardData.estimatedSavings.toLocaleString()}</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <p className="text-default-600 mb-2">Servicios Principales</p>
            {dashboardData.topServices.map((service: any, index: number) => (
              <div key={index} className="flex justify-between items-center mb-1">
                <span>{service.name}</span>
                <span className="font-medium">${service.cost.toLocaleString()}</span>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <h2 className="text-lg font-medium mb-4">Coste por Servicio</h2>
          <div className="h-72">
            <CostChart />
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <h2 className="text-lg font-medium mb-4">Licencias SaaS</h2>
            <p className="text-sm text-default-500 mb-2">Usuarios Activos</p>
            
            <Table removeWrapper aria-label="SaaS Licenses table">
              <TableHeader>
                <TableColumn>Aplicación</TableColumn>
                <TableColumn>Usuarios Act.</TableColumn>
                <TableColumn>Costo</TableColumn>
              </TableHeader>
              <TableBody>
                {dashboardData.saasLicenses.map((license: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{license.application}</TableCell>
                    <TableCell>{license.users}</TableCell>
                    <TableCell>${license.cost}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <RecommendationCard 
            title="Reduce los <cpuRequest> el los pods en el namespace frontend"
            saving={350}
          />
          <RecommendationCard 
            title="Puedes eliminar el baucket de almacenamiento - backup- en G+ Cloud que no se usado en los últimos 30 días"
            saving={240}
          />
        </div>
      </div>
    </div>
  );
};