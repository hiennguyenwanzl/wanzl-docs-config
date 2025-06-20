// src/components/views/LandingPageView.tsx
import React from 'react';
import { Plus, Eye, Package, CreditCard } from 'lucide-react';
import Button from '../ui/Button';
import InfoCard from '../cards/InfoCard';
import ProductCard from '../cards/ProductCard';
import EmptyState from '../ui/EmptyState';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import type { InfoCard as InfoCardType, Product } from '@/types';

interface LandingPageViewProps {
    projectName: string;
    projectDescription: string;
    infoCards: InfoCardType[];
    products: Product[];
    getServicesCount: (productId: string) => number;
    onAddInfoCard: () => void;
    onEditInfoCard: (infoCard: InfoCardType) => void;
    onDeleteInfoCard: (infoCardId: string) => void;
    onSelectInfoCard: (infoCardId: string) => void;
    onAddProduct: () => void;
    onEditProduct: (product: Product) => void;
    onDeleteProduct: (productId: string) => void;
    onSelectProduct: (productId: string) => void;
    onPreviewProject: () => void;
}

const LandingPageView: React.FC<LandingPageViewProps> = ({
                                                             projectName,
                                                             projectDescription,
                                                             infoCards,
                                                             products,
                                                             getServicesCount,
                                                             onAddInfoCard,
                                                             onEditInfoCard,
                                                             onDeleteInfoCard,
                                                             onSelectInfoCard,
                                                             onAddProduct,
                                                             onEditProduct,
                                                             onDeleteProduct,
                                                             onSelectProduct,
                                                             onPreviewProject
                                                         }) => {
    const handleDeleteInfoCard = (infoCardId: string) => {
        if (confirm('Are you sure you want to delete this info card?')) {
            onDeleteInfoCard(infoCardId);
        }
    };

    const handleDeleteProduct = (productId: string) => {
        if (confirm('Are you sure you want to delete this product? This will also delete all its services and versions.')) {
            onDeleteProduct(productId);
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Documentation Home</h1>
                    <p className="text-gray-600 mt-2">{projectDescription}</p>
                </div>
                <div className="flex space-x-3">
                    <Button
                        variant="outline"
                        onClick={onPreviewProject}
                        leftIcon={<Eye className="w-4 h-4" />}
                    >
                        Preview Site
                    </Button>
                </div>
            </div>

            {/* Show empty state only if both sections are empty */}
            {infoCards.length === 0 && products.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-gray-100 rounded-full">
                        <Package className="w-12 h-12 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your API Documentation</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Get started by creating landing page content and products. Landing page cards help users navigate your documentation,
                        while products contain your API services and technical documentation.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Button
                            variant="primary"
                            onClick={onAddInfoCard}
                            leftIcon={<CreditCard className="w-4 h-4" />}
                        >
                            Add Landing Card
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onAddProduct}
                            leftIcon={<Package className="w-4 h-4" />}
                        >
                            Add Product
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Landing Page Info Cards Section */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                                    <CreditCard className="w-6 h-6 text-green-600" />
                                    <span>Landing Page Info Cards</span>
                                </h2>

                                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-medium text-green-900 mb-2">Cards that guide users to important sections of your documentation web site</h3>
                                </div>
                            </div>
                            <Button
                                variant="primary"
                                onClick={onAddInfoCard}
                                leftIcon={<Plus className="w-4 h-4" />}
                            >
                                Add Landing Card
                            </Button>
                        </div>

                        {infoCards.length === 0 ? (
                            <Card>
                                <CardContent className="p-8">
                                    <EmptyState
                                        title="No landing page content yet"
                                        description="Create info cards to populate your documentation homepage with engaging content that guides users to important sections"
                                        actionLabel="Add Your First Landing Card"
                                        onAction={onAddInfoCard}
                                        icon={<div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-green-50 rounded-full">
                                            <CreditCard className="w-8 h-8 text-green-600" />
                                        </div>}
                                    />
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            </>
                        )}
                    </div>

                    {/* Products Section */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                                    <Package className="w-6 h-6 text-blue-600" />
                                    <span>API Products</span>
                                </h2>
                                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-medium text-blue-900 mb-2">Your API products, services, and technical documentation</h3>
                                </div>
                            </div>
                            <Button
                                variant="primary"
                                onClick={onAddProduct}
                                leftIcon={<Plus className="w-4 h-4" />}
                            >
                                Add Product
                            </Button>
                        </div>

                        {products.length === 0 ? (
                            <Card>
                                <CardContent className="p-8">
                                    <EmptyState
                                        title="No API products yet"
                                        description="Create your first product to organize your API documentation. Products contain services, versions, and technical documentation."
                                        actionLabel="Create Your First Product"
                                        onAction={onAddProduct}
                                        icon={<div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-50 rounded-full">
                                            <Package className="w-8 h-8 text-blue-600" />
                                        </div>}
                                    />
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map(product => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            servicesCount={getServicesCount(product.id)}
                                            onClick={() => onSelectProduct(product.id)}
                                            onEdit={onEditProduct}
                                            onDelete={handleDeleteProduct}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}

            {/* Project Statistics */}
            {(infoCards.length > 0 || products.length > 0) && (
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">{infoCards.length}</div>
                            <div className="text-sm text-gray-600">Landing Cards</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">{products.length}</div>
                            <div className="text-sm text-gray-600">Products</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {products.reduce((total, product) => total + getServicesCount(product.id), 0)}
                            </div>
                            <div className="text-sm text-gray-600">Total Services</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {products.reduce((total, product) => total + (product.info_cards?.length || 0), 0)}
                            </div>
                            <div className="text-sm text-gray-600">Product Cards</div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default LandingPageView;

//export default ProductsListView;