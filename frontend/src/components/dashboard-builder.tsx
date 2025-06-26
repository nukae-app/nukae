import React from "react";
import { 
  Card, 
  CardBody, 
  Button, 
  Input, 
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Select,
  SelectItem,
  Chip,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface Field {
  id: string;
  name: string;
  type: "string" | "number" | "date" | "boolean";
  table: string;
}

interface Filter {
  id: string;
  field: string;
  operator: string;
  value: string | number | boolean;
}

interface Widget {
  id: string;
  type: "chart" | "metric" | "table";
  title: string;
  chartType?: "bar" | "line" | "pie" | "area";
  size: "small" | "medium" | "large";
  filters: Filter[];
  fields: string[];
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: Widget[];
  filters: Filter[];
}

// Add ChartLibraryItem interface
interface ChartLibraryItem {
  id: string;
  name: string;
  type: string;
  chartType: string;
  fields: string[];
  createdAt: string;
  folderId?: string;
}

// Update props interface
interface DashboardBuilderProps {
  chartLibrary: ChartLibraryItem[];
}

export const DashboardBuilder = ({ chartLibrary }: DashboardBuilderProps) => {
  const { isOpen: isWidgetModalOpen, onOpen: onWidgetModalOpen, onOpenChange: onWidgetModalOpenChange } = useDisclosure();
  const { isOpen: isFilterModalOpen, onOpen: onFilterModalOpen, onOpenChange: onFilterModalOpenChange } = useDisclosure();
  const { isOpen: isChartSelectorOpen, onOpen: onChartSelectorOpen, onOpenChange: onChartSelectorOpenChange } = useDisclosure();
  
  const [availableFields, setAvailableFields] = React.useState<Field[]>([
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
  ]);

  const [dashboard, setDashboard] = React.useState<Dashboard>({
    id: "1",
    name: "Cloud Cost Analysis",
    description: "Overview of cloud costs across services and regions",
    widgets: [
      {
        id: "widget-1",
        type: "chart",
        chartType: "bar",
        title: "Cost by Service",
        size: "medium",
        filters: [],
        fields: ["service_name", "cost"]
      },
      {
        id: "widget-2",
        type: "metric",
        title: "Total Monthly Cost",
        size: "small",
        filters: [],
        fields: ["cost"]
      },
      {
        id: "widget-3",
        type: "chart",
        chartType: "line",
        title: "Cost Trend",
        size: "large",
        filters: [],
        fields: ["date", "cost"]
      },
      {
        id: "widget-4",
        type: "table",
        title: "Top Resources by Cost",
        size: "medium",
        filters: [],
        fields: ["resource_id", "service_name", "cost"],
        sortBy: "cost",
        sortDirection: "desc"
      }
    ],
    filters: []
  });

  const [newWidget, setNewWidget] = React.useState<Partial<Widget>>({
    type: "chart",
    chartType: "bar",
    title: "",
    size: "medium",
    filters: [],
    fields: []
  });

  const [newFilter, setNewFilter] = React.useState<Partial<Filter>>({
    field: "",
    operator: "equals",
    value: ""
  });

  const [selectedFields, setSelectedFields] = React.useState<string[]>([]);
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const [editingWidgetId, setEditingWidgetId] = React.useState<string | null>(null);

  const [chartSearchQuery, setChartSearchQuery] = React.useState("");

  const handleAddWidget = () => {
    if (newWidget.title && newWidget.fields && newWidget.fields.length > 0) {
      const widget: Widget = {
        id: `widget-${Date.now()}`,
        type: newWidget.type || "chart",
        chartType: newWidget.type === "chart" ? newWidget.chartType : undefined,
        title: newWidget.title,
        size: newWidget.size || "medium",
        filters: newWidget.filters || [],
        fields: newWidget.fields,
        sortBy: newWidget.sortBy,
        sortDirection: newWidget.sortDirection
      };

      if (editMode && editingWidgetId) {
        setDashboard(prev => ({
          ...prev,
          widgets: prev.widgets.map(w => 
            w.id === editingWidgetId ? widget : w
          )
        }));
        setEditMode(false);
        setEditingWidgetId(null);
      } else {
        setDashboard(prev => ({
          ...prev,
          widgets: [...prev.widgets, widget]
        }));
      }

      setNewWidget({
        type: "chart",
        chartType: "bar",
        title: "",
        size: "medium",
        filters: [],
        fields: []
      });
      setSelectedFields([]);
      onWidgetModalOpenChange(false);
    }
  };

  const handleAddFilter = () => {
    if (newFilter.field && newFilter.operator) {
      const filter: Filter = {
        id: `filter-${Date.now()}`,
        field: newFilter.field || "",
        operator: newFilter.operator || "equals",
        value: newFilter.value || ""
      };

      setDashboard(prev => ({
        ...prev,
        filters: [...prev.filters, filter]
      }));

      setNewFilter({
        field: "",
        operator: "equals",
        value: ""
      });
      onFilterModalOpenChange(false);
    }
  };

  const handleRemoveWidget = (id: string) => {
    setDashboard(prev => ({
      ...prev,
      widgets: prev.widgets.filter(widget => widget.id !== id)
    }));
  };

  const handleEditWidget = (id: string) => {
    const widget = dashboard.widgets.find(w => w.id === id);
    if (widget) {
      setNewWidget(widget);
      setSelectedFields(widget.fields);
      setEditMode(true);
      setEditingWidgetId(id);
      onWidgetModalOpen();
    }
  };

  const handleRemoveFilter = (id: string) => {
    setDashboard(prev => ({
      ...prev,
      filters: prev.filters.filter(filter => filter.id !== id)
    }));
  };

  const handleFieldSelection = (fieldId: string) => {
    const isSelected = selectedFields.includes(fieldId);
    
    if (isSelected) {
      setSelectedFields(prev => prev.filter(id => id !== fieldId));
      setNewWidget(prev => ({
        ...prev,
        fields: (prev.fields || []).filter(id => id !== fieldId)
      }));
    } else {
      setSelectedFields(prev => [...prev, fieldId]);
      setNewWidget(prev => ({
        ...prev,
        fields: [...(prev.fields || []), fieldId]
      }));
    }
  };

  const getFieldNameById = (id: string) => {
    const field = availableFields.find(f => f.name === id);
    return field ? field.name : id;
  };

  const getOperatorLabel = (operator: string) => {
    const operatorMap: Record<string, string> = {
      equals: "=",
      not_equals: "≠",
      greater_than: ">",
      less_than: "<",
      contains: "contains",
      starts_with: "starts with",
      ends_with: "ends with"
    };
    return operatorMap[operator] || operator;
  };

  const renderWidgetPreview = (widget: Widget) => {
    switch (widget.type) {
      case "chart":
        return (
          <div className="h-40 bg-default-100 rounded-md flex items-center justify-center">
            {widget.chartType === "bar" && <Icon icon="lucide:bar-chart-2" className="text-4xl text-default-400" />}
            {widget.chartType === "line" && <Icon icon="lucide:line-chart" className="text-4xl text-default-400" />}
            {widget.chartType === "pie" && <Icon icon="lucide:pie-chart" className="text-4xl text-default-400" />}
            {widget.chartType === "area" && <Icon icon="lucide:area-chart" className="text-4xl text-default-400" />}
          </div>
        );
      case "metric":
        return (
          <div className="h-40 bg-default-100 rounded-md flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">$12,450</span>
            <span className="text-default-500">Total Cost</span>
          </div>
        );
      case "table":
        return (
          <div className="h-40 bg-default-100 rounded-md flex items-center justify-center">
            <Icon icon="lucide:table" className="text-4xl text-default-400" />
          </div>
        );
      default:
        return null;
    }
  };

  const handleAddChartFromLibrary = (chartId: string) => {
    const selectedChart = chartLibrary.find(chart => chart.id === chartId);
    
    if (selectedChart) {
      const widget: Widget = {
        id: `widget-${Date.now()}`,
        type: "chart",
        chartType: selectedChart.chartType as any,
        title: selectedChart.name,
        size: "medium",
        filters: [],
        fields: selectedChart.fields,
        chartId: selectedChart.id // Store reference to original chart
      };
      
      setDashboard(prev => ({
        ...prev,
        widgets: [...prev.widgets, widget]
      }));
      
      onChartSelectorOpenChange(false);
    }
  };

  const filteredCharts = chartSearchQuery
    ? chartLibrary.filter(chart => 
        chart.name.toLowerCase().includes(chartSearchQuery.toLowerCase()) ||
        chart.fields.some(field => field.toLowerCase().includes(chartSearchQuery.toLowerCase()))
      )
    : chartLibrary;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">{dashboard.name}</h1>
          <p className="text-default-500">{dashboard.description}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="flat" 
            color="primary"
            startContent={<Icon icon="lucide:filter" />}
            onPress={onFilterModalOpen}
          >
            Add Filter
          </Button>
          <Button 
            variant="flat"
            color="primary"
            startContent={<Icon icon="lucide:library" />}
            onPress={onChartSelectorOpen}
          >
            Add From Library
          </Button>
          <Button 
            color="primary" 
            startContent={<Icon icon="lucide:plus" />}
            onPress={onWidgetModalOpen}
          >
            Create Widget
          </Button>
        </div>
      </div>

      {dashboard.filters.length > 0 && (
        <Card>
          <CardBody>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-medium">Filters:</span>
              {dashboard.filters.map(filter => (
                <Chip 
                  key={filter.id} 
                  onClose={() => handleRemoveFilter(filter.id)}
                  variant="flat"
                  className="py-1"
                >
                  {getFieldNameById(filter.field)} {getOperatorLabel(filter.operator)} {filter.value.toString()}
                </Chip>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboard.widgets.map(widget => (
          <Card 
            key={widget.id} 
            className={`${
              widget.size === "small" ? "col-span-1" : 
              widget.size === "medium" ? "col-span-2" : 
              "col-span-4"
            }`}
          >
            <CardBody>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">{widget.title}</h3>
                <div className="flex gap-1">
                  <Button 
                    isIconOnly 
                    size="sm" 
                    variant="light"
                    onPress={() => handleEditWidget(widget.id)}
                  >
                    <Icon icon="lucide:edit" className="text-default-500" />
                  </Button>
                  <Button 
                    isIconOnly 
                    size="sm" 
                    variant="light"
                    onPress={() => handleRemoveWidget(widget.id)}
                  >
                    <Icon icon="lucide:trash-2" className="text-default-500" />
                  </Button>
                </div>
              </div>
              {renderWidgetPreview(widget)}
              <div className="mt-2 text-xs text-default-500">
                <span>Fields: {widget.fields.map(getFieldNameById).join(", ")}</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal isOpen={isWidgetModalOpen} onOpenChange={onWidgetModalOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {editMode ? "Edit Widget" : "Add New Widget"}
              </ModalHeader>
              <ModalBody>
                <Tabs aria-label="Widget options">
                  <Tab key="general" title="General">
                    <div className="pt-4 space-y-4">
                      <Input
                        label="Widget Title"
                        placeholder="Enter widget title"
                        value={newWidget.title}
                        onValueChange={(value) => setNewWidget(prev => ({ ...prev, title: value }))}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                          label="Widget Type"
                          selectedKeys={[newWidget.type || "chart"]}
                          onChange={(e) => setNewWidget(prev => ({ ...prev, type: e.target.value as any }))}
                        >
                          <SelectItem key="chart" value="chart">Chart</SelectItem>
                          <SelectItem key="metric" value="metric">Metric</SelectItem>
                          <SelectItem key="table" value="table">Table</SelectItem>
                        </Select>
                        
                        {newWidget.type === "chart" && (
                          <Select
                            label="Chart Type"
                            selectedKeys={[newWidget.chartType || "bar"]}
                            onChange={(e) => setNewWidget(prev => ({ ...prev, chartType: e.target.value as any }))}
                          >
                            <SelectItem key="bar" value="bar">Bar Chart</SelectItem>
                            <SelectItem key="line" value="line">Line Chart</SelectItem>
                            <SelectItem key="pie" value="pie">Pie Chart</SelectItem>
                            <SelectItem key="area" value="area">Area Chart</SelectItem>
                          </Select>
                        )}
                        
                        <Select
                          label="Widget Size"
                          selectedKeys={[newWidget.size || "medium"]}
                          onChange={(e) => setNewWidget(prev => ({ ...prev, size: e.target.value as any }))}
                        >
                          <SelectItem key="small" value="small">Small (1/4 width)</SelectItem>
                          <SelectItem key="medium" value="medium">Medium (1/2 width)</SelectItem>
                          <SelectItem key="large" value="large">Large (Full width)</SelectItem>
                        </Select>
                        
                        {newWidget.type === "table" && (
                          <Select
                            label="Sort By"
                            selectedKeys={newWidget.sortBy ? [newWidget.sortBy] : []}
                            onChange={(e) => setNewWidget(prev => ({ ...prev, sortBy: e.target.value }))}
                          >
                            {availableFields.map(field => (
                              <SelectItem key={field.name} value={field.name}>{field.name}</SelectItem>
                            ))}
                          </Select>
                        )}
                        
                        {newWidget.sortBy && (
                          <Select
                            label="Sort Direction"
                            selectedKeys={[newWidget.sortDirection || "desc"]}
                            onChange={(e) => setNewWidget(prev => ({ ...prev, sortDirection: e.target.value as any }))}
                          >
                            <SelectItem key="asc" value="asc">Ascending</SelectItem>
                            <SelectItem key="desc" value="desc">Descending</SelectItem>
                          </Select>
                        )}
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
                    </div>
                  </Tab>
                  <Tab key="filters" title="Filters">
                    <div className="pt-4">
                      <p className="text-default-500 mb-4">Add specific filters for this widget (optional)</p>
                      
                      {(newWidget.filters || []).length > 0 ? (
                        <div className="space-y-2 mb-4">
                          {(newWidget.filters || []).map((filter, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                              <span>
                                {getFieldNameById(filter.field)} {getOperatorLabel(filter.operator)} {filter.value.toString()}
                              </span>
                              <Button 
                                isIconOnly 
                                size="sm" 
                                variant="light" 
                                color="danger"
                                onPress={() => {
                                  setNewWidget(prev => ({
                                    ...prev,
                                    filters: (prev.filters || []).filter((_, i) => i !== index)
                                  }));
                                }}
                              >
                                <Icon icon="lucide:trash-2" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-default-400 my-8">No filters added yet</p>
                      )}
                      
                      <div className="flex gap-2 items-end">
                        <Select
                          label="Field"
                          placeholder="Select field"
                          className="flex-1"
                        >
                          {availableFields.map(field => (
                            <SelectItem key={field.name} value={field.name}>{field.name}</SelectItem>
                          ))}
                        </Select>
                        <Select
                          label="Operator"
                          placeholder="Select operator"
                          className="flex-1"
                        >
                          <SelectItem key="equals" value="equals">Equals (=)</SelectItem>
                          <SelectItem key="not_equals" value="not_equals">Not Equals (≠)</SelectItem>
                          <SelectItem key="greater_than" value="greater_than">Greater Than (&gt;)</SelectItem>
                          <SelectItem key="less_than" value="less_than">Less Than (&lt;)</SelectItem>
                          <SelectItem key="contains" value="contains">Contains</SelectItem>
                        </Select>
                        <Input
                          label="Value"
                          placeholder="Enter value"
                          className="flex-1"
                        />
                        <Button color="primary">
                          Add
                        </Button>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleAddWidget}>
                  {editMode ? "Update Widget" : "Add Widget"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isFilterModalOpen} onOpenChange={onFilterModalOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add Dashboard Filter</ModalHeader>
              <ModalBody>
                <Select
                  label="Field"
                  placeholder="Select field"
                  selectedKeys={newFilter.field ? [newFilter.field] : []}
                  onChange={(e) => setNewFilter(prev => ({ ...prev, field: e.target.value }))}
                >
                  {availableFields.map(field => (
                    <SelectItem key={field.name} value={field.name}>{field.name}</SelectItem>
                  ))}
                </Select>
                
                <Select
                  label="Operator"
                  placeholder="Select operator"
                  selectedKeys={[newFilter.operator || "equals"]}
                  onChange={(e) => setNewFilter(prev => ({ ...prev, operator: e.target.value }))}
                >
                  <SelectItem key="equals" value="equals">Equals (=)</SelectItem>
                  <SelectItem key="not_equals" value="not_equals">Not Equals (≠)</SelectItem>
                  <SelectItem key="greater_than" value="greater_than">Greater Than (&gt;)</SelectItem>
                  <SelectItem key="less_than" value="less_than">Less Than (&lt;)</SelectItem>
                  <SelectItem key="contains" value="contains">Contains</SelectItem>
                  <SelectItem key="starts_with" value="starts_with">Starts With</SelectItem>
                  <SelectItem key="ends_with" value="ends_with">Ends With</SelectItem>
                </Select>
                
                <Input
                  label="Value"
                  placeholder="Enter value"
                  value={newFilter.value?.toString() || ""}
                  onChange={(e) => setNewFilter(prev => ({ ...prev, value: e.target.value }))}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleAddFilter}>
                  Add Filter
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Add Chart Library Selector Modal */}
      <Modal isOpen={isChartSelectorOpen} onOpenChange={onChartSelectorOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Chart from Library
              </ModalHeader>
              <ModalBody>
                <Input
                  placeholder="Search charts..."
                  startContent={<Icon icon="lucide:search" className="text-default-400" />}
                  value={chartSearchQuery}
                  onValueChange={setChartSearchQuery}
                  className="mb-4"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCharts.map(chart => (
                    <Card 
                      key={chart.id} 
                      isPressable 
                      className="hover:border-primary cursor-pointer"
                      onPress={() => handleAddChartFromLibrary(chart.id)}
                    >
                      <CardBody className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-default-100 rounded-md flex items-center justify-center">
                            {chart.chartType === "bar" && <Icon icon="lucide:bar-chart-2" className="text-2xl text-default-400" />}
                            {chart.chartType === "line" && <Icon icon="lucide:line-chart" className="text-2xl text-default-400" />}
                            {chart.chartType === "pie" && <Icon icon="lucide:pie-chart" className="text-2xl text-default-400" />}
                            {chart.chartType === "area" && <Icon icon="lucide:area-chart" className="text-2xl text-default-400" />}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{chart.name}</h3>
                            <p className="text-xs text-default-500">
                              Fields: {chart.fields.join(", ")}
                            </p>
                            <p className="text-xs text-default-400 mt-1">
                              Created: {new Date(chart.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
                
                {filteredCharts.length === 0 && (
                  <div className="text-center py-8">
                    <Icon icon="lucide:search-x" className="text-default-300 text-4xl mx-auto mb-2" />
                    <p className="text-default-500">No charts found</p>
                    <p className="text-default-400 text-sm">Try a different search term or create a new chart</p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onWidgetModalOpen}>
                  Create New Chart
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};