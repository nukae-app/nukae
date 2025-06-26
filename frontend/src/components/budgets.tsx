import React from "react";
import { 
  Card, 
  CardBody, 
  Button, 
  Input, 
  Progress, 
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Tabs,
  Tab
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  period: string;
  startDate: string;
  endDate: string;
  services: string[];
  status: "under" | "near" | "over";
  alerts: { threshold: number; type: "email" | "sms" | "notification" }[];
}

export const Budgets = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [budgets, setBudgets] = React.useState<Budget[]>([
    {
      id: "1",
      name: "AWS Production",
      amount: 10000,
      spent: 8500,
      period: "monthly",
      startDate: "2024-05-01",
      endDate: "2024-05-31",
      services: ["EC2", "RDS", "S3"],
      status: "near",
      alerts: [
        { threshold: 80, type: "email" },
        { threshold: 90, type: "sms" }
      ]
    },
    {
      id: "2",
      name: "Azure Development",
      amount: 5000,
      spent: 2300,
      period: "monthly",
      startDate: "2024-05-01",
      endDate: "2024-05-31",
      services: ["Virtual Machines", "Storage", "Functions"],
      status: "under",
      alerts: [
        { threshold: 80, type: "email" }
      ]
    },
    {
      id: "3",
      name: "GCP Data Processing",
      amount: 8000,
      spent: 8200,
      period: "monthly",
      startDate: "2024-05-01",
      endDate: "2024-05-31",
      services: ["BigQuery", "Dataflow", "Cloud Storage"],
      status: "over",
      alerts: [
        { threshold: 75, type: "email" },
        { threshold: 90, type: "notification" }
      ]
    },
    {
      id: "4",
      name: "SaaS Licenses",
      amount: 3500,
      spent: 3150,
      period: "monthly",
      startDate: "2024-05-01",
      endDate: "2024-05-31",
      services: ["Microsoft 365", "Slack", "Zoom"],
      status: "near",
      alerts: [
        { threshold: 90, type: "email" }
      ]
    }
  ]);

  const [newBudget, setNewBudget] = React.useState<Partial<Budget>>({
    name: "",
    amount: 0,
    spent: 0,
    period: "monthly",
    startDate: "",
    endDate: "",
    services: [],
    status: "under",
    alerts: [{ threshold: 80, type: "email" }]
  });

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  const handleInputChange = (field: keyof Budget, value: any) => {
    setNewBudget(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddBudget = () => {
    if (newBudget.name && newBudget.amount && newBudget.startDate && newBudget.endDate) {
      const budget: Budget = {
        id: `budget-${Date.now()}`,
        name: newBudget.name || "",
        amount: newBudget.amount || 0,
        spent: newBudget.spent || 0,
        period: newBudget.period || "monthly",
        startDate: newBudget.startDate || "",
        endDate: newBudget.endDate || "",
        services: newBudget.services || [],
        status: newBudget.status || "under",
        alerts: newBudget.alerts || []
      };

      setBudgets(prev => [...prev, budget]);
      setNewBudget({
        name: "",
        amount: 0,
        spent: 0,
        period: "monthly",
        startDate: "",
        endDate: "",
        services: [],
        status: "under",
        alerts: [{ threshold: 80, type: "email" }]
      });
      onOpenChange(false);
    }
  };

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || budget.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalBudget = filteredBudgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = filteredBudgets.reduce((sum, budget) => sum + budget.spent, 0);
  const overBudgetCount = filteredBudgets.filter(budget => budget.status === "over").length;

  const statusColorMap = {
    under: "success",
    near: "warning",
    over: "danger"
  };

  const getProgressColor = (spent: number, amount: number) => {
    const percentage = (spent / amount) * 100;
    if (percentage >= 100) return "danger";
    if (percentage >= 80) return "warning";
    return "success";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Presupuesto</h1>
        <Button 
          color="primary" 
          startContent={<Icon icon="lucide:plus" />}
          onPress={onOpen}
        >
          Crear Presupuesto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="space-y-2">
            <p className="text-default-600">Presupuesto Total</p>
            <p className="text-3xl font-semibold">${totalBudget.toLocaleString()}</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="space-y-2">
            <p className="text-default-600">Gasto Actual</p>
            <p className="text-3xl font-semibold">${totalSpent.toLocaleString()}</p>
            <div className="flex items-center gap-2">
              <Progress 
                value={Math.min((totalSpent / totalBudget) * 100, 100)} 
                color={getProgressColor(totalSpent, totalBudget)}
                className="max-w-md"
                showValueLabel={true}
              />
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="space-y-2">
            <p className="text-default-600">Presupuestos Excedidos</p>
            <p className="text-3xl font-semibold text-danger">{overBudgetCount}</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody className="p-0">
          <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Input
                placeholder="Buscar presupuestos..."
                startContent={<Icon icon="lucide:search" className="text-default-400" />}
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="w-full sm:w-80"
              />
              <Select 
                placeholder="Estado" 
                selectedKeys={[selectedStatus]}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full sm:w-48"
              >
                <SelectItem key="all" value="all">Todos</SelectItem>
                <SelectItem key="under" value="under">Bajo presupuesto</SelectItem>
                <SelectItem key="near" value="near">Cerca del límite</SelectItem>
                <SelectItem key="over" value="over">Excedido</SelectItem>
              </Select>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button 
                variant="flat" 
                startContent={<Icon icon="lucide:filter" />}
              >
                Filtros
              </Button>
              <Button 
                variant="flat" 
                startContent={<Icon icon="lucide:download" />}
              >
                Exportar
              </Button>
            </div>
          </div>

          <Table 
            removeWrapper 
            aria-label="Budgets table"
            classNames={{
              th: "bg-default-50"
            }}
          >
            <TableHeader>
              <TableColumn>NOMBRE</TableColumn>
              <TableColumn>PERIODO</TableColumn>
              <TableColumn>PRESUPUESTO</TableColumn>
              <TableColumn>GASTO</TableColumn>
              <TableColumn>PROGRESO</TableColumn>
              <TableColumn>ESTADO</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredBudgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{budget.name}</p>
                      <p className="text-default-500 text-sm">
                        {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{budget.period}</TableCell>
                  <TableCell>${budget.amount.toLocaleString()}</TableCell>
                  <TableCell>${budget.spent.toLocaleString()}</TableCell>
                  <TableCell>
                    <Progress 
                      value={Math.min((budget.spent / budget.amount) * 100, 100)} 
                      color={getProgressColor(budget.spent, budget.amount)}
                      size="sm"
                      className="max-w-md"
                    />
                    <p className="text-xs text-default-500 mt-1">
                      {Math.round((budget.spent / budget.amount) * 100)}% utilizado
                    </p>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      color={statusColorMap[budget.status] as any} 
                      variant="flat" 
                      size="sm"
                    >
                      {budget.status === "under" ? "Bajo presupuesto" : 
                       budget.status === "near" ? "Cerca del límite" : "Excedido"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="flat" isIconOnly>
                        <Icon icon="lucide:eye" />
                      </Button>
                      <Button size="sm" variant="flat" color="primary" isIconOnly>
                        <Icon icon="lucide:edit" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Crear Nuevo Presupuesto</ModalHeader>
              <ModalBody>
                <Tabs aria-label="Budget creation tabs">
                  <Tab key="details" title="Detalles">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <Input
                        label="Nombre"
                        placeholder="Nombre del presupuesto"
                        value={newBudget.name}
                        onValueChange={(value) => handleInputChange("name", value)}
                      />
                      <Select
                        label="Periodo"
                        placeholder="Seleccionar periodo"
                        selectedKeys={[newBudget.period || "monthly"]}
                        onChange={(e) => handleInputChange("period", e.target.value)}
                      >
                        <SelectItem key="monthly" value="monthly">Mensual</SelectItem>
                        <SelectItem key="quarterly" value="quarterly">Trimestral</SelectItem>
                        <SelectItem key="annual" value="annual">Anual</SelectItem>
                      </Select>
                      <Input
                        label="Monto"
                        placeholder="0"
                        type="number"
                        startContent={<div className="pointer-events-none">$</div>}
                        value={newBudget.amount?.toString()}
                        onValueChange={(value) => handleInputChange("amount", Number(value))}
                      />
                      <Input
                        label="Fecha de inicio"
                        placeholder="YYYY-MM-DD"
                        type="date"
                        value={newBudget.startDate}
                        onChange={(e) => handleInputChange("startDate", e.target.value)}
                      />
                      <Input
                        label="Fecha de fin"
                        placeholder="YYYY-MM-DD"
                        type="date"
                        value={newBudget.endDate}
                        onChange={(e) => handleInputChange("endDate", e.target.value)}
                      />
                    </div>
                  </Tab>
                  <Tab key="services" title="Servicios">
                    <div className="pt-4 space-y-4">
                      <p className="text-default-600">Selecciona los servicios a incluir en este presupuesto:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {["EC2", "RDS", "S3", "Lambda", "Virtual Machines", "Storage", "Functions", "BigQuery", "Dataflow"].map((service) => (
                          <div key={service} className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              id={service}
                              checked={newBudget.services?.includes(service) || false}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleInputChange("services", [...(newBudget.services || []), service]);
                                } else {
                                  handleInputChange("services", (newBudget.services || []).filter(s => s !== service));
                                }
                              }}
                            />
                            <label htmlFor={service}>{service}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Tab>
                  <Tab key="alerts" title="Alertas">
                    <div className="pt-4 space-y-4">
                      <p className="text-default-600">Configura alertas para este presupuesto:</p>
                      {(newBudget.alerts || []).map((alert, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            label="Umbral (%)"
                            placeholder="80"
                            type="number"
                            min="1"
                            max="100"
                            value={alert.threshold.toString()}
                            onChange={(e) => {
                              const updatedAlerts = [...(newBudget.alerts || [])];
                              updatedAlerts[index] = { ...alert, threshold: Number(e.target.value) };
                              handleInputChange("alerts", updatedAlerts);
                            }}
                            className="w-24"
                          />
                          <Select
                            label="Tipo de alerta"
                            selectedKeys={[alert.type]}
                            onChange={(e) => {
                              const updatedAlerts = [...(newBudget.alerts || [])];
                              updatedAlerts[index] = { ...alert, type: e.target.value as any };
                              handleInputChange("alerts", updatedAlerts);
                            }}
                          >
                            <SelectItem key="email" value="email">Email</SelectItem>
                            <SelectItem key="sms" value="sms">SMS</SelectItem>
                            <SelectItem key="notification" value="notification">Notificación</SelectItem>
                          </Select>
                          <Button 
                            isIconOnly 
                            color="danger" 
                            variant="light"
                            onPress={() => {
                              const updatedAlerts = (newBudget.alerts || []).filter((_, i) => i !== index);
                              handleInputChange("alerts", updatedAlerts);
                            }}
                          >
                            <Icon icon="lucide:trash-2" />
                          </Button>
                        </div>
                      ))}
                      <Button 
                        size="sm" 
                        variant="flat"
                        startContent={<Icon icon="lucide:plus" />}
                        onPress={() => {
                          handleInputChange("alerts", [...(newBudget.alerts || []), { threshold: 80, type: "email" }]);
                        }}
                      >
                        Añadir Alerta
                      </Button>
                    </div>
                  </Tab>
                </Tabs>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={handleAddBudget}>
                  Crear Presupuesto
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};