// src/components/views/ProductDetailView.tsx - Updated with Info Cards
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
                    <div className="flex items-center justify-between mb-4">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {infoCards
                                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                                .map(infoCard => (
                                    <InfoCard
                                        key={infoCard.id}
                                        infoCard={infoCard}
                                        onClick={() => onSelectInfoCard(infoCard.id)}
                                        onEdit={onEditInfoCard}
                                        onDelete={handleDeleteInfoCard}
                                    />
                                ))
                            }
                        </div>
                    )}

                    {/* Info Cards Tips */}
                    {infoCards.length > 0 && (
                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-medium text-blue-900 mb-2">Product Info Cards Tips</h3>
                            <div className="text-sm text-blue-800 space-y-1">
                                <p>• Use info cards to highlight key features and benefits of this product</p>
                                <p>• Link to detailed documentation, demos, or related resources</p>
                                <p>• Use high-quality images that represent your product well</p>
                                <p>• Keep descriptions concise but informative</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Product Details - Always visible below tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 mb-4">{product.overview || 'No overview available.'}</p>

                        {product.key_features && product.key_features.length > 0 && (
                            <div className="mb-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
                                <ul className="list-disc list-inside space-y-1">
                                    {product.key_features.map((feature, index) => (
                                        <li key={index} className="text-gray-700">{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {product.use_cases && product.use_cases.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Use Cases</h4>
                                <div className="space-y-2">
                                    {product.use_cases.map((useCase, index) => (
                                        <div key={index}>
                                            <h5 className="font-medium text-gray-900">{useCase.title}</h5>
                                            <p className="text-gray-600 text-sm">{useCase.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Product Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div>
                                <span className="text-sm font-medium text-gray-500">Category</span>
                                <p className="text-gray-900">{product.category || 'Not specified'}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500">Status</span>
                                <p className="text-gray-900">{product.status || 'Active'}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500">Services</span>
                                <p className="text-gray-900">{getServicesCount(product.id)}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500">Info Cards</span>
                                <p className="text-gray-900">{infoCards.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProductDetailView;