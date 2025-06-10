import React, { useState } from 'react';
import { ProductsListPreview, ProductDetailPreview } from '../preview/PreviewComponents';
import { VersionPreview } from '../preview/VersionPreview';
import ProductsListView from '../views/ProductsListView';
import ProductDetailView from '../views/ProductDetailView';
import ServiceDetailView from '../views/ServiceDetailView';
import VersionDetailView from '../views/VersionDetailView';
import Modal from '../ui/Modal';
import ReleaseNotesEditor from '../forms/ReleaseNotesEditor';
import ApiSpecViewer from '../ui/ApiSpecViewer';
import type { ProjectData, Product, Service, ApiVersion } from '@/types';

interface MainContentRouterProps {
    projectData: ProjectData;
    currentView: string;
    selectedProduct: string | null;
    selectedService: string | null;
    selectedVersion: string | null;
    onNavigate: {
        goToProductsList: () => void;
        goToProductDetail: (productId: string) => void;
        goToServiceDetail: (productId: string, serviceId: string) => void;
        goToVersionDetail: (productId: string, serviceId: string, versionId: string) => void;
    };
    onActions: {
        handlePreviewProducts: () => void;
        handlePreviewProduct: (product: Product) => void;
        handlePreviewVersion: (version: ApiVersion) => void;
        handleEditProduct: (product: Product) => void;
        handleAddProduct: () => void;
        handleDeleteProduct: (productId: string) => void;
        handleEditService: (service: Service) => void;
        handleAddService: () => void;
        handleDeleteService: (serviceId: string) => void;
        handleEditVersion: (version: ApiVersion) => void;
        handleAddVersion: () => void;
        handleDeleteVersion: (versionId: string) => void;
        handleSaveReleaseNotes: (productId: string, serviceId: string, versionId: string, data: any) => void;
    };
    getServicesCount: (productId: string) => number;
    getVersionsCount: (productId: string, serviceId: string) => number;
}

interface PreviewState {
    show: boolean;
    mode: 'products' | 'product' | 'version';
    data: any;
}

const MainContentRouter: React.FC<MainContentRouterProps> = ({
                                                                 projectData,
                                                                 currentView,
                                                                 selectedProduct,
                                                                 selectedService,
                                                                 selectedVersion,
                                                                 onNavigate,
                                                                 onActions,
                                                                 getServicesCount,
                                                                 getVersionsCount
                                                             }) => {
    // Preview state
    const [previewState, setPreviewState] = useState<PreviewState>({
        show: false,
        mode: 'products',
        data: null
    });

    // Release notes editor state
    const [showReleaseNotesEditor, setShowReleaseNotesEditor] = useState(false);
    const [releaseNotesData, setReleaseNotesData] = useState<any>(null);

    // API Spec viewer state
    const [showApiSpecViewer, setShowApiSpecViewer] = useState(false);
    const [apiSpecData, setApiSpecData] = useState<{spec: any, type: 'swagger' | 'mqtt', title: string} | null>(null);

    // Helper functions to get current entities
    const getCurrentProduct = (): Product | undefined => {
        if (!selectedProduct) return undefined;
        return projectData.products.find(p => p.id === selectedProduct);
    };

    const getCurrentService = (): Service | undefined => {
        if (!selectedProduct || !selectedService) return undefined;
        return projectData.services[selectedProduct]?.find(s => s.id === selectedService);
    };

    const getCurrentVersion = (): ApiVersion | undefined => {
        if (!selectedProduct || !selectedService || !selectedVersion) return undefined;
        return projectData.versions[selectedProduct]?.[selectedService]?.find(v => v.version === selectedVersion);
    };

    // Enhanced action handlers with preview support
    const enhancedActions = {
        ...onActions,
        handlePreviewProducts: () => {
            setPreviewState({
                show: true,
                mode: 'products',
                data: projectData.products
            });
        },
        handlePreviewProduct: (product: Product) => {
            const services = projectData.services[product.id] || [];
            setPreviewState({
                show: true,
                mode: 'product',
                data: { product, services }
            });
        },
        handlePreviewVersion: (version: ApiVersion) => {
            setPreviewState({
                show: true,
                mode: 'version',
                data: version
            });
        },
        handleEditReleaseNotes: (version: ApiVersion) => {
            setReleaseNotesData({
                version: version.version,
                productId: selectedProduct,
                serviceId: selectedService,
                initialData: projectData.releaseNotes?.[selectedProduct!]?.[selectedService!]?.[version.version]
            });
            setShowReleaseNotesEditor(true);
        },
        handleViewApiSpec: (spec: any, type: 'swagger' | 'mqtt', title: string) => {
            setApiSpecData({ spec, type, title });
            setShowApiSpecViewer(true);
        }
    };

    // Close preview
    const closePreview = () => {
        setPreviewState({ show: false, mode: 'products', data: null });
    };

    // Handle release notes save
    const handleReleaseNotesSave = (data: any) => {
        if (releaseNotesData) {
            onActions.handleSaveReleaseNotes(
                releaseNotesData.productId,
                releaseNotesData.serviceId,
                releaseNotesData.version,
                data
            );
        }
        setShowReleaseNotesEditor(false);
        setReleaseNotesData(null);
    };

    // Render preview content
    const renderPreview = () => {
        if (!previewState.show) return null;

        switch (previewState.mode) {
            case 'products':
                return (
                    <ProductsListPreview
                        products={previewState.data}
                        onBack={closePreview}
                    />
                );
            case 'product':
                return (
                    <ProductDetailPreview
                        product={previewState.data.product}
                        services={previewState.data.services}
                        onBack={closePreview}
                    />
                );
            case 'version':
                return (
                    <VersionPreview
                        version={previewState.data}
                        productId={selectedProduct!}
                        serviceId={selectedService!}
                        onBack={closePreview}
                    />
                );
            default:
                return null;
        }
    };

    // Render main content based on current view
    const renderMainContent = () => {
        if (previewState.show) {
            return renderPreview();
        }

        switch (currentView) {
            case 'product_detail': {
                const product = getCurrentProduct();
                if (!product) return <div className="p-6">Product not found</div>;

                const services = projectData.services[selectedProduct!] || [];

                return (
                    <ProductDetailView
                        product={product}
                        services={services}
                        getServicesCount={getServicesCount}
                        getVersionsCount={getVersionsCount}
                        onGoToProductsList={onNavigate.goToProductsList}
                        onEditProduct={enhancedActions.handleEditProduct}
                        onAddService={enhancedActions.handleAddService}
                        onPreviewProduct={enhancedActions.handlePreviewProduct}
                        onEditService={enhancedActions.handleEditService}
                        onDeleteService={(serviceId) => {
                            if (confirm('Are you sure you want to delete this service?')) {
                                enhancedActions.handleDeleteService(serviceId);
                            }
                        }}
                        onSelectService={(serviceId) => onNavigate.goToServiceDetail(selectedProduct!, serviceId)}
                    />
                );
            }

            case 'service_detail': {
                const service = getCurrentService();
                if (!service) return <div className="p-6">Service not found</div>;

                const versions = projectData.versions[selectedProduct!]?.[selectedService!] || [];

                return (
                    <ServiceDetailView
                        service={service}
                        versions={versions}
                        productId={selectedProduct!}
                        onGoToProduct={() => onNavigate.goToProductDetail(selectedProduct!)}
                        onGoToProductsList={onNavigate.goToProductsList}
                        onEditService={enhancedActions.handleEditService}
                        onAddVersion={enhancedActions.handleAddVersion}
                        onEditVersion={enhancedActions.handleEditVersion}
                        onDeleteVersion={(versionId) => {
                            if (confirm('Are you sure you want to delete this version?')) {
                                enhancedActions.handleDeleteVersion(versionId);
                            }
                        }}
                        onSelectVersion={(versionId) => onNavigate.goToVersionDetail(selectedProduct!, selectedService!, versionId)}
                    />
                );
            }

            case 'version_detail': {
                const version = getCurrentVersion();
                if (!version) return <div className="p-6">Version not found</div>;

                return (
                    <VersionDetailView
                        version={version.version}
                        productId={selectedProduct!}
                        serviceId={selectedService!}
                        onGoToService={() => onNavigate.goToServiceDetail(selectedProduct!, selectedService!)}
                        onGoToProduct={() => onNavigate.goToProductDetail(selectedProduct!)}
                        onGoToProductsList={onNavigate.goToProductsList}
                        onEditVersion={enhancedActions.handleEditVersion}
                        onEditReleaseNotes={() => enhancedActions.handleEditReleaseNotes(version)}
                        onViewApiSpec={enhancedActions.handleViewApiSpec}
                    />
                );
            }

            default:
                return (
                    <ProductsListView
                        products={projectData.products}
                        getServicesCount={getServicesCount}
                        onAddProduct={enhancedActions.handleAddProduct}
                        onEditProduct={enhancedActions.handleEditProduct}
                        onDeleteProduct={(productId) => {
                            if (confirm('Are you sure you want to delete this product? This will also delete all its services and versions.')) {
                                enhancedActions.handleDeleteProduct(productId);
                            }
                        }}
                        onSelectProduct={onNavigate.goToProductDetail}
                        onPreviewProducts={enhancedActions.handlePreviewProducts}
                    />
                );
        }
    };

    return (
        <>
            {/* Main Content */}
            {renderMainContent()}

            {/* Release Notes Editor Modal */}
            <Modal
                isOpen={showReleaseNotesEditor}
                onClose={() => {
                    setShowReleaseNotesEditor(false);
                    setReleaseNotesData(null);
                }}
                title="Release Notes Editor"
                size="xl"
            >
                {releaseNotesData && (
                    <ReleaseNotesEditor
                        initialData={releaseNotesData.initialData}
                        version={releaseNotesData.version}
                        onSave={handleReleaseNotesSave}
                        onCancel={() => {
                            setShowReleaseNotesEditor(false);
                            setReleaseNotesData(null);
                        }}
                    />
                )}
            </Modal>

            {/* API Spec Viewer Modal */}
            <Modal
                isOpen={showApiSpecViewer}
                onClose={() => {
                    setShowApiSpecViewer(false);
                    setApiSpecData(null);
                }}
                title="API Specification Viewer"
                size="full"
            >
                {apiSpecData && (
                    <ApiSpecViewer
                        spec={apiSpecData.spec}
                        type={apiSpecData.type}
                        title={apiSpecData.title}
                        className="h-full"
                    />
                )}
            </Modal>
        </>
    );
};

export default MainContentRouter;