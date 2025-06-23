// src/components/views/NewLandingPageView.tsx
import React from 'react';
import { Plus, Eye, Package, CreditCard, ArrowRight, Sparkles, Layers, Zap, Target } from 'lucide-react';
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 pt-28 lg:pt-8 max-w-7xl mx-auto">
                {/* Hero Header */}
                <div className="text-center mb-2">

                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                        Welcome to Your
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> API Documentation</span>
                    </h2>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        {projectDescription}
                    </p>
                </div>

                {/* Show comprehensive layout when content exists */}
                {(infoCards.length > 0 || products.length > 0) ? (
                    <>
                        {/* Landing Page Content Section */}
                        <div className="mb-20">
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center space-x-3 mb-6">
                                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                        <CreditCard className="w-7 h-7 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900">Landing Page Content</h2>
                                </div>
                            </div>

                            {/* Enhanced Description Card */}
                            <div className="max-w-5xl mx-auto mb-12">
                                <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border border-green-200 rounded-2xl p-8 shadow-sm relative overflow-hidden">
                                    {/* Background decoration */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-emerald-300/30 rounded-full -translate-y-16 translate-x-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-200/30 to-green-300/30 rounded-full translate-y-12 -translate-x-12"></div>

                                    <div className="relative">
                                        <div className="flex items-start space-x-6">
                                            <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                                <Sparkles className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-green-900 mb-4">Create Engaging Entry Points</h3>
                                                <p className="text-green-800 text-lg leading-relaxed ">
                                                    Design beautiful, interactive info cards that serve as gateways to your documentation.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-green-200">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-green-700">
                                                    <span className="font-semibold">{infoCards.length}</span> landing cards created
                                                </div>
                                                <Button
                                                    variant="primary"
                                                    onClick={onAddInfoCard}
                                                    leftIcon={<Plus className="w-5 h-5" />}
                                                    className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                                >
                                                    Add Landing Card
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Cards Grid */}
                            {infoCards.length === 0 ? (
                                <div className="max-w-4xl mx-auto">
                                    <Card className="border-2 border-dashed border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
                                        <CardContent className="p-16">
                                            <EmptyState
                                                title="Ready to create your first landing card?"
                                                description="Start building engaging entry points that will guide your users to the most important sections of your documentation"
                                                actionLabel="Create Your First Landing Card"
                                                onAction={onAddInfoCard}
                                                icon={
                                                    <div className="w-24 h-24 mx-auto mb-8 flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-lg">
                                                        <CreditCard className="w-12 h-12 text-white" />
                                                    </div>
                                                }
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                        </div>

                        {/* API Products Section */}
                        <div className="mb-20">
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center space-x-3 mb-6">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                        <Package className="w-7 h-7 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900">API Products & Services</h2>
                                </div>
                            </div>

                            {/* Enhanced Description Card */}
                            <div className="max-w-5xl mx-auto mb-12">
                                <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-2xl p-8 shadow-sm relative overflow-hidden">
                                    {/* Background decoration */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-300/30 rounded-full -translate-y-16 translate-x-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/30 to-blue-300/30 rounded-full translate-y-12 -translate-x-12"></div>

                                    <div className="relative">
                                        <div className="flex items-start space-x-6">
                                            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                                <Layers className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-blue-900 mb-4">Comprehensive API Documentation</h3>
                                                <p className="text-blue-800 text-lg leading-relaxed mb-6">
                                                    Organize your products in a hierarchical structure. Each product
                                                    contains multiple services with versioned APIs.
                                                </p>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="flex items-center space-x-3 text-blue-700">
                                                        <Package className="w-5 h-5" />
                                                        <span className="font-medium">Product organization</span>
                                                    </div>
                                                    <div className="flex items-center space-x-3 text-blue-700">
                                                        <Layers className="w-5 h-5" />
                                                        <span className="font-medium">Service management</span>
                                                    </div>
                                                    <div className="flex items-center space-x-3 text-blue-700">
                                                        <Target className="w-5 h-5" />
                                                        <span className="font-medium">Version control</span>
                                                    </div>
                                                    <div className="flex items-center space-x-3 text-blue-700">
                                                        <Sparkles className="w-5 h-5" />
                                                        <span className="font-medium">Interactive specs</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-blue-200">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-blue-700">
                                                    <span className="font-semibold">{products.length}</span> products •
                                                    <span className="font-semibold ml-1">{products.reduce((total, product) => total + getServicesCount(product.id), 0)}</span> services
                                                </div>
                                                <Button
                                                    variant="primary"
                                                    onClick={onAddProduct}
                                                    leftIcon={<Plus className="w-5 h-5" />}
                                                    className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                                >
                                                    Add Product
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Products Grid */}
                            {products.length === 0 ? (
                                <div className="max-w-4xl mx-auto">

                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                            )}
                        </div>

                        {/* Enhanced Statistics Dashboard */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Documentation Overview</h3>
                                <p className="text-gray-600">Track your documentation progress and content metrics</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                            <CreditCard className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-3xl font-bold text-green-600 mb-2">{infoCards.length}</div>
                                        <div className="text-sm font-medium text-green-700">Landing Cards</div>
                                        <div className="text-xs text-green-600 mt-1">Entry points</div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                            <Package className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-3xl font-bold text-blue-600 mb-2">{products.length}</div>
                                        <div className="text-sm font-medium text-blue-700">Products</div>
                                        <div className="text-xs text-blue-600 mt-1">API collections</div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                            <Layers className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-3xl font-bold text-purple-600 mb-2">
                                            {products.reduce((total, product) => total + getServicesCount(product.id), 0)}
                                        </div>
                                        <div className="text-sm font-medium text-purple-700">Services</div>
                                        <div className="text-xs text-purple-600 mt-1">API endpoints</div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-3xl font-bold text-orange-600 mb-2">
                                            {products.reduce((total, product) => total + (product.info_cards?.length || 0), 0)}
                                        </div>
                                        <div className="text-sm font-medium text-orange-700">Feature Cards</div>
                                        <div className="text-xs text-orange-600 mt-1">Product highlights</div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Enhanced Empty State */
                    <div className="text-center py-10">
                        <div className="max-w-4xl mx-auto">
                            <div className="w-40 h-40 mx-auto mb-8 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full border-4 border-white shadow-lg">
                                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                    <Package className="w-16 h-16 text-white" />
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Start Building Your Documentation</h2>
                            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                                Create a comprehensive documentation platform that guides users through your APIs with
                                engaging landing cards and well-organized technical resources.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-12">
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-left">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                                        <CreditCard className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-green-900 mb-2">Landing Cards</h3>
                                    <p className="text-green-800 text-sm">Create engaging entry points that guide users to important sections</p>
                                </div>

                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 text-left">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                                        <Package className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-blue-900 mb-2">API Products</h3>
                                    <p className="text-blue-800 text-sm">Organize services and technical documentation systematically</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                                <Button
                                    variant="primary"
                                    onClick={onAddInfoCard}
                                    leftIcon={<CreditCard className="w-5 h-5" />}
                                    className="px-8 py-4 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                >
                                    Create Landing Card
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={onAddProduct}
                                    leftIcon={<Package className="w-5 h-5" />}
                                    className="px-8 py-4 text-lg border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                >
                                    Add API Product
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LandingPageView;