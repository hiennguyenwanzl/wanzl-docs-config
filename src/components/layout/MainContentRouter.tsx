// src/components/layout/MainContentRouter.tsx - Updated with Info Cards
import React from 'react';
import ProductDetailView from '../views/ProductDetailView';
import ServiceDetailView from '../views/ServiceDetailView';
import VersionDetailView from '../views/VersionDetailView';
import InfoCardDetailView from '../views/InfoCardDetailView';
import InfoCardsGridView from '../views/InfoCardsGridView';
import LandingPageView from '../views/LandingPageView';
import type { ProjectData, Product, Service, ApiVersion, InfoCard } from '@/types';

interface MainContentRouterProps {
    projectData: ProjectData;
    currentView: string;
    selectedProduct: string | null;
    selectedService: string | null;
    selectedVersion: string | null;
    selectedInfoCard: string | null;
    onNavigate: {
        goToProductDetail: (productId: string) => void;
        goToServiceDetail: (productId: string, serviceId: string) => void;
        goToVersionDetail: (productId: string, serviceId: string, versionId: string) => void;
        goToLandingPage: () => void;
        goToInfoCardDetail: (infoCardId: string) => void;
        goToInfoCardsGrid: () => void;
    };
    onActions: {
        handleAddProduct: () => void;
        handleEditProduct: (product: Product) => void;
        handleDeleteProduct: (productId: string) => void;
        handleAddService: () => void;
        handleEditService: (service: Service) => void;
        handleDeleteService: (serviceId: string) => void;
        handleAddVersion: () => void;
        handleEditVersion: (version: ApiVersion) => void;
        handleDeleteVersion: (versionId: string) => void;
        handlePreviewProducts: () => void;
        handlePreviewProduct: (product: Product) => void;
        handlePreviewVersion: (version: ApiVersion) => void;
        // Info Card actions
        handleAddInfoCard: () => void;
        handleEditInfoCard: (infoCard: InfoCard) => void;
        handleDeleteInfoCard: (infoCardId: string) => void;
        handleAddProductInfoCard: (productId: string) => void;
        handleEditProductInfoCard: (productId: string, infoCard: InfoCard) => void;
        handleDeleteProductInfoCard: (productId: string, infoCardId: string) => void;
    };
    getServicesCount: (productId: string) => number;
    getVersionsCount: (productId: string, serviceId: string) => number;
}

const MainContentRouter: React.FC<MainContentRouterProps> = ({
                                                                 projectData,
                                                                 currentView,
                                                                 selectedProduct,
                                                                 selectedService,
                                                                 selectedVersion,
                                                                 selectedInfoCard,
                                                                 onNavigate,
                                                                 onActions,
                                                                 getServicesCount,
                                                                 getVersionsCount
                                                             }) => {
    const { project, info_cards, products, services, versions } = projectData;

    // Get current entities
    const currentProduct = selectedProduct ? products.find(p => p.id === selectedProduct) : null;
    const currentServices = selectedProduct ? services[selectedProduct] || [] : [];
    const currentService = selectedService ? currentServices.find(s => s.id === selectedService) : null;
    const currentVersions = selectedProduct && selectedService ? versions[selectedProduct]?.[selectedService] || [] : [];
    const currentVersion = selectedVersion ? currentVersions.find(v => v.version === selectedVersion) : null;
    const currentInfoCard = selectedInfoCard ?
        [...info_cards, ...products.flatMap(p => p.info_cards || [])].find(ic => ic.id === selectedInfoCard) : null;

    // Route to appropriate view
    switch (currentView) {
        case 'landing':
        case 'overview':
        case 'products': // Now redirects to landing page since we combined them
        default: // Default to landing page
            return (
                <LandingPageView
                    projectName={project.display_name || project.name}
                    projectDescription={project.description || 'Complete API documentation platform'}
                    infoCards={info_cards}
                    products={products}
                    getServicesCount={getServicesCount}
                    onAddInfoCard={onActions.handleAddInfoCard}
                    onEditInfoCard={onActions.handleEditInfoCard}
                    onDeleteInfoCard={onActions.handleDeleteInfoCard}
                    onSelectInfoCard={onNavigate.goToInfoCardDetail}
                    onAddProduct={onActions.handleAddProduct}
                    onEditProduct={onActions.handleEditProduct}
                    onDeleteProduct={onActions.handleDeleteProduct}
                    onSelectProduct={onNavigate.goToProductDetail}
                    onPreviewProject={onActions.handlePreviewProducts}
                />
            );

        case 'info_cards_grid':
            return (
                <InfoCardsGridView
                    infoCards={info_cards}
                    title="Landing Page Info Cards"
                    description="Manage info cards that appear on your documentation homepage"
                    onAddInfoCard={onActions.handleAddInfoCard}
                    onEditInfoCard={onActions.handleEditInfoCard}
                    onDeleteInfoCard={onActions.handleDeleteInfoCard}
                    onSelectInfoCard={onNavigate.goToInfoCardDetail}
                    onPreview={onActions.handlePreviewProducts}
                    isProductLevel={false}
                />
            );

        case 'product_detail':
            if (!currentProduct) {
                return <div className="p-6">Product not found</div>;
            }
            return (
                <ProductDetailView
                    product={currentProduct}
                    services={currentServices}
                    getServicesCount={getServicesCount}
                    getVersionsCount={getVersionsCount}
                    onGoToLandingPage={onNavigate.goToLandingPage}
                    onEditProduct={onActions.handleEditProduct}
                    onPreviewProduct={onActions.handlePreviewProduct}
                    onAddService={onActions.handleAddService}
                    onEditService={onActions.handleEditService}
                    onDeleteService={onActions.handleDeleteService}
                    onSelectService={(serviceId) => onNavigate.goToServiceDetail(currentProduct.id, serviceId)}
                    onAddInfoCard={() => onActions.handleAddProductInfoCard(currentProduct.id)}
                    onEditInfoCard={(infoCard) => onActions.handleEditProductInfoCard(currentProduct.id, infoCard)}
                    onDeleteInfoCard={(infoCardId) => onActions.handleDeleteProductInfoCard(currentProduct.id, infoCardId)}
                    onSelectInfoCard={onNavigate.goToInfoCardDetail}
                />
            );

        case 'service_detail':
            if (!currentProduct || !currentService) {
                return <div className="p-6">Service not found</div>;
            }
            return (
                <ServiceDetailView
                    service={currentService}
                    versions={currentVersions}
                    productId={currentProduct.id}
                    productName={currentProduct.display_name || currentProduct.name}
                    onGoToProduct={() => onNavigate.goToProductDetail(currentProduct.id)}
                    onGoToLandingPage={onNavigate.goToLandingPage}
                    onEditService={onActions.handleEditService}
                    onAddVersion={onActions.handleAddVersion}
                    onEditVersion={onActions.handleEditVersion}
                    onDeleteVersion={onActions.handleDeleteVersion}
                    onSelectVersion={(versionId) => onNavigate.goToVersionDetail(currentProduct.id, currentService.id, versionId)}
                />
            );

        case 'version_detail':
            if (!currentProduct || !currentService || !currentVersion) {
                return <div className="p-6">Version not found</div>;
            }
            return (
                <VersionDetailView
                    version={currentVersion}
                    productId={currentProduct.id}
                    serviceId={currentService.id}
                    productName={currentProduct.display_name || currentProduct.name}
                    serviceName={currentService.display_name || currentService.name}
                    onGoToService={() => onNavigate.goToServiceDetail(currentProduct.id, currentService.id)}
                    onGoToProduct={() => onNavigate.goToProductDetail(currentProduct.id)}
                    onGoToLandingPage={onNavigate.goToLandingPage}
                    onEditVersion={onActions.handleEditVersion}
                />
            );

        case 'info_card_detail':
            if (!currentInfoCard) {
                return <div className="p-6">Info card not found</div>;
            }

            // Determine if this is a product-level info card
            const isProductInfoCard = products.some(p =>
                p.info_cards?.some(ic => ic.id === currentInfoCard.id)
            );
            const productWithInfoCard = products.find(p =>
                p.info_cards?.some(ic => ic.id === currentInfoCard.id)
            );

            return (
                <InfoCardDetailView
                    infoCard={currentInfoCard}
                    onGoBack={isProductInfoCard && productWithInfoCard
                        ? () => onNavigate.goToProductDetail(productWithInfoCard.id)
                        : onNavigate.goToLandingPage
                    }
                    onEdit={isProductInfoCard && productWithInfoCard
                        ? (infoCard) => onActions.handleEditProductInfoCard(productWithInfoCard.id, infoCard)
                        : onActions.handleEditInfoCard
                    }
                    onDelete={isProductInfoCard && productWithInfoCard
                        ? (infoCardId) => onActions.handleDeleteProductInfoCard(productWithInfoCard.id, infoCardId)
                        : onActions.handleDeleteInfoCard
                    }
                    isProductLevel={isProductInfoCard}
                    productName={productWithInfoCard?.display_name || productWithInfoCard?.name}
                />
            );

    }
};

export default MainContentRouter;