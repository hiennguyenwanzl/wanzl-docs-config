// src/components/cards/ProductCard.tsx
import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        display_name?: string;
        short_description: string;
        category?: string;
        icon?: string | null;
        gallery_images?: string[];
        info_cards?: any[];
    };
    servicesCount: number;
    onClick: () => void;
    onEdit: (product: any) => void;
    onDelete: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
                                                     product,
                                                     servicesCount,
                                                     onClick,
                                                     onEdit,
                                                     onDelete
                                                 }) => {
    return (
        <Card hover animate className="cursor-pointer group" onClick={onClick}>
            <div className="flex h-36">
                {/* Large Icon Section - Full Height */}
                <div className="w-36 h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-l-lg border-r border-gray-200 relative overflow-hidden">
                    {product.icon ? (
                        <img
                            src={product.icon}
                            alt={product.name}
                            className="w-32 h-32 object-contain z-10 rounded-lg transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-16 h-16 bg-blue-200 rounded-lg flex items-center justify-center z-10 transition-transform duration-300 group-hover:scale-105">
                            <span className="text-blue-700 text-xl font-bold">P</span>
                        </div>
                    )}

                    {/* Background Pattern - only show if no icon */}
                    {!product.icon && (
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-2 right-2 w-8 h-8 bg-blue-500 rounded-full"></div>
                            <div className="absolute bottom-4 left-2 w-4 h-4 bg-blue-300 rounded-full"></div>
                            <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors duration-200">
                                {product.display_name || product.name}
                            </h3>
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(product);
                                    }}
                                    className="hover:bg-blue-50 hover:text-blue-600 transform hover:scale-105 transition-all duration-200"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(product.id);
                                    }}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 transform hover:scale-105 transition-all duration-200"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                            {product.short_description}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                    {product.category?.replace('-', ' ') || 'Other'}
                                </span>
                                <span className="text-xs text-gray-500 font-medium">
                                    {servicesCount} service{servicesCount !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>

                        {/* Info Cards indicator */}
                        {product.info_cards && product.info_cards.length > 0 && (
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Info Cards:</span>
                                <div className="flex items-center space-x-1">
                                    <div className="w-4 h-4 bg-green-100 rounded text-green-600 flex items-center justify-center">
                                        <span className="text-xs font-semibold">C</span>
                                    </div>
                                    <span className="text-xs text-gray-600 font-medium">
                                        {product.info_cards.length}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Gallery Preview */}
                        {product.gallery_images && product.gallery_images.length > 0 && (
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Gallery:</span>
                                <div className="flex -space-x-1">
                                    {product.gallery_images.slice(0, 4).map((image, index) => (
                                        <div key={index} className="w-6 h-6 rounded border-2 border-white bg-gray-100 overflow-hidden shadow-sm transition-transform duration-200 hover:scale-110 hover:z-10">
                                            <img src={image} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    {product.gallery_images.length > 4 && (
                                        <div className="w-6 h-6 rounded border-2 border-white bg-gray-200 flex items-center justify-center shadow-sm transition-transform duration-200 hover:scale-110 hover:z-10">
                                            <span className="text-xs text-gray-600 font-medium">
                                                +{product.gallery_images.length - 4}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProductCard;