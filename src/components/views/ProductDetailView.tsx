import React from 'react';
import { Edit2, Plus, Eye } from 'lucide-react';
import Button from '../ui/Button';
import Breadcrumb from '../ui/Breadcrumb';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import ProductHero from '../sections/ProductHero';
import ServiceCard from '../cards/ServiceCard';
import EmptyState from '../ui/EmptyState';
import type { Product, Service } from '@/types';

interface ProductDetailViewProps {
    product: Product;
    services: Service[];
    getServicesCount: (productId: string) => number;
    getVersionsCount: (productId: string, serviceId: string) => number;
    onGoToProductsList: () => void;
    onEditProduct: (product: Product) => void;
    onPreviewProduct: (product: Product) => void;
    onAddService: () => void;
    onEditService: (service: Service) => void;
    onDeleteService: (serviceId: string) => void;
    onSelectService: (serviceId: string) => void;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({
                                                                 product,
                                                                 services,
                                                                 getServicesCount,
                                                                 getVersionsCount,
                                                                 onGoToProductsList,
                                                                 onEditProduct,
                                                                 onPreviewProduct,
                                                                 onAddService,
                                                                 onEditService,
                                                                 onDeleteService,
                                                                 onSelectService
                                                             }) => {
    const breadcrumbItems = [
        {
            key: 'home',
            label: 'Products',
            onClick: onGoToProductsList
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
                    <Button
                        variant="primary"
                        onClick={onAddService}
                        leftIcon={<Plus className="w-4 h-4" />}
                    >
                        Add Service
                    </Button>
                </div>
            </div>

            {/* Services List */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Services</h2>
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
            <br/>
            {/* Product Hero Section - Always show, let ProductHero decide what to render */}
            <ProductHero product={product} />

            {/* Product Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
};

export default ProductDetailView;