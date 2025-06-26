import React from "react";
import { 
  Card, 
  CardBody, 
  Button, 
  Input, 
  Tabs, 
  Tab, 
  Switch,
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
  Select,
  SelectItem
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "viewer";
  status: "active" | "inactive" | "pending";
  lastLogin?: string;
  createdAt: string;
}

interface AccountSettings {
  companyName: string;
  email: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  notifications: {
    email: boolean;
    slack: boolean;
    browser: boolean;
  };
  apiKey: string;
}

export const Configuration = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [users, setUsers] = React.useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "admin",
      status: "active",
      lastLogin: "2024-05-19T10:30:00",
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "user",
      status: "active",
      lastLogin: "2024-05-18T14:45:00",
      createdAt: "2024-02-10"
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      role: "viewer",
      status: "inactive",
      lastLogin: "2024-05-10T09:15:00",
      createdAt: "2024-03-05"
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      role: "user",
      status: "pending",
      createdAt: "2024-05-15"
    }
  ]);

  const [newUser, setNewUser] = React.useState<Partial<User>>({
    name: "",
    email: "",
    role: "user",
    status: "pending"
  });

  const [settings, setSettings] = React.useState<AccountSettings>({
    companyName: "Acme Inc",
    email: "admin@acmeinc.com",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
    notifications: {
      email: true,
      slack: false,
      browser: true
    },
    apiKey: "api_key_12345678901234567890"
  });

  const handleInputChange = (field: keyof User, value: any) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingsChange = (field: keyof AccountSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (channel: keyof AccountSettings['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [channel]: value
      }
    }));
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user: User = {
        id: `user-${Date.now()}`,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role || "user",
        status: newUser.status || "pending",
        createdAt: new Date().toISOString().split('T')[0]
      };

      setUsers(prev => [...prev, user]);
      setNewUser({
        name: "",
        email: "",
        role: "user",
        status: "pending"
      });
      onOpenChange(false);
    }
  };

  const handleUpdateUserStatus = (id: string, status: User['status']) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === id 
          ? { ...user, status } 
          : user
      )
    );
  };

  const handleUpdateUserRole = (id: string, role: User['role']) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === id 
          ? { ...user, role } 
          : user
      )
    );
  };

  const roleColorMap = {
    admin: "primary",
    user: "success",
    viewer: "default"
  };

  const statusColorMap = {
    active: "success",
    inactive: "default",
    pending: "warning"
  };

  const generateNewApiKey = () => {
    const randomKey = `api_key_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    handleSettingsChange("apiKey", randomKey);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Configuración</h1>
      </div>

      <Card>
        <CardBody className="p-0">
          <Tabs aria-label="Configuration options">
            <Tab key="account" title="Cuenta">
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold">Configuración de la Cuenta</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Nombre de la Empresa"
                    value={settings.companyName}
                    onValueChange={(value) => handleSettingsChange("companyName", value)}
                  />
                  <Input
                    label="Email de Contacto"
                    value={settings.email}
                    onValueChange={(value) => handleSettingsChange("email", value)}
                  />
                  <Select
                    label="Zona Horaria"
                    selectedKeys={[settings.timezone]}
                    onChange={(e) => handleSettingsChange("timezone", e.target.value)}
                  >
                    <SelectItem key="America/New_York" value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem key="America/Chicago" value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem key="America/Denver" value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem key="America/Los_Angeles" value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem key="Europe/London" value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                    <SelectItem key="Europe/Paris" value="Europe/Paris">Central European Time (CET)</SelectItem>
                  </Select>
                  <Select
                    label="Formato de Fecha"
                    selectedKeys={[settings.dateFormat]}
                    onChange={(e) => handleSettingsChange("dateFormat", e.target.value)}
                  >
                    <SelectItem key="MM/DD/YYYY" value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem key="DD/MM/YYYY" value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem key="YYYY-MM-DD" value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </Select>
                  <Select
                    label="Moneda"
                    selectedKeys={[settings.currency]}
                    onChange={(e) => handleSettingsChange("currency", e.target.value)}
                  >
                    <SelectItem key="USD" value="USD">USD ($)</SelectItem>
                    <SelectItem key="EUR" value="EUR">EUR (€)</SelectItem>
                    <SelectItem key="GBP" value="GBP">GBP (£)</SelectItem>
                    <SelectItem key="JPY" value="JPY">JPY (¥)</SelectItem>
                  </Select>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Notificaciones</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Notificaciones por Email</p>
                        <p className="text-default-500 text-sm">Recibe alertas y reportes por email</p>
                      </div>
                      <Switch 
                        isSelected={settings.notifications.email}
                        onValueChange={(value) => handleNotificationChange("email", value)}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Notificaciones en Slack</p>
                        <p className="text-default-500 text-sm">Recibe alertas en tu canal de Slack</p>
                      </div>
                      <Switch 
                        isSelected={settings.notifications.slack}
                        onValueChange={(value) => handleNotificationChange("slack", value)}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Notificaciones en el Navegador</p>
                        <p className="text-default-500 text-sm">Recibe alertas en tiempo real en tu navegador</p>
                      </div>
                      <Switch 
                        isSelected={settings.notifications.browser}
                        onValueChange={(value) => handleNotificationChange("browser", value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">API Key</h3>
                  <div className="flex items-center gap-4">
                    <Input
                      value={settings.apiKey}
                      type="password"
                      readOnly
                      className="flex-1"
                    />
                    <Button 
                      color="primary"
                      onPress={generateNewApiKey}
                    >
                      Generar Nueva
                    </Button>
                  </div>
                  <p className="text-default-500 text-sm mt-2">
                    Esta clave te permite acceder a la API de Cloud Costs. Manténla segura.
                  </p>
                </div>

                <div className="flex justify-end mt-8">
                  <Button color="primary">
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            </Tab>
            <Tab key="users" title="Usuarios">
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Gestión de Usuarios</h2>
                  <Button 
                    color="primary" 
                    startContent={<Icon icon="lucide:user-plus" />}
                    onPress={onOpen}
                  >
                    Añadir Usuario
                  </Button>
                </div>
                
                <Table 
                  removeWrapper 
                  aria-label="Users table"
                  classNames={{
                    th: "bg-default-50"
                  }}
                >
                  <TableHeader>
                    <TableColumn>USUARIO</TableColumn>
                    <TableColumn>ROL</TableColumn>
                    <TableColumn>ESTADO</TableColumn>
                    <TableColumn>ÚLTIMO ACCESO</TableColumn>
                    <TableColumn>FECHA CREACIÓN</TableColumn>
                    <TableColumn>ACCIONES</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="bg-primary-100 text-primary-500 rounded-full w-9 h-9 flex items-center justify-center">
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-default-500 text-sm">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            size="sm"
                            selectedKeys={[user.role]}
                            onChange={(e) => handleUpdateUserRole(user.id, e.target.value as User['role'])}
                            classNames={{
                              trigger: "min-h-8 h-8"
                            }}
                          >
                            <SelectItem key="admin" value="admin">Administrador</SelectItem>
                            <SelectItem key="user" value="user">Usuario</SelectItem>
                            <SelectItem key="viewer" value="viewer">Visualizador</SelectItem>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            color={statusColorMap[user.status] as any} 
                            variant="flat" 
                            size="sm"
                          >
                            {user.status === "active" ? "Activo" : 
                             user.status === "inactive" ? "Inactivo" : "Pendiente"}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          {user.lastLogin 
                            ? new Date(user.lastLogin).toLocaleString() 
                            : "Nunca"}
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {user.status === "active" ? (
                              <Button 
                                size="sm" 
                                variant="flat" 
                                color="danger"
                                onPress={() => handleUpdateUserStatus(user.id, "inactive")}
                              >
                                Desactivar
                              </Button>
                            ) : user.status === "inactive" ? (
                              <Button 
                                size="sm" 
                                variant="flat" 
                                color="success"
                                onPress={() => handleUpdateUserStatus(user.id, "active")}
                              >
                                Activar
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="flat" 
                                color="success"
                                onPress={() => handleUpdateUserStatus(user.id, "active")}
                              >
                                Aprobar
                              </Button>
                            )}
                            <Button size="sm" variant="flat" color="primary" isIconOnly>
                              <Icon icon="lucide:edit" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Tab>
            <Tab key="billing" title="Facturación">
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold">Información de Facturación</h2>
                
                <Card>
                  <CardBody>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-medium">Plan Actual: <span className="text-primary-500">Pro</span></p>
                        <p className="text-default-500">$99/mes - Facturación mensual</p>
                      </div>
                      <Button color="primary">Cambiar Plan</Button>
                    </div>
                  </CardBody>
                </Card>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Método de Pago</h3>
                  <Card>
                    <CardBody>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Icon icon="logos:visa" className="text-2xl" />
                          <div>
                            <p className="font-medium">Visa terminada en 4242</p>
                            <p className="text-default-500 text-sm">Expira: 12/2025</p>
                          </div>
                        </div>
                        <Button variant="flat">Editar</Button>
                      </div>
                    </CardBody>
                  </Card>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Historial de Facturación</h3>
                  <Table 
                    removeWrapper 
                    aria-label="Billing history table"
                    classNames={{
                      th: "bg-default-50"
                    }}
                  >
                    <TableHeader>
                      <TableColumn>FECHA</TableColumn>
                      <TableColumn>DESCRIPCIÓN</TableColumn>
                      <TableColumn>MONTO</TableColumn>
                      <TableColumn>ESTADO</TableColumn>
                      <TableColumn>ACCIONES</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>01/05/2024</TableCell>
                        <TableCell>Plan Pro - Mayo 2024</TableCell>
                        <TableCell>$99.00</TableCell>
                        <TableCell>
                          <Chip color="success" variant="flat" size="sm">Pagado</Chip>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="flat" startContent={<Icon icon="lucide:download" />}>
                            Factura
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>01/04/2024</TableCell>
                        <TableCell>Plan Pro - Abril 2024</TableCell>
                        <TableCell>$99.00</TableCell>
                        <TableCell>
                          <Chip color="success" variant="flat" size="sm">Pagado</Chip>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="flat" startContent={<Icon icon="lucide:download" />}>
                            Factura
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>01/03/2024</TableCell>
                        <TableCell>Plan Pro - Marzo 2024</TableCell>
                        <TableCell>$99.00</TableCell>
                        <TableCell>
                          <Chip color="success" variant="flat" size="sm">Pagado</Chip>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="flat" startContent={<Icon icon="lucide:download" />}>
                            Factura
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Añadir Nuevo Usuario</ModalHeader>
              <ModalBody>
                <Input
                  label="Nombre"
                  placeholder="Nombre completo"
                  value={newUser.name}
                  onValueChange={(value) => handleInputChange("name", value)}
                />
                <Input
                  label="Email"
                  placeholder="email@ejemplo.com"
                  value={newUser.email}
                  onValueChange={(value) => handleInputChange("email", value)}
                />
                <Select
                  label="Rol"
                  selectedKeys={[newUser.role || "user"]}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                >
                  <SelectItem key="admin" value="admin">Administrador</SelectItem>
                  <SelectItem key="user" value="user">Usuario</SelectItem>
                  <SelectItem key="viewer" value="viewer">Visualizador</SelectItem>
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={handleAddUser}>
                  Añadir
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};