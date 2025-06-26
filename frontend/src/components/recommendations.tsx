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
  Select,
  SelectItem,
  Progress
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  service: string;
  resourceType: string;
  estimatedSaving: number;
  difficulty: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "implemented" | "dismissed";
  dateIdentified: string;
  provider: "aws" | "azure" | "gcp" | "other";
}

export const Recommendations = () => {
  const [recommendations, setRecommendations] = React.useState<Recommendation[]>([
    {
      id: "1",
      title: "Reduce CPU requests in frontend namespace",
      description: "Reduce los <cpuRequest> el los pods en el namespace frontend para optimizar costos.",
      service: "Kubernetes",
      resourceType: "Pod",
      estimatedSaving: 350,
      difficulty: "medium",
      status: "pending",
      dateIdentified: "2024-05-15",
      provider: "aws"
    },
    {
      id: "2",
      title: "Remove unused backup storage bucket",
      description: "Puedes eliminar el baucket de almacenamiento - backup- en G+ Cloud que no se usado en los últimos 30 días.",
      service: "Cloud Storage",
      resourceType: "Bucket",
      estimatedSaving: 240,
      difficulty: "low",
      status: "in_progress",
      dateIdentified: "2024-05-10",
      provider: "gcp"
    },
    {
      id: "3",
      title: "Right-size underutilized EC2 instances",
      description: "Hay 5 instancias EC2 con menos del 10% de utilización de CPU. Considera reducir su tamaño para ahorrar costos.",
      service: "EC2",
      resourceType: "Instance",
      estimatedSaving: 520,
      difficulty: "medium",
      status: "pending",
      dateIdentified: "2024-05-12",
      provider: "aws"
    },
    {
      id: "4",
      title: "Convert standard storage to infrequent access",
      description: "Convierte 500GB de almacenamiento estándar a acceso infrecuente para reducir costos.",
      service: "S3",
      resourceType: "Storage",
      estimatedSaving: 180,
      difficulty: "low",
      status: "implemented",
      dateIdentified: "2024-05-01",
      provider: "aws"
    },
    {
      id: "5",
      title: "Purchase reserved instances for stable workloads",
      description: "Compra instancias reservadas para cargas de trabajo estables que han estado ejecutándose durante más de 6 meses.",
      service: "Virtual Machines",
      resourceType: "Instance",
      estimatedSaving: 1200,
      difficulty: "high",
      status: "pending",
      dateIdentified: "2024-05-08",
      provider: "azure"
    }
  ]);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [selectedProvider, setSelectedProvider] = React.useState<string>("all");

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesSearch = rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rec.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || rec.status === selectedStatus;
    const matchesProvider = selectedProvider === "all" || rec.provider === selectedProvider;
    return matchesSearch && matchesStatus && matchesProvider;
  });

  const totalSavings = filteredRecommendations.reduce((sum, rec) => sum + rec.estimatedSaving, 0);
  const implementedSavings = filteredRecommendations
    .filter(rec => rec.status === "implemented")
    .reduce((sum, rec) => sum + rec.estimatedSaving, 0);
  
  const pendingCount = filteredRecommendations.filter(rec => rec.status === "pending").length;
  const implementedCount = filteredRecommendations.filter(rec => rec.status === "implemented").length;
  const implementationRate = recommendations.length > 0 
    ? Math.round((implementedCount / recommendations.length) * 100) 
    : 0;

  const difficultyColorMap = {
    low: "success",
    medium: "warning",
    high: "danger"
  };

  const statusColorMap = {
    pending: "default",
    in_progress: "primary",
    implemented: "success",
    dismissed: "danger"
  };

  const providerIconMap = {
    aws: "logos:aws",
    azure: "logos:microsoft-azure",
    gcp: "logos:google-cloud",
    other: "lucide:cloud"
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === id 
          ? { ...rec, status: newStatus as any } 
          : rec
      )
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Recomendaciones</h1>
        <Button 
          variant="flat" 
          color="primary"
          startContent={<Icon icon="lucide:refresh-cw" />}
        >
          Actualizar Recomendaciones
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="space-y-2">
            <p className="text-default-600">Ahorro Total Estimado</p>
            <p className="text-3xl font-semibold text-green-600">${totalSavings.toLocaleString()}</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="space-y-2">
            <p className="text-default-600">Ahorro Implementado</p>
            <p className="text-3xl font-semibold">${implementedSavings.toLocaleString()}</p>
            <div className="flex items-center gap-2">
              <Progress 
                value={implementationRate} 
                color="success"
                className="max-w-md"
                showValueLabel={true}
              />
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="space-y-2">
            <p className="text-default-600">Recomendaciones Pendientes</p>
            <p className="text-3xl font-semibold">{pendingCount}</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody className="p-0">
          <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Input
                placeholder="Buscar recomendaciones..."
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
                  <SelectItem key="pending" value="pending">Pendiente</SelectItem>
                  <SelectItem key="in_progress" value="in_progress">En Progreso</SelectItem>
                  <SelectItem key="implemented" value="implemented">Implementado</SelectItem>
                  <SelectItem key="dismissed" value="dismissed">Descartado</SelectItem>
                </Select>
                <Select 
                  placeholder="Proveedor" 
                  selectedKeys={[selectedProvider]}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full sm:w-40"
                >
                  <SelectItem key="all" value="all">Todos</SelectItem>
                  <SelectItem key="aws" value="aws">AWS</SelectItem>
                  <SelectItem key="azure" value="azure">Azure</SelectItem>
                  <SelectItem key="gcp" value="gcp">Google Cloud</SelectItem>
                  <SelectItem key="other" value="other">Otros</SelectItem>
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
            aria-label="Recommendations table"
            classNames={{
              th: "bg-default-50"
            }}
          >
            <TableHeader>
              <TableColumn>RECOMENDACIÓN</TableColumn>
              <TableColumn>SERVICIO</TableColumn>
              <TableColumn>AHORRO EST.</TableColumn>
              <TableColumn>DIFICULTAD</TableColumn>
              <TableColumn>ESTADO</TableColumn>
              <TableColumn>FECHA</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredRecommendations.map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <Icon icon={providerIconMap[rec.provider]} className="text-xl mt-0.5" />
                      <div>
                        <p className="font-medium">{rec.title}</p>
                        <p className="text-default-500 text-sm">{rec.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{rec.service}</TableCell>
                  <TableCell className="text-green-600 font-medium">${rec.estimatedSaving}</TableCell>
                  <TableCell>
                    <Chip 
                      color={difficultyColorMap[rec.difficulty] as any} 
                      variant="flat" 
                      size="sm"
                    >
                      {rec.difficulty === "low" ? "Baja" : 
                       rec.difficulty === "medium" ? "Media" : "Alta"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Select
                      size="sm"
                      selectedKeys={[rec.status]}
                      onChange={(e) => handleStatusChange(rec.id, e.target.value)}
                      classNames={{
                        trigger: "min-h-8 h-8"
                      }}
                    >
                      <SelectItem key="pending" value="pending">Pendiente</SelectItem>
                      <SelectItem key="in_progress" value="in_progress">En Progreso</SelectItem>
                      <SelectItem key="implemented" value="implemented">Implementado</SelectItem>
                      <SelectItem key="dismissed" value="dismissed">Descartado</SelectItem>
                    </Select>
                  </TableCell>
                  <TableCell>{new Date(rec.dateIdentified).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="flat" isIconOnly>
                        <Icon icon="lucide:eye" />
                      </Button>
                      <Button size="sm" variant="flat" color="primary" isIconOnly>
                        <Icon icon="lucide:check" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};