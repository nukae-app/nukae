import React from "react";
import { 
  Card, 
  CardBody, 
  Button, 
  Input, 
  Select, 
  SelectItem, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface SaasLicense {
  id: string;
  name: string;
  provider: string;
  cost: number;
  billingCycle: string;
  users: number;
  renewalDate: string;
  status: "active" | "expiring" | "expired";
  category: string;
}

export const SaasLicenses = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [licenses, setLicenses] = React.useState<SaasLicense[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  const [newLicense, setNewLicense] = React.useState<Partial<SaasLicense>>({
    name: "",
    provider: "",
    cost: 0,
    billingCycle: "monthly",
    users: 0,
    renewalDate: "",
    status: "active",
    category: ""
  });
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  
  const categories = Array.from(new Set(licenses.map(license => license.category)));
  
  const handleInputChange = (field: keyof SaasLicense, value: any) => {
    setNewLicense(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  React.useEffect(() => {
    const fetchLicenses = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/saas-licenses');
        
        if (!response.ok) {
          throw new Error('Failed to fetch SaaS licenses');
        }
        
        const data = await response.json();
        setLicenses(data);
      } catch (err) {
        console.error('Error fetching SaaS licenses:', err);
        setError('Failed to load SaaS licenses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLicenses();
  }, []);
  
  const handleAddLicense = async () => {
    if (newLicense.name && newLicense.provider && newLicense.renewalDate) {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/saas-licenses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newLicense),
        });
        
        if (!response.ok) {
          throw new Error('Failed to add SaaS license');
        }
        
        const addedLicense = await response.json();
        setLicenses(prev => [...prev, addedLicense]);
        
        // Reset form
        setNewLicense({
          name: "",
          provider: "",
          cost: 0,
          billingCycle: "monthly",
          users: 0,
          renewalDate: "",
          status: "active",
          category: ""
        });
        
        onOpenChange(false);
      } catch (err) {
        console.error('Error adding SaaS license:', err);
        // Show error notification
      }
    }
  };
  
  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = license.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          license.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || license.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const totalCost = filteredLicenses.reduce((sum, license) => sum + license.cost, 0);
  const totalUsers = filteredLicenses.reduce((sum, license) => sum + license.users, 0);
  const expiringCount = filteredLicenses.filter(license => license.status === "expiring").length;
  
  const statusColorMap = {
    active: "success",
    expiring: "warning",
    expired: "danger"
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
        <p className="ml-2">Loading SaaS licenses...</p>
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
        <h1 className="text-2xl font-semibold">SaaS Licencias</h1>
        <Button 
          color="primary" 
          startContent={<Icon icon="lucide:plus" />}
          onPress={onOpen}
        >
          Añadir Licencia
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="space-y-2">
            <p className="text-default-600">Gasto Total Mensual</p>
            <p className="text-3xl font-semibold">${totalCost.toLocaleString()}</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="space-y-2">
            <p className="text-default-600">Usuarios Totales</p>
            <p className="text-3xl font-semibold">{totalUsers}</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="space-y-2">
            <p className="text-default-600">Licencias por Renovar</p>
            <p className="text-3xl font-semibold text-warning">{expiringCount}</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody className="p-0">
          <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Input
                placeholder="Buscar licencias..."
                startContent={<Icon icon="lucide:search" className="text-default-400" />}
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="w-full sm:w-80"
              />
              <Select 
                placeholder="Categoría" 
                selectedKeys={[selectedCategory]}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-48"
              >
                <SelectItem key="all" value="all">Todas las categorías</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
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
            aria-label="SaaS Licenses table"
            classNames={{
              th: "bg-default-50"
            }}
          >
            <TableHeader>
              <TableColumn>NOMBRE</TableColumn>
              <TableColumn>PROVEEDOR</TableColumn>
              <TableColumn>COSTO</TableColumn>
              <TableColumn>CICLO</TableColumn>
              <TableColumn>USUARIOS</TableColumn>
              <TableColumn>RENOVACIÓN</TableColumn>
              <TableColumn>ESTADO</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredLicenses.map((license) => (
                <TableRow key={license.id}>
                  <TableCell>{license.name}</TableCell>
                  <TableCell>{license.provider}</TableCell>
                  <TableCell>${license.cost.toLocaleString()}</TableCell>
                  <TableCell className="capitalize">{license.billingCycle}</TableCell>
                  <TableCell>{license.users}</TableCell>
                  <TableCell>{new Date(license.renewalDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip 
                      color={statusColorMap[license.status] as any} 
                      variant="flat" 
                      size="sm"
                    >
                      {license.status === "active" ? "Activo" : 
                       license.status === "expiring" ? "Por renovar" : "Expirado"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly variant="light" size="sm">
                          <Icon icon="lucide:more-horizontal" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Actions">
                        <DropdownItem startContent={<Icon icon="lucide:edit" />}>
                          Editar
                        </DropdownItem>
                        <DropdownItem startContent={<Icon icon="lucide:refresh-cw" />}>
                          Renovar
                        </DropdownItem>
                        <DropdownItem 
                          startContent={<Icon icon="lucide:trash-2" />}
                          className="text-danger"
                        >
                          Eliminar
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
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
              <ModalHeader className="flex flex-col gap-1">Añadir Nueva Licencia</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre"
                    placeholder="Nombre del software"
                    value={newLicense.name}
                    onValueChange={(value) => handleInputChange("name", value)}
                  />
                  <Input
                    label="Proveedor"
                    placeholder="Nombre del proveedor"
                    value={newLicense.provider}
                    onValueChange={(value) => handleInputChange("provider", value)}
                  />
                  <Input
                    label="Costo"
                    placeholder="0"
                    type="number"
                    startContent={<div className="pointer-events-none">$</div>}
                    value={newLicense.cost?.toString()}
                    onValueChange={(value) => handleInputChange("cost", Number(value))}
                  />
                  <Select
                    label="Ciclo de Facturación"
                    placeholder="Seleccionar ciclo"
                    selectedKeys={[newLicense.billingCycle || "monthly"]}
                    onChange={(e) => handleInputChange("billingCycle", e.target.value)}
                  >
                    <SelectItem key="monthly" value="monthly">Mensual</SelectItem>
                    <SelectItem key="quarterly" value="quarterly">Trimestral</SelectItem>
                    <SelectItem key="annual" value="annual">Anual</SelectItem>
                  </Select>
                  <Input
                    label="Usuarios"
                    placeholder="0"
                    type="number"
                    value={newLicense.users?.toString()}
                    onValueChange={(value) => handleInputChange("users", Number(value))}
                  />
                  <Input
                    label="Fecha de Renovación"
                    placeholder="YYYY-MM-DD"
                    type="date"
                    value={newLicense.renewalDate}
                    onChange={(e) => handleInputChange("renewalDate", e.target.value)}
                  />
                  <Select
                    label="Estado"
                    placeholder="Seleccionar estado"
                    selectedKeys={[newLicense.status || "active"]}
                    onChange={(e) => handleInputChange("status", e.target.value as any)}
                  >
                    <SelectItem key="active" value="active">Activo</SelectItem>
                    <SelectItem key="expiring" value="expiring">Por renovar</SelectItem>
                    <SelectItem key="expired" value="expired">Expirado</SelectItem>
                  </Select>
                  <Input
                    label="Categoría"
                    placeholder="Ej: Productividad, Comunicación"
                    value={newLicense.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={handleAddLicense}>
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};