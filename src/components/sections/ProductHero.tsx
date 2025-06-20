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
            {/* Hero Image Section - Full Width */}
            {product.hero_image && (
                <div className="w-full mb-6">
                    <img
                        src={product.hero_image}
                        alt={product.name}
                        className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg"
                    />
                </div>
            )}

            {/* Product Info Card */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-6">
                        {/* Large Product Icon */}
                        <div className="flex-shrink-0">
                            {product.icon ? (
                                <img src={product.icon} alt={product.name} className="w-24 h-24 object-contain" />
                            ) : (
                                <DefaultIcon className="w-24 h-24" />
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.display_name || product.name}</h2>
                            <p className="text-lg text-gray-600 mb-4">{product.tagline || product.short_description}</p>

                            {/* Quick Stats */}
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    <span>{product.status || 'Active'}</span>
                                </span>
                                <span>Category: {product.category || 'Not specified'}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Gallery Images */}
            {product.gallery_images && product.gallery_images.length > 0 && (
                <Card className="mt-6">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {product.gallery_images.map((image, index) => (
                                <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={image}
                                        alt={`${product.name} gallery ${index + 1}`}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ProductHero;