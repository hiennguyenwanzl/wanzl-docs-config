// src/components/sections/ProductHero.tsx
import React from 'react';
import Card, { CardContent } from '../ui/Card';
import DefaultIcon from '../ui/DefaultIcon';
import type { Product } from '@/types';

interface ProductHeroProps {
    product: Product;
}

const ProductHero: React.FC<ProductHeroProps> = ({ product }) => {
    return (
        <div className="mb-8">
            {/* Enhanced Hero Card with Image on Right */}
            <Card className="overflow-hidden shadow-xl border-0">
                <div className="relative">
                    {/* Main Hero Content */}
                    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-[320px] flex items-center">
                        <div className="flex w-full">
                            {/* Left Content */}
                            <div className="flex-1 p-8 lg:p-12 flex items-center">
                                <div className="w-full">
                                    <div className="flex items-center space-x-6 mb-6">
                                        {/* Large Product Icon */}
                                        <div className="flex-shrink-0">
                                            {product.icon ? (
                                                <div className="w-24 h-24 rounded-2xl bg-white/80 backdrop-blur-sm p-4 shadow-lg border border-white/50">
                                                    <img
                                                        src={product.icon}
                                                        alt={product.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                                    <DefaultIcon className="w-12 h-12 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1">
                                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                                                {product.display_name || product.name}
                                            </h1>

                                            {product.tagline && (
                                                <p className="text-xl text-blue-700 font-medium mb-4">
                                                    {product.tagline}
                                                </p>
                                            )}

                                            <p className="text-lg text-gray-600 mb-6 leading-relaxed max-w-2xl">
                                                {product.short_description}
                                            </p>

                                            {/* Quick Stats */}
                                            <div className="flex items-center space-x-6 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <div className={`w-3 h-3 rounded-full ${
                                                        product.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                                    }`}></div>
                                                    <span className="font-medium text-gray-700">
                                                        {product.status?.charAt(0).toUpperCase() + product.status?.slice(1)}
                                                    </span>
                                                </div>

                                                <div className="h-4 w-px bg-gray-300"></div>

                                                <span className="text-gray-600">
                                                    <span className="font-medium">Category:</span> {
                                                    product.category?.split('-').map(word =>
                                                        word.charAt(0).toUpperCase() + word.slice(1)
                                                    ).join(' ') || 'Not specified'
                                                }
                                                </span>

                                                {product.services_count !== undefined && (
                                                    <>
                                                        <div className="h-4 w-px bg-gray-300"></div>
                                                        <span className="text-gray-600">
                                                            <span className="font-medium">{product.services_count}</span> Services
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Hero Image with Gradient Overlay */}
                            {product.hero_image && (
                                <div className="hidden lg:block relative w-1/3 min-h-[320px]">
                                    {/* Gradient Overlay - stronger on the left */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-50/80 via-30% to-transparent z-10"></div>

                                    {/* Hero Image */}
                                    <img
                                        src={product.hero_image}
                                        alt={product.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />

                                    {/* Additional subtle overlay for better text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-5"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-200/30 to-indigo-300/30 rounded-full blur-xl"></div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-purple-200/30 to-pink-300/30 rounded-full blur-lg"></div>
                </div>
            </Card>

            {/* Key Features Section */}
            {product.key_features && product.key_features.length > 0 && (
                <Card className="mt-6 shadow-lg">
                    <CardContent className="p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Key Features</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {product.key_features.filter(feature => feature.trim()).map((feature, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                    <span className="text-gray-700 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Use Cases Section */}
            {product.use_cases && product.use_cases.length > 0 && (
                <Card className="mt-6 shadow-lg">
                    <CardContent className="p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Use Cases</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {product.use_cases.filter(useCase => useCase.title.trim() || useCase.description.trim()).map((useCase, index) => (
                                <div key={index} className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                                    <h4 className="font-bold text-green-900 text-lg mb-3">{useCase.title}</h4>
                                    <p className="text-green-800 leading-relaxed">{useCase.description}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Gallery Images */}
            {product.gallery_images && product.gallery_images.length > 0 && (
                <Card className="mt-6 shadow-lg">
                    <CardContent className="p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Gallery</span>
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {product.gallery_images.map((image, index) => (
                                <div key={index} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                    <img
                                        src={image}
                                        alt={`${product.name} gallery ${index + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                        <span className="text-white text-sm font-medium p-3">
                                            Image {index + 1}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Overview Section */}
            {product.overview && (
                <Card className="mt-6 shadow-lg">
                    <CardContent className="p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <span>Overview</span>
                        </h3>
                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                            <p>{product.overview}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ProductHero;