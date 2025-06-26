import React from "react";
import { 
  Card, 
  CardBody, 
  Button, 
  Input, 
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

interface Alert {
  id: string;
  name: string;
  description: string;
  threshold: number;
  thresholdType: "percentage" | "absolute";
  service: string;
  resourceType: string;
  notificationType: "email" | "sms" | "notification";
  recipients: string[];
  status: "active" | "inactive" | "triggered";
  lastTriggered?: string;
  createdAt: string;
}

export const Alerts = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [alerts, setAlerts] = React.useState<Alert[]>([
    {
      id: "1",
      name: "AWS Budget 80%",
      description: "Alerta cuando el presupuesto de AWS alcance el 80% del límite",
      threshold: 80,
      thresholdType: "percentage",
      service: "AWS",
      resourceType: "Budget",
      notificationType: "email",
      recipients: ["admin@example.com", "finance@example.com"],
      status: "active",
      createdAt: "2024-04-15"
    },
    {
      id: "2",
      name: "EC2 High Cost",
      description: "Alerta cuando el costo diario de EC2 supere los $500",
      threshold: 500,
      thresholdType: "absolute",
      service: "EC2",
      resourceType: "Instance",
      notificationType: "email",
      recipients: ["admin@example.com"],
      status: "triggered",
      lastTriggered: "2024-05-18",
      createdAt: "2024-03-10"
    },
    {
      id: "3",
      name: "Azure Budget Alert",
      description: "Alerta cuando el presupuesto de Azure alcance el 90% del límite",
      threshold: 90,
      thresholdType: "percentage",
      service: "Azure",
      resourceType: "Budget",
      notificationType: "sms",
      recipients: ["+1234567890"],
      status: "active",
      createdAt: "2024-04-20"
    },
    {
      id: "4",
      name: "GCP Storage Increase",
      description: "Alerta cuando el costo de almacenamiento aumente más del 20% respecto al mes anterior",
      threshold: 20,
      thresholdType: "percentage",
      service: "GCP",
      resourceType: "Storage",
      notificationType: "notification",
      recipients: ["admin@example.com"],
      status: "inactive",
      createdAt: "2024-05-01"
    }
  ]);

  const [newAlert, setNewAlert] = React.useState<Partial<Alert>>({
    name: "",
    description: "",
    threshold: 80,
    thresholdType: "percentage",
    service: "",
    resourceType: "",
    notificationType: "email",
    recipients: [""],
    status: "active"
  });

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [selectedType, setSelectedType] = React.useState<string>("all");

  const handleInputChange = (field: keyof Alert, value: any) => {
    setNewAlert(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddAlert = () => {
    if (newAlert.name && newAlert.threshold && newAlert.service) {
      const alert: Alert = {
        id: `alert-${Date.now()}`,
        name: newAlert.name || "",
        description: newAlert.description || "",
        threshold: newAlert.threshold || 0,
        thresholdType: newAlert.thresholdType || "percentage",
        service: newAlert.service || "",
        resourceType: newAlert.resourceType || "",
        notificationType: newAlert.notificationType || "email",
        recipients: newAlert.recipients || [""],
        status: newAlert.status || "active",
        createdAt: new Date().toISOString().split('T')[0]
      };

      setAlerts(prev => [...prev, alert]);
      setNewAlert({
        name: "",
        description: "",
        threshold: 80,
        thresholdType: "percentage",
        service: "",
        resourceType: "",
        notificationType: "email",
        recipients: [""],
        status: "active"
      });
      onOpenChange(false);
    }
  };

  const handleToggleAlertStatus = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id 
          ? { 
              ...alert, 
              status: alert.status === "active" ? "inactive" : "active" 
            } 
          : alert
      )
    );
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || alert.status === selectedStatus;
    const matchesType = selectedType === "all" || alert.notificationType === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const activeAlerts = alerts.filter(alert => alert.status === "active").length;
  const triggeredAlerts = alerts.filter(alert => alert.status === "triggered").length;

  const statusColorMap = {
    active: "success",
    inactive: "default",
    triggered: "danger"
  };

  const notificationTypeIconMap = {
    email: "lucide:mail",
    sms: "lucide:message-square",
    notification: "lucide:bell"
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Alertas</h1>
        <Button 
          color="primary" 
          startContent={<Icon icon="lucide:plus" />}
          onPress={onOpen}
        >
          Crear Alerta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="space-y-2">
            <p className="text-default-600">Alertas Activas</p>
            <p className="text-3xl font-semibold">{activeAlerts}</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="space-y-2">
            <p className="text-default-600">Alertas Activadas</p>
            <p className="text-3xl font-semibold text-danger">{triggeredAlerts}</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="space-y-2">
            <p className="text-default-600">Total Alertas</p>
            <p className="text-3xl font-semibold">{alerts.length}</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody className="p-0">
          <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Input
                placeholder="Buscar alertas..."
                startContent={<Icon icon="lucide:search" className="text-default-400" />}
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="w-full sm:w-80"
              />
              <div className="flex gap-2">
                <Select 
                  placeholder="Estado" 
                  selectedKeys={[selectedStatus]}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full sm:w-40"
                >
                  <SelectItem key="all" value="all">Todos</SelectItem>
                  <SelectItem key="active" value="active">Activo</SelectItem>
                  <SelectItem key="inactive" value="inactive">Inactivo</SelectItem>
                  <SelectItem key="triggered" value="triggered">Activado</SelectItem>
                </Select>
                <Select 
                  placeholder="Tipo" 
                  selectedKeys={[selectedType]}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full sm:w-40"
                >
                  <SelectItem key="all" value="all">Todos</SelectItem>
                  <SelectItem key="email" value="email">Email</SelectItem>
                  <SelectItem key="sms" value="sms">SMS</SelectItem>
                  <SelectItem key="notification" value="notification">Notificación</SelectItem>
                </Select>
              </div>
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
            aria-label="Alerts table"
            classNames={{
              th: "bg-default-50"
            }}
          >
            <TableHeader>
              <TableColumn>NOMBRE</TableColumn>
              <TableColumn>SERVICIO</TableColumn>
              <TableColumn>UMBRAL</TableColumn>
              <TableColumn>NOTIFICACIÓN</TableColumn>
              <TableColumn>ESTADO</TableColumn>
              <TableColumn>ÚLTIMA ACTIVACIÓN</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{alert.name}</p>
                      <p className="text-default-500 text-sm">{alert.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>{alert.service} / {alert.resourceType}</TableCell>
                  <TableCell>
                    {alert.threshold}
                    {alert.thresholdType === "percentage" ? "%" : "$"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Icon icon={notificationTypeIconMap[alert.notificationType]} className="text-default-500" />
                      <span className="capitalize">{alert.notificationType}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      color={statusColorMap[alert.status] as any} 
                      variant="flat" 
                      size="sm"
                    >
                      {alert.status === "active" ? "Activo" : 
                       alert.status === "inactive" ? "Inactivo" : "Activado"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {alert.lastTriggered ? new Date(alert.lastTriggered).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="flat" 
                        color={alert.status === "active" ? "danger" : "success"}
                        onPress={() => handleToggleAlertStatus(alert.id)}
                      >
                        {alert.status === "active" ? "Desactivar" : "Activar"}
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
              <ModalHeader className="flex flex-col gap-1">Crear Nueva Alerta</ModalHeader>
              <ModalBody>
                <Tabs aria-label="Alert creation tabs">
                  <Tab key="details" title="Detalles">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <Input
                        label="Nombre"
                        placeholder="Nombre de la alerta"
                        value={newAlert.name}
                        onValueChange={(value) => handleInputChange("name", value)}
                      />
                      <Input
                        label="Descripción"
                        placeholder="Descripción de la alerta"
                        value={newAlert.description}
                        onValueChange={(value) => handleInputChange("description", value)}
                      />
                      <div className="flex gap-2 items-end">
                        <Input
                          label="Umbral"
                          placeholder="80"
                          type="number"
                          value={newAlert.threshold?.toString()}
                          onValueChange={(value) => handleInputChange("threshold", Number(value))}
                          className="flex-1"
                        />
                        <Select
                          label="Tipo"
                          selectedKeys={[newAlert.thresholdType || "percentage"]}
                          onChange={(e) => handleInputChange("thresholdType", e.target.value)}
                          className="flex-1"
                        >
                          <SelectItem key="percentage" value="percentage">%</SelectItem>
                          <SelectItem key="absolute" value="absolute">$</SelectItem>
                        </Select>
                      </div>
                      <Select
                        label="Estado"
                        selectedKeys={[newAlert.status || "active"]}
                        onChange={(e) => handleInputChange("status", e.target.value)}
                      >
                        <SelectItem key="active" value="active">Activo</SelectItem>
                        <SelectItem key="inactive" value="inactive">Inactivo</SelectItem>
                      </Select>
                    </div>
                  </Tab>
                  <Tab key="service" title="Servicio">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <Select
                        label="Servicio"
                        placeholder="Seleccionar servicio"
                        selectedKeys={newAlert.service ? [newAlert.service] : []}
                        onChange={(e) => handleInputChange("service", e.target.value)}
                      >
                        <SelectItem key="AWS" value="AWS">AWS</SelectItem>
                        <SelectItem key="Azure" value="Azure">Azure</SelectItem>
                        <SelectItem key="GCP" value="GCP">Google Cloud</SelectItem>
                        <SelectItem key="EC2" value="EC2">EC2</SelectItem>
                        <SelectItem key="S3" value="S3">S3</SelectItem>
                        <SelectItem key="RDS" value="RDS">RDS</SelectItem>
                      </Select>
                      <Select
                        label="Tipo de recurso"
                        placeholder="Seleccionar tipo"
                        selectedKeys={newAlert.resourceType ? [newAlert.resourceType] : []}
                        onChange={(e) => handleInputChange("resourceType", e.target.value)}
                      >
                        <SelectItem key="Budget" value="Budget">Presupuesto</SelectItem>
                        <SelectItem key="Instance" value="Instance">Instancia</SelectItem>
                        <SelectItem key="Storage" value="Storage">Almacenamiento</SelectItem>
                        <SelectItem key="Database" value="Database">Base de datos</SelectItem>
                      </Select>
                    </div>
                  </Tab>
                  <Tab key="notification" title="Notificación">
                    <div className="space-y-4 pt-4">
                      <Select
                        label="Tipo de notificación"
                        selectedKeys={[newAlert.notificationType || "email"]}
                        onChange={(e) => handleInputChange("notificationType", e.target.value)}
                      >
                        <SelectItem key="email" value="email">Email</SelectItem>
                        <SelectItem key="sms" value="sms">SMS</SelectItem>
                        <SelectItem key="notification" value="notification">Notificación</SelectItem>
                      </Select>
                      
                      <div className="space-y-2">
                        <p className="text-default-600">Destinatarios:</p>
                        {(newAlert.recipients || [""]).map((recipient, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              placeholder={newAlert.notificationType === "sms" ? "+1234567890" : "email@example.com"}
                              value={recipient}
                              onChange={(e) => {
                                const updatedRecipients = [...(newAlert.recipients || [])];
                                updatedRecipients[index] = e.target.value;
                                handleInputChange("recipients", updatedRecipients);
                              }}
                              className="flex-1"
                            />
                            <Button 
                              isIconOnly 
                              color="danger" 
                              variant="light"
                              onPress={() => {
                                if ((newAlert.recipients || []).length > 1) {
                                  const updatedRecipients = (newAlert.recipients || []).filter((_, i) => i !== index);
                                  handleInputChange("recipients", updatedRecipients);
                                }
                              }}
                              isDisabled={(newAlert.recipients || []).length <= 1}
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
                            handleInputChange("recipients", [...(newAlert.recipients || []), ""]);
                          }}
                        >
                          Añadir Destinatario
                        </Button>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={handleAddAlert}>
                  Crear Alerta
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};