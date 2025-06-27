// src/components/views/LandingPageView.tsx
import React, { useState } from 'react';
import { Plus, Eye, Package, CreditCard, Sparkles, Layers, Target, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import InfoCard from '../cards/InfoCard';
import ProductCard from '../cards/ProductCard';
import EmptyState from '../ui/EmptyState';
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
    const [activeTab, setActiveTab] = useState<'landing-cards' | 'products'>('landing-cards');

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

    const tabs = [
        {
            id: 'landing-cards',
            label: `Landing Cards (${infoCards.length})`,
            icon: <Sparkles className="w-4 h-4" />,
            description: 'Guide users to important sections of your documentation'
        },
        {
            id: 'products',
            label: `API Products (${products.length})`,
            icon: <Layers className="w-4 h-4" />,
            description: 'Your API products, services, and technical documentation'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 pt-8 max-w-7xl mx-auto">
                {/* Enhanced Hero Header */}
                <div className="text-center mb-12">
                    <div className="relative">
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            Welcome to Your
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block lg:inline lg:ml-3">
                                API Documentation
                            </span>
                        </h1>

                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500/20 rounded-full animate-pulse hidden lg:block"></div>
                        <div className="absolute -bottom-2 -left-6 w-6 h-6 bg-indigo-500/20 rounded-full animate-pulse hidden lg:block"></div>
                    </div>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                        {projectDescription}
                    </p>

                    {/* Enhanced Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                            <div className="text-2xl font-bold text-green-600">{infoCards.length}</div>
                            <div className="text-sm text-gray-600">Landing Cards</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                            <div className="text-2xl font-bold text-blue-600">{products.length}</div>
                            <div className="text-sm text-gray-600">Products</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                            <div className="text-2xl font-bold text-purple-600">
                                {products.reduce((total, product) => total + getServicesCount(product.id), 0)}
                            </div>
                            <div className="text-sm text-gray-600">Services</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                            <div className="text-2xl font-bold text-orange-600">
                                {products.reduce((total, product) => total + (product.info_cards?.length || 0), 0)}
                            </div>
                            <div className="text-sm text-gray-600">Feature Cards</div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as 'landing-cards' | 'products')}
                                    className={`flex-1 flex items-center justify-center space-x-3 py-6 px-8 font-medium text-base transition-all duration-300 relative ${
                                        activeTab === tab.id
                                            ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-500'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                                        activeTab === tab.id
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                                    }`}>
                                        {tab.icon}
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold">{tab.label}</div>
                                        <div className="text-xs text-gray-500">{tab.description}</div>
                                    </div>
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {activeTab === 'landing-cards' && (
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Landing Page Cards</h2>
                                        <p className="text-gray-600">Create engaging entry points that guide users to important sections of your documentation</p>
                                    </div>
                                    <Button
                                        variant="primary"
                                        onClick={onAddInfoCard}
                                        leftIcon={<Plus className="w-5 h-5" />}
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                    >
                                        Add Landing Card
                                    </Button>
                                </div>

                                {infoCards.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100 rounded-full">
                                            <Sparkles className="w-12 h-12 text-green-600" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Create Your First Landing Card</h3>
                                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                            Start building engaging entry points that will guide your users to the most important sections of your documentation.
                                        </p>
                                        <Button
                                            variant="primary"
                                            onClick={onAddInfoCard}
                                            leftIcon={<Plus className="w-5 h-5" />}
                                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                        >
                                            Create Your First Landing Card
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

                                {/* Landing Cards Tips */}
                                {infoCards.length > 0 && (
                                    <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="p-3 bg-green-100 rounded-xl">
                                                <Target className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-green-900 mb-3">Landing Card Best Practices</h3>
                                                <div className="text-sm text-green-800 space-y-2">
                                                    <p>• Use clear, action-oriented headlines that describe the destination</p>
                                                    <p>• Keep descriptions concise but informative (aim for 1-2 sentences)</p>
                                                    <p>• Customize the "More Information" button text to match your content</p>
                                                    <p>• Order cards by importance using the sort order field</p>
                                                    <p>• Use high-quality images that represent your content effectively</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'products' && (
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">API Products & Services</h2>
                                        <p className="text-gray-600">Organize your API documentation in a hierarchical structure with products, services, and versions</p>
                                    </div>
                                    <Button
                                        variant="primary"
                                        onClick={onAddProduct}
                                        leftIcon={<Plus className="w-5 h-5" />}
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                    >
                                        Add Product
                                    </Button>
                                </div>

                                {products.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full">
                                            <Layers className="w-12 h-12 text-blue-600" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Add Your First API Product</h3>
                                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                            Organize your APIs into products that contain multiple services with versioned documentation.
                                        </p>
                                        <Button
                                            variant="primary"
                                            onClick={onAddProduct}
                                            leftIcon={<Plus className="w-5 h-5" />}
                                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                        >
                                            Create Your First Product
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

                                {/* Products Structure Info */}
                                {products.length > 0 && (
                                    <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="p-3 bg-blue-100 rounded-xl">
                                                <Layers className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-blue-900 mb-3">API Documentation Structure</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="text-sm text-blue-800 space-y-2">
                                                        <p>• <strong>Products:</strong> High-level groupings of related APIs</p>
                                                        <p>• <strong>Services:</strong> Individual API endpoints or message channels</p>
                                                        <p>• <strong>Versions:</strong> Different iterations with full API specifications</p>
                                                    </div>
                                                    <div className="text-sm text-blue-800 space-y-2">
                                                        <p>• <strong>REST APIs:</strong> OpenAPI/Swagger specifications supported</p>
                                                        <p>• <strong>MQTT APIs:</strong> AsyncAPI specifications for messaging</p>
                                                        <p>• <strong>Documentation:</strong> Tutorials, examples, and release notes</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions Bar */}
                <div className="flex items-center justify-center space-x-4">
                    <Button
                        variant="outline"
                        onClick={onPreviewProject}
                        leftIcon={<Eye className="w-4 h-4" />}
                        className="border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 transform hover:scale-105"
                    >
                        Preview Documentation Site
                    </Button>

                    {(infoCards.length > 0 || products.length > 0) && (
                        <>
                            <div className="w-px h-8 bg-gray-300"></div>
                            <div className="text-sm text-gray-500 font-medium">
                                {infoCards.length + products.length} total items created
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LandingPageView;