import React from "react";
import { 
  Card, 
  CardBody, 
  Button, 
  Input, 
  Select,
  SelectItem,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface Field {
  id: string;
  name: string;
  type: "string" | "number" | "date" | "boolean";
  table: string;
}

interface ChartCreatorProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (chart: {
    name: string;
    chartType: string;
    fields: string[];
    folderId?: string;
  }) => void;
  folders: { id: string; name: string; type: "folder" }[];
}

export const ChartCreator = ({ isOpen, onOpenChange, onSave, folders }: ChartCreatorProps) => {
  const [chartName, setChartName] = React.useState("");
  const [chartType, setChartType] = React.useState<string>("bar");
  const [selectedFields, setSelectedFields] = React.useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = React.useState<string>("");
  
  const availableFields: Field[] = [
    { id: "1", name: "service_name", type: "string", table: "cloud_costs" },
    { id: "2", name: "cost", type: "number", table: "cloud_costs" },
    { id: "3", name: "date", type: "date", table: "cloud_costs" },
    { id: "4", name: "region", type: "string", table: "cloud_costs" },
    { id: "5", name: "instance_type", type: "string", table: "cloud_costs" },
    { id: "6", name: "provider", type: "string", table: "cloud_costs" },
    { id: "7", name: "account_id", type: "string", table: "cloud_costs" },
    { id: "8", name: "resource_id", type: "string", table: "cloud_costs" },
    { id: "9", name: "tags", type: "string", table: "cloud_costs" },
    { id: "10", name: "usage_amount", type: "number", table: "cloud_costs" },
    { id: "11", name: "usage_unit", type: "string", table: "cloud_costs" },
    { id: "12", name: "is_recurring", type: "boolean", table: "cloud_costs" }
  ];
  
  const handleFieldSelection = (fieldName: string) => {
    const isSelected = selectedFields.includes(fieldName);
    
    if (isSelected) {
      setSelectedFields(prev => prev.filter(id => id !== fieldName));
    } else {
      setSelectedFields(prev => [...prev, fieldName]);
    }
  };
  
  const handleSave = () => {
    if (chartName && chartType && selectedFields.length > 0) {
      onSave({
        name: chartName,
        chartType,
        fields: selectedFields,
        folderId: selectedFolder || undefined
      });
      
      // Reset form
      setChartName("");
      setChartType("bar");
      setSelectedFields([]);
      setSelectedFolder("");
      
      onOpenChange(false);
    }
  };
  
  const handleClose = () => {
    // Reset form
    setChartName("");
    setChartType("bar");
    setSelectedFields([]);
    setSelectedFolder("");
    
    onOpenChange(false);
  };
  
  const renderChartPreview = () => {
    switch (chartType) {
      case "bar":
        return <Icon icon="lucide:bar-chart-2" className="text-5xl text-default-400" />;
      case "line":
        return <Icon icon="lucide:line-chart" className="text-5xl text-default-400" />;
      case "pie":
        return <Icon icon="lucide:pie-chart" className="text-5xl text-default-400" />;
      case "area":
        return <Icon icon="lucide:area-chart" className="text-5xl text-default-400" />;
      default:
        return null;
    }
  };
  
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Create New Chart</ModalHeader>
            <ModalBody>
              <Tabs aria-label="Chart options">
                <Tab key="general" title="General">
                  <div className="pt-4 space-y-4">
                    <Input
                      label="Chart Name"
                      placeholder="Enter chart name"
                      value={chartName}
                      onValueChange={setChartName}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Select
                          label="Chart Type"
                          selectedKeys={[chartType]}
                          onChange={(e) => setChartType(e.target.value)}
                        >
                          <SelectItem key="bar" value="bar">Bar Chart</SelectItem>
                          <SelectItem key="line" value="line">Line Chart</SelectItem>
                          <SelectItem key="pie" value="pie">Pie Chart</SelectItem>
                          <SelectItem key="area" value="area">Area Chart</SelectItem>
                        </Select>
                        
                        <Select
                          label="Folder (Optional)"
                          placeholder="Select folder"
                          selectedKeys={selectedFolder ? [selectedFolder] : []}
                          onChange={(e) => setSelectedFolder(e.target.value)}
                          className="mt-4"
                        >
                          {folders.map(folder => (
                            <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
                          ))}
                        </Select>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center bg-default-50 rounded-md p-4">
                        <p className="text-default-500 mb-2">Chart Preview</p>
                        {renderChartPreview()}
                      </div>
                    </div>
                  </div>
                </Tab>
                <Tab key="fields" title="Fields">
                  <div className="pt-4">
                    <Input
                      placeholder="Search fields..."
                      startContent={<Icon icon="lucide:search" className="text-default-400" />}
                      className="mb-4"
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {availableFields.map(field => (
                        <div 
                          key={field.id} 
                          className={`p-3 rounded-md border cursor-pointer ${
                            selectedFields.includes(field.name) 
                              ? "border-primary bg-primary-50" 
                              : "border-default-200 hover:border-primary-200"
                          }`}
                          onClick={() => handleFieldSelection(field.name)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{field.name}</p>
                              <p className="text-xs text-default-500">{field.type} • {field.table}</p>
                            </div>
                            {selectedFields.includes(field.name) && (
                              <Icon icon="lucide:check" className="text-primary" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {selectedFields.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Selected Fields:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedFields.map(field => (
                            <Chip 
                              key={field} 
                              onClose={() => handleFieldSelection(field)}
                              variant="flat"
                            >
                              {field}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={handleClose}>
                Cancel
              </Button>
              <Button 
                color="primary" 
                onPress={handleSave}
                isDisabled={!chartName || selectedFields.length === 0}
              >
                Create Chart
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};