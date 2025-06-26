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
  Tabs,
  Tab
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface Integration {
  id: string;
  name: string;
  provider: string;
  type: "cloud" | "billing" | "monitoring" | "other";
  status: "connected" | "disconnected" | "error";
  lastSync?: string;
  connectedAt: string;
}

export const Integrations = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [integrations, setIntegrations] = React.useState<Integration[]>([
    {
      id: "1",
      name: "AWS Account - Production",
      provider: "aws",
      type: "cloud",
      status: "connected",
      lastSync: "2024-05-19T08:30:00",
      connectedAt: "2024-01-15"
    },
    {
      id: "2",
      name: "Azure Subscription",
      provider: "azure",
      type: "cloud",
      status: "connected",
      lastSync: "2024-05-19T09:15:00",
      connectedAt: "2024-02-10"
    },
    {
      id: "3",
      name: "Google Cloud Platform",
      provider: "gcp",
      type: "cloud",
      status: "error",
      lastSync: "2024-05-18T14:20:00",
      connectedAt: "2024-03-05"
    },
    {
      id: "4",
      name: "Stripe Billing",
      provider: "stripe",
      type: "billing",
      status: "connected",
      lastSync: "2024-05-19T07:45:00",
      connectedAt: "2024-04-12"
    },
    {
      id: "5",
      name: "Datadog Monitoring",
      provider: "datadog",
      type: "monitoring",
      status: "disconnected",
      connectedAt: "2024-03-20"
    }
  ]);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState<string>("all");

  const handleConnect = (provider: string) => {
    // In a real app, this would initiate OAuth or API key authentication
    console.log(`Connecting to ${provider}...`);
    onOpenChange(false);
  };

  const handleSync = (id: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { 
              ...integration, 
              lastSync: new Date().toISOString(),
              status: "connected"
            } 
          : integration
      )
    );
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { 
              ...integration, 
              status: "disconnected",
              lastSync: undefined
            } 
          : integration
      )
    );
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          integration.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === "all" || integration.type === selectedTab;
    return matchesSearch && matchesTab;
  });

  const connectedCount = integrations.filter(i => i.status === "connected").length;
  const errorCount = integrations.filter(i => i.status === "error").length;

  const statusColorMap = {
    connected: "success",
    disconnected: "default",
    error: "danger"
  };

  const providerIconMap = {
    aws: "logos:aws",
    azure: "logos:microsoft-azure",
    gcp: "logos:google-cloud",
    stripe: "logos:stripe",
    datadog: "logos:datadog",
    github: "logos:github-icon",
    slack: "logos:slack-icon",
    jira: "logos:jira",
    newrelic: "logos:new-relic",
    prometheus: "logos:prometheus"
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Integraciones</h1>
        <Button 
          color="primary" 
          startContent={<Icon icon="lucide:plus" />}
          onPress={onOpen}
        >
          Añadir Integración
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="space-y-2">
            <p className="text-default-600">Integraciones Conectadas</p>
            <p className="text-3xl font-semibold">{connectedCount}</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="space-y-2">
            <p className="text-default-600">Integraciones con Error</p>
            <p className="text-3xl font-semibold text-danger">{errorCount}</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="space-y-2">
            <p className="text-default-600">Total Integraciones</p>
            <p className="text-3xl font-semibold">{integrations.length}</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody className="p-0">
          <div className="p-4 border-b">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <Input
                placeholder="Buscar integraciones..."
                startContent={<Icon icon="lucide:search" className="text-default-400" />}
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="w-full md:w-80"
              />
              <div className="flex gap-2 w-full md:w-auto">
                <Button 
                  variant="flat" 
                  startContent={<Icon icon="lucide:filter" />}
                >
                  Filtros
                </Button>
              </div>
            </div>
            
            <Tabs 
              aria-label="Integration types" 
              selectedKey={selectedTab}
              onSelectionChange={setSelectedTab as any}
              className="mt-4"
            >
              <Tab key="all" title="Todos" />
              <Tab key="cloud" title="Proveedores Cloud" />
              <Tab key="billing" title="Facturación" />
              <Tab key="monitoring" title="Monitoreo" />
              <Tab key="other" title="Otros" />
            </Tabs>
          </div>

          <Table 
            removeWrapper 
            aria-label="Integrations table"
            classNames={{
              th: "bg-default-50"
            }}
          >
            <TableHeader>
              <TableColumn>INTEGRACIÓN</TableColumn>
              <TableColumn>TIPO</TableColumn>
              <TableColumn>ESTADO</TableColumn>
              <TableColumn>ÚLTIMA SINCRONIZACIÓN</TableColumn>
              <TableColumn>CONECTADO DESDE</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredIntegrations.map((integration) => (
                <TableRow key={integration.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Icon 
                        icon={providerIconMap[integration.provider as keyof typeof providerIconMap] || "lucide:plug"} 
                        className="text-2xl" 
                      />
                      <span className="font-medium">{integration.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{integration.type}</TableCell>
                  <TableCell>
                    <Chip 
                      color={statusColorMap[integration.status] as any} 
                      variant="flat" 
                      size="sm"
                    >
                      {integration.status === "connected" ? "Conectado" : 
                       integration.status === "disconnected" ? "Desconectado" : "Error"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {integration.lastSync 
                      ? new Date(integration.lastSync).toLocaleString() 
                      : "—"}
                  </TableCell>
                  <TableCell>{new Date(integration.connectedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {integration.status !== "disconnected" && (
                        <Button 
                          size="sm" 
                          variant="flat" 
                          color="primary"
                          onPress={() => handleSync(integration.id)}
                        >
                          <Icon icon="lucide:refresh-cw" className="mr-1" />
                          Sincronizar
                        </Button>
                      )}
                      {integration.status === "connected" && (
                        <Button 
                          size="sm" 
                          variant="flat" 
                          color="danger"
                          onPress={() => handleDisconnect(integration.id)}
                        >
                          Desconectar
                        </Button>
                      )}
                      {integration.status !== "connected" && (
                        <Button 
                          size="sm" 
                          variant="flat" 
                          color="success"
                          onPress={() => handleSync(integration.id)}
                        >
                          Reconectar
                        </Button>
                      )}
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
              <ModalHeader className="flex flex-col gap-1">Añadir Nueva Integración</ModalHeader>
              <ModalBody>
                <Tabs aria-label="Integration types">
                  <Tab key="cloud" title="Proveedores Cloud">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                      <Card isPressable onPress={() => handleConnect("aws")}>
                        <CardBody className="flex flex-col items-center justify-center p-6 text-center">
                          <Icon icon="logos:aws" className="text-4xl mb-4" />
                          <p className="font-medium">Amazon Web Services</p>
                          <Button size="sm" color="primary" className="mt-4">Conectar</Button>
                        </CardBody>
                      </Card>
                      <Card isPressable onPress={() => handleConnect("azure")}>
                        <CardBody className="flex flex-col items-center justify-center p-6 text-center">
                          <Icon icon="logos:microsoft-azure" className="text-4xl mb-4" />
                          <p className="font-medium">Microsoft Azure</p>
                          <Button size="sm" color="primary" className="mt-4">Conectar</Button>
                        </CardBody>
                      </Card>
                      <Card isPressable onPress={() => handleConnect("gcp")}>
                        <CardBody className="flex flex-col items-center justify-center p-6 text-center">
                          <Icon icon="logos:google-cloud" className="text-4xl mb-4" />
                          <p className="font-medium">Google Cloud</p>
                          <Button size="sm" color="primary" className="mt-4">Conectar</Button>
                        </CardBody>
                      </Card>
                    </div>
                  </Tab>
                  <Tab key="billing" title="Facturación">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                      <Card isPressable onPress={() => handleConnect("stripe")}>
                        <CardBody className="flex flex-col items-center justify-center p-6 text-center">
                          <Icon icon="logos:stripe" className="text-4xl mb-4" />
                          <p className="font-medium">Stripe</p>
                          <Button size="sm" color="primary" className="mt-4">Conectar</Button>
                        </CardBody>
                      </Card>
                    </div>
                  </Tab>
                  <Tab key="monitoring" title="Monitoreo">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                      <Card isPressable onPress={() => handleConnect("datadog")}>
                        <CardBody className="flex flex-col items-center justify-center p-6 text-center">
                          <Icon icon="logos:datadog" className="text-4xl mb-4" />
                          <p className="font-medium">Datadog</p>
                          <Button size="sm" color="primary" className="mt-4">Conectar</Button>
                        </CardBody>
                      </Card>
                      <Card isPressable onPress={() => handleConnect("newrelic")}>
                        <CardBody className="flex flex-col items-center justify-center p-6 text-center">
                          <Icon icon="logos:new-relic" className="text-4xl mb-4" />
                          <p className="font-medium">New Relic</p>
                          <Button size="sm" color="primary" className="mt-4">Conectar</Button>
                        </CardBody>
                      </Card>
                      <Card isPressable onPress={() => handleConnect("prometheus")}>
                        <CardBody className="flex flex-col items-center justify-center p-6 text-center">
                          <Icon icon="logos:prometheus" className="text-4xl mb-4" />
                          <p className="font-medium">Prometheus</p>
                          <Button size="sm" color="primary" className="mt-4">Conectar</Button>
                        </CardBody>
                      </Card>
                    </div>
                  </Tab>
                  <Tab key="other" title="Otros">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                      <Card isPressable onPress={() => handleConnect("github")}>
                        <CardBody className="flex flex-col items-center justify-center p-6 text-center">
                          <Icon icon="logos:github-icon" className="text-4xl mb-4" />
                          <p className="font-medium">GitHub</p>
                          <Button size="sm" color="primary" className="mt-4">Conectar</Button>
                        </CardBody>
                      </Card>
                      <Card isPressable onPress={() => handleConnect("slack")}>
                        <CardBody className="flex flex-col items-center justify-center p-6 text-center">
                          <Icon icon="logos:slack-icon" className="text-4xl mb-4" />
                          <p className="font-medium">Slack</p>
                          <Button size="sm" color="primary" className="mt-4">Conectar</Button>
                        </CardBody>
                      </Card>
                      <Card isPressable onPress={() => handleConnect("jira")}>
                        <CardBody className="flex flex-col items-center justify-center p-6 text-center">
                          <Icon icon="logos:jira" className="text-4xl mb-4" />
                          <p className="font-medium">Jira</p>
                          <Button size="sm" color="primary" className="mt-4">Conectar</Button>
                        </CardBody>
                      </Card>
                    </div>
                  </Tab>
                </Tabs>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancelar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};