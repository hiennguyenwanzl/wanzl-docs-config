// src/components/views/ProductDetailView.tsx
import React, { useState } from 'react';
import { Edit2, Plus, Eye, Package, CreditCard } from 'lucide-react';
import Button from '../ui/Button';
import Breadcrumb from '../ui/Breadcrumb';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import ProductHero from '../sections/ProductHero';
import ServiceCard from '../cards/ServiceCard';
import InfoCard from '../cards/InfoCard';
import EmptyState from '../ui/EmptyState';
import type { Product, Service, InfoCard as InfoCardType } from '@/types';

interface ProductDetailViewProps {
    product: Product;
    services: Service[];
    getServicesCount: (productId: string) => number;
    getVersionsCount: (productId: string, serviceId: string) => number;
    onGoToLandingPage: () => void;
    onEditProduct: (product: Product) => void;
    onPreviewProduct: (product: Product) => void;
    onAddService: () => void;
    onEditService: (service: Service) => void;
    onDeleteService: (serviceId: string) => void;
    onSelectService: (serviceId: string) => void;
    // Info Card handlers
    onAddInfoCard: () => void;
    onEditInfoCard: (infoCard: InfoCardType) => void;
    onDeleteInfoCard: (infoCardId: string) => void;
    onSelectInfoCard: (infoCardId: string) => void;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({
                                                                 product,
                                                                 services,
                                                                 getServicesCount,
                                                                 getVersionsCount,
                                                                 onGoToLandingPage,
                                                                 onEditProduct,
                                                                 onPreviewProduct,
                                                                 onAddService,
                                                                 onEditService,
                                                                 onDeleteService,
                                                                 onSelectService,
                                                                 onAddInfoCard,
                                                                 onEditInfoCard,
                                                                 onDeleteInfoCard,
                                                                 onSelectInfoCard
                                                             }) => {
    const [activeTab, setActiveTab] = useState<'services' | 'info-cards'>('services');

    const breadcrumbItems = [
        {
            key: 'home',
            label: 'Landing Page',
            onClick: onGoToLandingPage
        },
        {
            key: 'product',
            label: product.display_name || product.name,
            isActive: true
        }
    ];

    const handleDeleteService = (serviceId: string) => {
        if (confirm('Are you sure you want to delete this service?')) {
            onDeleteService(serviceId);
        }
    };

    const handleDeleteInfoCard = (infoCardId: string) => {
        if (confirm('Are you sure you want to delete this info card?')) {
            onDeleteInfoCard(infoCardId);
        }
    };

    const infoCards = product.info_cards || [];

    const tabs = [
        {
            id: 'services',
            label: `Services (${services.length})`,
            icon: <Package className="w-4 h-4" />
        },
        {
            id: 'info-cards',
            label: `Info Cards (${infoCards.length})`,
            icon: <CreditCard className="w-4 h-4" />
        }
    ];

    return (
        <div className="p-6">
            <Breadcrumb items={breadcrumbItems} />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{product.display_name || product.name}</h1>
                    <p className="text-gray-600">{product.short_description}</p>
                </div>
                <div className="flex space-x-3">
                    <Button
                        variant="outline"
                        onClick={() => onEditProduct(product)}
                        leftIcon={<Edit2 className="w-4 h-4" />}
                    >
                        Edit Product
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onPreviewProduct(product)}
                        leftIcon={<Eye className="w-4 h-4" />}
                    >
                        Preview
                    </Button>
                </div>
            </div>

            {/* Product Hero Section */}
            <ProductHero product={product} />

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as 'services' | 'info-cards')}
                            className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'services' && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Services</h2>
                        <Button
                            variant="primary"
                            onClick={onAddService}
                            leftIcon={<Plus className="w-4 h-4" />}
                        >
                            Add Service
                        </Button>
                    </div>

                    {services.length === 0 ? (
                        <EmptyState
                            title="No services yet"
                            description="Add your first service to get started"
                            actionLabel="Add Service"
                            onAction={onAddService}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {services.map(service => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    versionsCount={getVersionsCount(product.id, service.id)}
                                    onClick={() => onSelectService(service.id)}
                                    onEdit={onEditService}
                                    onDelete={handleDeleteService}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'info-cards' && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Product Info Cards</h2>
                            <p className="text-gray-600 text-sm">Cards that showcase this product's features and benefits</p>
                        </div>
                        <Button
                            variant="primary"
                            onClick={onAddInfoCard}
                            leftIcon={<Plus className="w-4 h-4" />}
                        >
                            Add Info Card
                        </Button>
                    </div>

                    {infoCards.length === 0 ? (
                        <EmptyState
                            title="No info cards yet"
                            description="Add info cards to showcase this product's features and benefits on its detail page"
                            actionLabel="Add Info Card"
                            onAction={onAddInfoCard}
                        />
                    ) : (
                        // ONE INFO CARD PER ROW - FULL WIDTH
                        <div className="space-y-6">
                            {infoCards
                                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                                .map(infoCard => (
                                    <InfoCard
                                        key={infoCard.id}
                                        infoCard={infoCard}
                                        onClick={() => onSelectInfoCard(infoCard.id)}
                                        onEdit={onEditInfoCard}
                                        onDelete={handleDeleteInfoCard}
                                        fullWidth={true}
                                    />
                                ))
                            }
                        </div>
                    )}

                    {/* Product Info Cards Tips */}
                    {infoCards.length > 0 && (
                        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
                            <h3 className="font-medium text-green-900 mb-3">Product Info Cards Tips</h3>
                            <div className="text-sm text-green-800 space-y-2">
                                <p>• <strong>Feature Highlights:</strong> Use info cards to showcase key product features and capabilities</p>
                                <p>• <strong>User Journeys:</strong> Guide users through different aspects of your product with targeted cards</p>
                                <p>• <strong>Call-to-Actions:</strong> Link to specific documentation sections, demos, or getting started guides</p>
                                <p>• <strong>Visual Consistency:</strong> Maintain consistent imagery and messaging that aligns with your product brand</p>
                                <p>• <strong>Prioritization:</strong> Order cards by importance using the sort order field to guide user attention</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductDetailView;