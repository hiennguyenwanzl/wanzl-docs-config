import React from 'react';
import { Plus, Eye } from 'lucide-react';
import Button from '../ui/Button';
import ProductCard from '../cards/ProductCard';
import EmptyState from '../ui/EmptyState';
import type { Product } from '@/types';

interface ProductsListViewProps {
    products: Product[];
    getServicesCount: (productId: string) => number;
    onAddProduct: () => void;
    onEditProduct: (product: Product) => void;
    onDeleteProduct: (productId: string) => void;
    onSelectProduct: (productId: string) => void;
    onPreviewProducts: () => void;
}

const ProductsListView: React.FC<ProductsListViewProps> = ({
                                                               products,
                                                               getServicesCount,
                                                               onAddProduct,
                                                               onEditProduct,
                                                               onDeleteProduct,
                                                               onSelectProduct,
                                                               onPreviewProducts
                                                           }) => {
    const handleDeleteProduct = (productId: string) => {
        if (confirm('Are you sure you want to delete this product? This will also delete all its services and versions.')) {
            onDeleteProduct(productId);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600">Manage your API documentation products</p>
                </div>
                <div className="flex space-x-3">
                    <Button
                        variant="outline"
                        onClick={onPreviewProducts}
                        leftIcon={<Eye className="w-4 h-4" />}
                    >
                        Preview Site
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onAddProduct}
                        leftIcon={<Plus className="w-4 h-4" />}
                    >
                        Add Product
                    </Button>
                </div>
            </div>

            {products.length === 0 ? (
                <EmptyState
                    title="No products yet"
                    description="Create your first product to get started with API documentation"
                    actionLabel="Create Your First Product"
                    onAction={onAddProduct}
                />
            ) : (
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
            )}
        </div>
    );
};

export default ProductsListView;