import React from "react";
import { Button, Card, CardBody, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Input, Spinner, Tabs, Tab, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface FolderItem {
  id: string;
  name: string;
  type: "folder" | "dashboard";
  icon: string;
  children?: FolderItem[];
}

interface SortableItemProps {
  id: string;
  item: FolderItem;
  expandedFolders: Record<string, boolean>;
  toggleFolder: (id: string) => void;
  children?: React.ReactNode;
}

const SortableItem = ({ id, item, expandedFolders, toggleFolder, children }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 0
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div 
        className={`flex items-center justify-between p-2 rounded-md ${isDragging ? 'bg-default-100' : 'hover:bg-default-100'} cursor-pointer group`}
      >
        <div className="flex items-center gap-2 flex-1">
          <div {...listeners} className="cursor-grab p-1 hover:bg-default-200 rounded">
            <Icon icon="lucide:grip-vertical" className="text-default-400" />
          </div>
          
          {item.type === "folder" && (
            <Icon 
              icon={expandedFolders[item.id] ? "lucide:chevron-down" : "lucide:chevron-right"} 
              className="text-default-500" 
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(item.id);
              }}
            />
          )}
          
          {item.type === "folder" ? (
            <Icon icon={item.icon} className="text-blue-500 text-xl" />
          ) : (
            <Icon icon={item.icon} className="text-green-500 text-xl" />
          )}
          
          <span>{item.name}</span>
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light" size="sm">
                <Icon icon="lucide:more-horizontal" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Actions">
              <DropdownItem startContent={<Icon icon="lucide:edit" />}>
                Rename
              </DropdownItem>
              {item.type === "folder" && (
                <DropdownItem startContent={<Icon icon="lucide:plus-square" />}>
                  Add Dashboard
                </DropdownItem>
              )}
              <DropdownItem 
                startContent={<Icon icon="lucide:trash-2" />}
                className="text-danger"
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      {children}
    </div>
  );
};

// Add service for database operations
const useFoldersAndDashboards = () => {
  const [items, setItems] = React.useState<FolderItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Fetch data from backend API
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/folders-and-dashboards');
      
      if (!response.ok) {
        throw new Error('Failed to fetch folders and dashboards');
      }
      
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError("Failed to load folders and dashboards");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save changes to the backend
  const saveData = async (updatedItems: FolderItem[]) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/folders-and-dashboards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItems)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save changes');
      }
      
      // Update local state after successful save
      setItems(updatedItems);
      return true;
    } catch (err) {
      console.error("Failed to save changes:", err);
      return false;
    }
  };
  
  // Create a new folder in the database
  const createFolder = async (name: string) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type: "folder", icon: "lucide:folder" })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create folder');
      }
      
      const newFolder = await response.json();
      
      // Update local state after successful creation
      setItems(prev => [...prev, newFolder]);
      return true;
    } catch (err) {
      console.error("Failed to create folder:", err);
      return false;
    }
  };
  
  // Create a new dashboard in the database
  const createDashboard = async (name: string) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/dashboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type: "dashboard", icon: "lucide:bar-chart-2" })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create dashboard');
      }
      
      const newDashboard = await response.json();
      
      // Update local state after successful creation
      setItems(prev => [...prev, newDashboard]);
      return true;
    } catch (err) {
      console.error("Failed to create dashboard:", err);
      return false;
    }
  };
  
  // Load data on component mount
  React.useEffect(() => {
    fetchData();
  }, []);
  
  return {
    items,
    setItems,
    isLoading,
    error,
    refreshData: fetchData,
    saveData,
    createFolder,
    createDashboard
  };
};

// Import the new DashboardBuilder component
import { DashboardBuilder } from "./dashboard-builder";

// Import the ChartCreator component
import { ChartCreator } from "./chart-creator";

export const CloudCosts = () => {
  const { 
    items, 
    setItems, 
    isLoading, 
    error, 
    refreshData, 
    saveData,
    createFolder,
    createDashboard
  } = useFoldersAndDashboards();
  
  const [expandedFolders, setExpandedFolders] = React.useState<Record<string, boolean>>({
    "1": true,
    "2": true
  });

  const [searchQuery, setSearchQuery] = React.useState("");
  const [isCreatingFolder, setIsCreatingFolder] = React.useState(false);
  const [isCreatingDashboard, setIsCreatingDashboard] = React.useState(false);
  const [newItemName, setNewItemName] = React.useState("");
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeItem, setActiveItem] = React.useState<FolderItem | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<string>("folders");

  // Add chartLibrary state definition
  const [chartLibrary, setChartLibrary] = React.useState<{
    id: string;
    name: string;
    type: string;
    chartType: string;
    fields: string[];
    createdAt: string;
    folderId?: string;
  }[]>([]);
  
  const [isChartLibraryLoading, setIsChartLibraryLoading] = React.useState(true);
  const [chartLibraryError, setChartLibraryError] = React.useState<string | null>(null);
  
  // Fetch chart library from backend
  React.useEffect(() => {
    const fetchChartLibrary = async () => {
      setIsChartLibraryLoading(true);
      setChartLibraryError(null);
      
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/charts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch chart library');
        }
        
        const data = await response.json();
        setChartLibrary(data);
      } catch (err) {
        console.error('Error fetching chart library:', err);
        setChartLibraryError('Failed to load chart library');
      } finally {
        setIsChartLibraryLoading(false);
      }
    };
    
    fetchChartLibrary();
  }, []);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCreateFolder = async () => {
    if (newItemName.trim()) {
      setIsSaving(true);
      const success = await createFolder(newItemName);
      setIsSaving(false);
      
      if (success) {
        setNewItemName("");
        setIsCreatingFolder(false);
      }
    }
  };

  const handleCreateDashboard = async () => {
    if (newItemName.trim()) {
      setIsSaving(true);
      const success = await createDashboard(newItemName);
      setIsSaving(false);
      
      if (success) {
        setNewItemName("");
        setIsCreatingDashboard(false);
      }
    }
  };

  const findItemById = (items: FolderItem[], id: string): FolderItem | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    const foundItem = findItemById(items, active.id as string);
    if (foundItem) {
      setActiveItem(foundItem);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      let updatedItems: FolderItem[] = [];
      
      setItems((items) => {
        // Find the indices of the items
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          updatedItems = arrayMove(items, oldIndex, newIndex);
          return updatedItems;
        }
        
        // Handle nested items (future enhancement)
        
        return items;
      });
      
      // Save the updated order to the database
      if (updatedItems.length > 0) {
        setIsSaving(true);
        await saveData(updatedItems);
        setIsSaving(false);
      }
    }
    
    setActiveId(null);
    setActiveItem(null);
  };

  const filteredItems = searchQuery
    ? items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.children?.some(child => 
          child.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : items;

  // Add state for chart creator modal
  const { isOpen: isChartCreatorOpen, onOpen: onChartCreatorOpen, onOpenChange: onChartCreatorOpenChange } = useDisclosure();

  // Add function to handle chart creation with API
  const handleCreateChart = async (chart: {
    name: string;
    chartType: string;
    fields: string[];
    folderId?: string;
  }) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...chart,
          type: "chart",
          createdAt: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create chart');
      }
      
      const newChart = await response.json();
      setChartLibrary(prev => [...prev, newChart]);
      return true;
    } catch (err) {
      console.error('Error creating chart:', err);
      return false;
    }
  };

  // Get folders only (no dashboards)
  const foldersList = items.filter(item => item.type === "folder");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Cloud Costs</h1>
        <div className="flex gap-2">
          {isSaving && (
            <div className="flex items-center gap-2 text-default-500">
              <Spinner size="sm" />
              <span>Saving changes...</span>
            </div>
          )}
          {activeTab === "folders" && (
            <>
              <Button 
                color="primary" 
                startContent={<Icon icon="lucide:folder-plus" />}
                onPress={() => setIsCreatingFolder(true)}
              >
                New Folder
              </Button>
              <Button 
                color="primary" 
                startContent={<Icon icon="lucide:plus-square" />}
                onPress={() => setIsCreatingDashboard(true)}
              >
                New Dashboard
              </Button>
            </>
          )}
          <Button
            variant="flat"
            startContent={<Icon icon="lucide:refresh-cw" />}
            onPress={refreshData}
            isLoading={isLoading}
          >
            Refresh
          </Button>
        </div>
      </div>
      
      <Tabs 
        aria-label="Cloud Costs Options" 
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
      >
        <Tab key="folders" title="Folders & Dashboards">
          <Card className="mt-4">
            <CardBody className="p-0">
              <div className="p-4 border-b">
                <Input
                  placeholder="Search folders and dashboards..."
                  startContent={<Icon icon="lucide:search" className="text-default-400" />}
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="w-full max-w-md"
                />
              </div>
              
              <div className="p-4">
                {isCreatingFolder && (
                  <div className="mb-4 flex items-center gap-2">
                    <Icon icon="lucide:folder" className="text-blue-500 text-xl" />
                    <Input
                      placeholder="New folder name"
                      value={newItemName}
                      onValueChange={setNewItemName}
                      autoFocus
                      className="flex-1"
                      size="sm"
                    />
                    <Button 
                      color="primary" 
                      size="sm" 
                      onPress={handleCreateFolder}
                      isLoading={isSaving}
                    >
                      Create
                    </Button>
                    <Button 
                      variant="light" 
                      size="sm" 
                      onPress={() => {
                        setIsCreatingFolder(false);
                        setNewItemName("");
                      }}
                      isDisabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
                
                {isCreatingDashboard && (
                  <div className="mb-4 flex items-center gap-2">
                    <Icon icon="lucide:bar-chart-2" className="text-blue-500 text-xl" />
                    <Input
                      placeholder="New dashboard name"
                      value={newItemName}
                      onValueChange={setNewItemName}
                      autoFocus
                      className="flex-1"
                      size="sm"
                    />
                    <Button 
                      color="primary" 
                      size="sm" 
                      onPress={handleCreateDashboard}
                      isLoading={isSaving}
                    >
                      Create
                    </Button>
                    <Button 
                      variant="light" 
                      size="sm" 
                      onPress={() => {
                        setIsCreatingDashboard(false);
                        setNewItemName("");
                      }}
                      isDisabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
                
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Spinner size="lg" />
                    <p className="mt-4 text-default-500">Loading folders and dashboards...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <Icon icon="lucide:alert-triangle" className="text-danger text-4xl mx-auto mb-2" />
                    <p className="text-danger">{error}</p>
                    <Button 
                      color="primary" 
                      variant="flat" 
                      className="mt-4" 
                      onPress={refreshData}
                    >
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext 
                      items={filteredItems.map(item => item.id)} 
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-1">
                        {filteredItems.map(item => (
                          <SortableItem 
                            key={item.id} 
                            id={item.id} 
                            item={item} 
                            expandedFolders={expandedFolders}
                            toggleFolder={toggleFolder}
                          >
                            {item.type === "folder" && item.children && expandedFolders[item.id] && (
                              <div className="ml-8 space-y-1 mt-1">
                                {item.children.map(child => (
                                  <div 
                                    key={child.id}
                                    className="flex items-center justify-between p-2 rounded-md hover:bg-default-100 cursor-pointer group"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="cursor-grab p-1 hover:bg-default-200 rounded">
                                        <Icon icon="lucide:grip-vertical" className="text-default-400" />
                                      </div>
                                      <Icon icon={child.icon} className="text-green-500 text-xl" />
                                      <span>{child.name}</span>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Dropdown>
                                        <DropdownTrigger>
                                          <Button isIconOnly variant="light" size="sm">
                                            <Icon icon="lucide:more-horizontal" />
                                          </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu aria-label="Actions">
                                          <DropdownItem startContent={<Icon icon="lucide:edit" />}>
                                            Rename
                                          </DropdownItem>
                                          <DropdownItem startContent={<Icon icon="lucide:copy" />}>
                                            Duplicate
                                          </DropdownItem>
                                          <DropdownItem 
                                            startContent={<Icon icon="lucide:trash-2" />}
                                            className="text-danger"
                                          >
                                            Delete
                                          </DropdownItem>
                                        </DropdownMenu>
                                      </Dropdown>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </SortableItem>
                        ))}
                      </div>
                    </SortableContext>
                    
                    <DragOverlay>
                      {activeId && activeItem ? (
                        <div className="bg-content1 p-2 rounded-md shadow-md border border-default-200 flex items-center gap-2">
                          {activeItem.type === "folder" ? (
                            <Icon icon="lucide:folder" className="text-blue-500 text-xl" />
                          ) : (
                            <Icon icon="lucide:bar-chart-2" className="text-green-500 text-xl" />
                          )}
                          <span>{activeItem.name}</span>
                        </div>
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                )}
                
                {!isLoading && !error && filteredItems.length === 0 && (
                  <div className="text-center py-8">
                    <Icon icon="lucide:search-x" className="text-default-300 text-4xl mx-auto mb-2" />
                    <p className="text-default-500">No folders or dashboards found</p>
                    <p className="text-default-400 text-sm">Try a different search term or create new content</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
          
          {/* ... existing "Create your first dashboard" card ... */}
        </Tab>
        
        <Tab key="charts" title="Chart Library">
          <Card className="mt-4">
            <CardBody className="p-0">
              <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <Input
                  placeholder="Search charts..."
                  startContent={<Icon icon="lucide:search" className="text-default-400" />}
                  className="w-full max-w-md"
                />
                <Button 
                  color="primary" 
                  startContent={<Icon icon="lucide:plus" />}
                  onPress={onChartCreatorOpen}
                >
                  Create Chart
                </Button>
              </div>
              
              {/* ... existing chart library content ... */}
            </CardBody>
          </Card>
        </Tab>
        
        <Tab key="dashboard" title="Dashboard Builder">
          <div className="mt-4">
            <DashboardBuilder chartLibrary={chartLibrary} />
          </div>
        </Tab>
      </Tabs>
      
      {/* Add Chart Creator Modal */}
      <ChartCreator 
        isOpen={isChartCreatorOpen}
        onOpenChange={onChartCreatorOpenChange}
        onSave={handleCreateChart}
        folders={foldersList as any}
      />
    </div>
  );
};