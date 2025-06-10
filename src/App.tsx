import React, { useState, useCallback } from 'react';
import { Upload, Download, Package, X } from 'lucide-react';

// Import components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MainContentRouter from './components/layout/MainContentRouter';
import ProductForm from './components/forms/ProductForm';
import ServiceForm from './components/forms/ServiceForm';
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
    TEMPLATE_PRODUCTS,
    TEMPLATE_SERVICES,
    TEMPLATE_VERSIONS,
    initializeProjectWithTemplates
} from './data/defaultData';
import { generateId, formatDate } from './utils/helpers';
import type { ProjectData, FileData, Product, Service, ApiVersion } from './types';

// Enhanced Version Form Component
const EnhancedVersionForm: React.FC<{
    version?: any;
    productId: string;
    serviceId: string;
    onSave: (data: any) => Promise<void>;
    onCancel: () => void;
    onPreview?: (data: any) => void;
    isEditing?: boolean;
}> = ({ version, productId, serviceId, onSave, onCancel, onPreview, isEditing = false }) => {
    const [formData, setFormData] = useState({
        version: version?.version || '1.0.0',
        status: version?.status || 'stable',
        release_date: version?.release_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        supported_until: version?.supported_until?.split('T')[0] || '',
        deprecated: version?.deprecated || false,
        beta: version?.beta || false,
        breaking_changes: version?.breaking_changes || false,
        introduction: version?.introduction || '',
        getting_started: version?.getting_started || '',
        supported_apis: version?.supported_apis || ['swagger'],
        api_specs: {
            openapi: version?.api_specs?.openapi || null,
            mqtt: version?.api_specs?.mqtt || null
        },
        tutorials: version?.tutorials || [],
        release_notes: version?.release_notes || [],
        service_id: serviceId,
        product_id: productId
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    React.useEffect(() => {
        if (!isEditing && !version) {
            setFormData(prev => ({
                ...prev,
                api_specs: { openapi: null, mqtt: null },
                tutorials: [],
                release_notes: [],
                introduction: '',
                getting_started: ''
            }));
        }
    }, [isEditing, version]);

    const statusOptions = [
        { value: 'stable', label: 'Stable' },
        { value: 'beta', label: 'Beta' },
        { value: 'deprecated', label: 'Deprecated' }
    ];

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async () => {
        const newErrors: Record<string, string> = {};
        if (!formData.version) newErrors.version = 'Version is required';
        if (!formData.release_date) newErrors.release_date = 'Release date is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error('Failed to save version:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        {isEditing ? 'Edit API Version' : 'Create New API Version'}
                    </h2>
                    <p className="text-gray-600 mt-1 text-sm">
                        {isEditing ? 'Update version information' : 'Add a new API version to this service'}
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Button type="button" variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : (isEditing ? 'Update Version' : 'Create Version')}
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Version Number *
                        </label>
                        <input
                            type="text"
                            value={formData.version}
                            onChange={(e) => updateField('version', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </input>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentation</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Introduction
                        </label>
                        <textarea
                            value={formData.introduction}
                            onChange={(e) => updateField('introduction', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Brief introduction to this API version..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Getting Started
                        </label>
                        <textarea
                            value={formData.getting_started}
                            onChange={(e) => updateField('getting_started', e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Instructions for getting started with this API..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

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

    // Navigation functions
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
        },
        goToServiceDetail: (productId: string, serviceId: string) => {
            setSelectedProduct(productId);
            setSelectedService(serviceId);
            setSelectedVersion(null);
            setCurrentView('service_detail');
        },
        goToVersionDetail: (productId: string, serviceId: string, versionId: string) => {
            setSelectedProduct(productId);
            setSelectedService(serviceId);
            setSelectedVersion(versionId);
            setCurrentView('version_detail');
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

            <div className="flex flex-1">
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
                    onToggleProduct={(id) => setExpandedProducts(prev =>
                        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
                    )}
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