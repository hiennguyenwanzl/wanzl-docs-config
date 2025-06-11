import React, { useState, useCallback } from 'react';
import { Upload, Download, Package, X } from 'lucide-react';

// Import components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MainContentRouter from './components/layout/MainContentRouter';
import ProductForm from './components/forms/ProductForm';
import ServiceForm from './components/forms/ServiceForm';
import VersionForm from './components/forms/VersionForm';
import Modal from './components/ui/Modal';
import Button from './components/ui/Button';
import Card, { CardContent } from './components/ui/Card';

// Import utilities and types
import {
    saveProjectData,
    loadProjectData,
    exportStaticSiteData
} from './utils/exportUtils';
import {
    EMPTY_PROJECT_DATA,
    initializeProjectWithTemplates
} from './data/defaultData';
import { generateId, formatDate } from './utils/helpers';
import type { ProjectData, FileData, Product, Service, ApiVersion } from './types';

// File Upload Component for Import
const FileUpload: React.FC<{ onFileUpload: (data: Partial<ProjectData>) => void }> = ({ onFileUpload }) => {
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const fileData: FileData = {
                name: file.name,
                content: await file.text(),
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
            };
            const projectData = await loadProjectData(fileData);
            onFileUpload(projectData);
        } catch (error) {
            alert('Failed to load project file: ' + (error as Error).message);
        }
    };

    return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Click to select a project JSON file</p>
                <p className="text-sm text-gray-500 mt-1">Only .json files are supported</p>
            </label>
        </div>
    );
};

// Main App Component
function App() {
    // Use empty project data as default
    const [projectData, setProjectData] = useState<ProjectData>(EMPTY_PROJECT_DATA);

    // UI State
    const [currentView, setCurrentView] = useState('products');
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedProducts, setExpandedProducts] = useState<string[]>([]);

    // Modal states
    const [showProductForm, setShowProductForm] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [showVersionForm, setShowVersionForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [editingVersion, setEditingVersion] = useState<ApiVersion | null>(null);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showQuickStartModal, setShowQuickStartModal] = useState(false);

    // Loading states
    const [isSaving, setIsSaving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Helper functions
    const getServicesCount = useCallback((productId: string) => {
        return projectData.services[productId]?.length || 0;
    }, [projectData.services]);

    const getVersionsCount = useCallback((productId: string, serviceId: string) => {
        return projectData.versions[productId]?.[serviceId]?.length || 0;
    }, [projectData.versions]);

    // Navigation functions - Enhanced with automatic expansion
    const navigationHandlers = {
        goToProductsList: () => {
            setCurrentView('products');
            setSelectedProduct(null);
            setSelectedService(null);
            setSelectedVersion(null);
        },
        goToProductDetail: (productId: string) => {
            setSelectedProduct(productId);
            setSelectedService(null);
            setSelectedVersion(null);
            setCurrentView('product_detail');

            // Auto-expand the product in sidebar
            if (!expandedProducts.includes(productId)) {
                setExpandedProducts(prev => [...prev, productId]);
            }
        },
        goToServiceDetail: (productId: string, serviceId: string) => {
            setSelectedProduct(productId);
            setSelectedService(serviceId);
            setSelectedVersion(null);
            setCurrentView('service_detail');

            // Auto-expand the product and service in sidebar
            const productExpanded = expandedProducts.includes(productId);
            const serviceExpanded = expandedProducts.includes(`${productId}-${serviceId}`);

            const newExpanded = [...expandedProducts];
            if (!productExpanded) newExpanded.push(productId);
            if (!serviceExpanded) newExpanded.push(`${productId}-${serviceId}`);

            setExpandedProducts(newExpanded);
        },
        goToVersionDetail: (productId: string, serviceId: string, versionId: string) => {
            setSelectedProduct(productId);
            setSelectedService(serviceId);
            setSelectedVersion(versionId);
            setCurrentView('version_detail');

            // Auto-expand the product and service in sidebar
            const productExpanded = expandedProducts.includes(productId);
            const serviceExpanded = expandedProducts.includes(`${productId}-${serviceId}`);

            const newExpanded = [...expandedProducts];
            if (!productExpanded) newExpanded.push(productId);
            if (!serviceExpanded) newExpanded.push(`${productId}-${serviceId}`);

            setExpandedProducts(newExpanded);
        }
    };

    // Action handlers
    const actionHandlers = {
        handleAddProduct: () => {
            setEditingProduct(null);
            setShowProductForm(true);
        },
        handleEditProduct: (product: Product) => {
            setEditingProduct(product);
            setShowProductForm(true);
        },
        handleDeleteProduct: (productId: string) => {
            const updatedData = { ...projectData };
            updatedData.products = updatedData.products.filter(p => p.id !== productId);
            delete updatedData.services[productId];
            delete updatedData.versions[productId];
            delete updatedData.apiSpecs[productId];
            setProjectData(updatedData);

            // Clear selection if deleted product was selected
            if (selectedProduct === productId) {
                navigationHandlers.goToProductsList();
            }
        },
        handleAddService: () => {
            setEditingService(null);
            setShowServiceForm(true);
        },
        handleEditService: (service: Service) => {
            setEditingService(service);
            setShowServiceForm(true);
        },
        handleDeleteService: (serviceId: string) => {
            if (!selectedProduct) return;
            const updatedData = { ...projectData };
            if (updatedData.services[selectedProduct]) {
                updatedData.services[selectedProduct] = updatedData.services[selectedProduct].filter(s => s.id !== serviceId);
            }
            if (updatedData.versions[selectedProduct]) {
                delete updatedData.versions[selectedProduct][serviceId];
            }
            if (updatedData.apiSpecs[selectedProduct]) {
                delete updatedData.apiSpecs[selectedProduct][serviceId];
            }
            setProjectData(updatedData);

            // Clear selection if deleted service was selected
            if (selectedService === serviceId) {
                navigationHandlers.goToProductDetail(selectedProduct);
            }
        },
        handleAddVersion: () => {
            setEditingVersion(null);
            setShowVersionForm(true);
        },
        handleEditVersion: (version: ApiVersion) => {
            setEditingVersion(version);
            setShowVersionForm(true);
        },
        handleDeleteVersion: (versionId: string) => {
            if (!selectedProduct || !selectedService) return;
            const updatedData = { ...projectData };
            if (updatedData.versions[selectedProduct]?.[selectedService]) {
                updatedData.versions[selectedProduct][selectedService] =
                    updatedData.versions[selectedProduct][selectedService].filter(v => v.version !== versionId);
            }
            if (updatedData.apiSpecs[selectedProduct]?.[selectedService]) {
                delete updatedData.apiSpecs[selectedProduct][selectedService][versionId];
            }
            setProjectData(updatedData);

            // Clear selection if deleted version was selected
            if (selectedVersion === versionId) {
                navigationHandlers.goToServiceDetail(selectedProduct, selectedService);
            }
        },
        handleSaveReleaseNotes: (productId: string, serviceId: string, versionId: string, data: any) => {
            const updatedData = { ...projectData };
            if (!updatedData.releaseNotes[productId]) {
                updatedData.releaseNotes[productId] = {};
            }
            if (!updatedData.releaseNotes[productId][serviceId]) {
                updatedData.releaseNotes[productId][serviceId] = {};
            }
            updatedData.releaseNotes[productId][serviceId][versionId] = data;
            setProjectData(updatedData);
        },
        handlePreviewProducts: () => {
            // This will be handled by MainContentRouter
        },
        handlePreviewProduct: (product: Product) => {
            // This will be handled by MainContentRouter
        },
        handlePreviewVersion: (version: ApiVersion) => {
            // This will be handled by MainContentRouter
        }
    };

    // Enhanced toggle handler for sidebar expansion
    const handleToggleProduct = useCallback((id: string) => {
        setExpandedProducts(prev => {
            if (prev.includes(id)) {
                // If collapsing, also collapse all children
                if (!id.includes('-')) {
                    // This is a product, collapse all its services too
                    return prev.filter(item => !item.startsWith(`${id}-`) && item !== id);
                } else {
                    // This is a service, just collapse it
                    return prev.filter(item => item !== id);
                }
            } else {
                // Expanding
                return [...prev, id];
            }
        });
    }, []);

    // Form submission handlers
    const handleSaveProduct = async (productData: Product) => {
        const updatedData = { ...projectData };

        if (editingProduct) {
            const index = updatedData.products.findIndex(p => p.id === editingProduct.id);
            if (index >= 0) {
                updatedData.products[index] = productData;
            }
        } else {
            updatedData.products.push(productData);
            updatedData.services[productData.id] = [];
            updatedData.versions[productData.id] = {};
            updatedData.apiSpecs[productData.id] = {};
        }

        setProjectData(updatedData);
        setShowProductForm(false);
        setEditingProduct(null);

        // Navigate to the new/edited product
        navigationHandlers.goToProductDetail(productData.id);
    };

    const handleSaveService = async (serviceData: Service) => {
        if (!selectedProduct) return;

        const updatedData = { ...projectData };

        if (!updatedData.services[selectedProduct]) {
            updatedData.services[selectedProduct] = [];
        }

        if (editingService) {
            const index = updatedData.services[selectedProduct].findIndex(s => s.id === editingService.id);
            if (index >= 0) {
                updatedData.services[selectedProduct][index] = serviceData;
            }
        } else {
            updatedData.services[selectedProduct].push(serviceData);
            if (!updatedData.versions[selectedProduct]) {
                updatedData.versions[selectedProduct] = {};
            }
            updatedData.versions[selectedProduct][serviceData.id] = [];

            if (!updatedData.apiSpecs[selectedProduct]) {
                updatedData.apiSpecs[selectedProduct] = {};
            }
            updatedData.apiSpecs[selectedProduct][serviceData.id] = {};
        }

        setProjectData(updatedData);
        setShowServiceForm(false);
        setEditingService(null);

        // Navigate to the new/edited service
        navigationHandlers.goToServiceDetail(selectedProduct, serviceData.id);
    };

    const handleSaveVersion = async (versionData: any) => {
        if (!selectedProduct || !selectedService) return;

        const updatedData = { ...projectData };

        if (!updatedData.versions[selectedProduct]) {
            updatedData.versions[selectedProduct] = {};
        }
        if (!updatedData.versions[selectedProduct][selectedService]) {
            updatedData.versions[selectedProduct][selectedService] = [];
        }
        if (!updatedData.apiSpecs[selectedProduct]) {
            updatedData.apiSpecs[selectedProduct] = {};
        }
        if (!updatedData.apiSpecs[selectedProduct][selectedService]) {
            updatedData.apiSpecs[selectedProduct][selectedService] = {};
        }

        const existingIndex = updatedData.versions[selectedProduct][selectedService].findIndex(
            v => v.version === versionData.version
        );

        if (existingIndex >= 0) {
            updatedData.versions[selectedProduct][selectedService][existingIndex] = versionData;
        } else {
            updatedData.versions[selectedProduct][selectedService].push(versionData);
        }

        updatedData.apiSpecs[selectedProduct][selectedService][versionData.version] = {
            openapi: versionData.api_specs?.openapi || null,
            mqtt: versionData.api_specs?.mqtt || null
        };

        setProjectData(updatedData);
        setShowVersionForm(false);
        setEditingVersion(null);

        // Navigate to the new/edited version
        navigationHandlers.goToVersionDetail(selectedProduct, selectedService, versionData.version);
    };

    // Import/Export handlers
    const handleImportProject = (data: Partial<ProjectData>) => {
        setProjectData(data as ProjectData);
        setShowImportModal(false);
        console.log('Project imported successfully');
    };

    const handleExportProject = async () => {
        setIsSaving(true);
        try {
            await saveProjectData(projectData);
            console.log('Project saved successfully');
        } catch (error) {
            alert('Failed to save project: ' + (error as Error).message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleExportStaticData = async () => {
        setIsExporting(true);
        try {
            await exportStaticSiteData(projectData);
            setShowExportModal(false);
            console.log('Static data exported successfully');
        } catch (error) {
            alert('Failed to export static data: ' + (error as Error).message);
        } finally {
            setIsExporting(false);
        }
    };

    // Quick start handlers
    const handleQuickStart = (option: 'empty' | 'templates') => {
        if (option === 'templates') {
            setProjectData(initializeProjectWithTemplates());
        } else {
            setProjectData(EMPTY_PROJECT_DATA);
        }
        setShowQuickStartModal(false);
    };

    // Show quick start modal on first load if no products exist
    React.useEffect(() => {
        if (projectData.products.length === 0) {
            setShowQuickStartModal(true);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header
                onSearch={setSearchTerm}
                searchTerm={searchTerm}
                onImport={() => setShowImportModal(true)}
                onExport={() => setShowExportModal(true)}
                onSave={handleExportProject}
                hasChanges={false}
            />

            <div className="flex flex-1 relative">
                <Sidebar
                    products={projectData.products}
                    services={projectData.services}
                    versions={projectData.versions}
                    selectedProduct={selectedProduct}
                    selectedService={selectedService}
                    selectedVersion={selectedVersion}
                    onSelectProduct={navigationHandlers.goToProductDetail}
                    onSelectService={navigationHandlers.goToServiceDetail}
                    onSelectVersion={navigationHandlers.goToVersionDetail}
                    onAddProduct={actionHandlers.handleAddProduct}
                    expandedProducts={expandedProducts}
                    onToggleProduct={handleToggleProduct}
                />

                <main className="flex-1 overflow-auto">
                    <MainContentRouter
                        projectData={projectData}
                        currentView={currentView}
                        selectedProduct={selectedProduct}
                        selectedService={selectedService}
                        selectedVersion={selectedVersion}
                        onNavigate={navigationHandlers}
                        onActions={actionHandlers}
                        getServicesCount={getServicesCount}
                        getVersionsCount={getVersionsCount}
                    />
                </main>
            </div>

            {/* Quick Start Modal */}
            <Modal
                isOpen={showQuickStartModal}
                onClose={() => setShowQuickStartModal(false)}
                title="Welcome to API Docs CMS"
                size="md"
            >
                <div className="space-y-6">
                    <p className="text-gray-600">
                        Get started with your API documentation project. Choose how you'd like to begin:
                    </p>

                    <div className="space-y-4">
                        <Card
                            className="cursor-pointer hover:bg-gray-50 border-2 border-transparent hover:border-blue-200"
                            onClick={() => handleQuickStart('empty')}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <Package className="w-8 h-8 text-gray-600" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Start Empty</h3>
                                        <p className="text-sm text-gray-600">Begin with a blank project and create everything from scratch</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="cursor-pointer hover:bg-gray-50 border-2 border-transparent hover:border-blue-200"
                            onClick={() => handleQuickStart('templates')}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <Package className="w-8 h-8 text-blue-600" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Use Templates</h3>
                                        <p className="text-sm text-gray-600">Start with sample products and services (FastLaner, SmartShelf, WUCA)</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Modal>

            {/* Product Form Modal */}
            <Modal
                isOpen={showProductForm}
                onClose={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                }}
                title={editingProduct ? 'Edit Product' : 'Create New Product'}
                size="xl"
            >
                <ProductForm
                    product={editingProduct}
                    onSave={handleSaveProduct}
                    onCancel={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                    }}
                    isEditing={!!editingProduct}
                />
            </Modal>

            {/* Service Form Modal */}
            <Modal
                isOpen={showServiceForm}
                onClose={() => {
                    setShowServiceForm(false);
                    setEditingService(null);
                }}
                title={editingService ? 'Edit Service' : 'Create New Service'}
                size="xl"
            >
                <ServiceForm
                    service={editingService}
                    productId={selectedProduct!}
                    onSave={handleSaveService}
                    onCancel={() => {
                        setShowServiceForm(false);
                        setEditingService(null);
                    }}
                    isEditing={!!editingService}
                />
            </Modal>

            {/* Version Form Modal */}
            <Modal
                isOpen={showVersionForm}
                onClose={() => {
                    setShowVersionForm(false);
                    setEditingVersion(null);
                }}
                title={editingVersion ? 'Edit API Version' : 'Create New API Version'}
                size="xl"
            >
                <VersionForm
                    version={editingVersion}
                    productId={selectedProduct!}
                    serviceId={selectedService!}
                    onSave={handleSaveVersion}
                    onCancel={() => {
                        setShowVersionForm(false);
                        setEditingVersion(null);
                    }}
                    isEditing={!!editingVersion}
                />
            </Modal>

            {/* Import Modal */}
            <Modal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                title="Import Project"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Import a previously saved project file to continue working on your documentation.
                    </p>
                    <FileUpload onFileUpload={handleImportProject} />
                </div>
            </Modal>

            {/* Enhanced Export Modal */}
            <Modal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                title="Export Options"
                footer={
                    <div className="flex justify-end space-x-3">
                        <Button variant="secondary" onClick={() => setShowExportModal(false)}>
                            Cancel
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <Card
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={handleExportProject}
                        >
                            <CardContent>
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <Download className="w-8 h-8 text-blue-600" />
                                        {isSaving && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {isSaving ? 'Saving Project Data...' : 'Export Project Data'}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Save your work with all API specifications as an optimized JSON file
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={handleExportStaticData}
                        >
                            <CardContent>
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <Package className="w-8 h-8 text-green-600" />
                                        {isExporting && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {isExporting ? 'Generating Static Site Data...' : 'Export Static Site Data'}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Generate the complete data structure with API specs for your static website
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">About API Specification Handling</h4>
                        <div className="text-sm text-blue-800 space-y-1">
                            <p>• <strong>Project Data Export:</strong> All API specs (YAML/JSON) are embedded in the project file</p>
                            <p>• <strong>Static Site Export:</strong> API specs are extracted to separate files in the correct folder structure</p>
                            <p>• <strong>File Support:</strong> Both OpenAPI/Swagger and AsyncAPI/MQTT specifications are fully supported</p>
                            <p>• <strong>Preview:</strong> All API specs can be previewed in the version detail pages</p>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default App;