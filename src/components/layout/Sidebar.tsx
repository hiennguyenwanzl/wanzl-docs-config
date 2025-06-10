import React from 'react';
import {
    Package,
    Plus,
    ChevronRight,
    ChevronDown,
    Settings,
    Globe,
    Eye
} from 'lucide-react';
import Button from '../ui/Button';

interface SidebarProps {
    products: any[];
    services: Record<string, any[]>;
    versions: Record<string, Record<string, any[]>>;
    selectedProduct: string | null;
    selectedService: string | null;
    selectedVersion: string | null;
    onSelectProduct: (productId: string) => void;
    onSelectService: (productId: string, serviceId: string) => void;
    onSelectVersion: (productId: string, serviceId: string, versionId: string) => void;
    onAddProduct: () => void;
    expandedProducts: string[];
    onToggleProduct: (productId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
                                             products,
                                             services,
                                             versions,
                                             selectedProduct,
                                             selectedService,
                                             selectedVersion,
                                             onSelectProduct,
                                             onSelectService,
                                             onSelectVersion,
                                             onAddProduct,
                                             expandedProducts,
                                             onToggleProduct
                                         }) => {
    const renderVersion = (version: any, productId: string, serviceId: string) => (
        <button
            key={version.version}
            onClick={() => onSelectVersion(productId, serviceId, version.version)}
            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ml-8 ${
                selectedVersion === version.version
                    ? 'bg-blue-100 text-blue-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
            <div className="flex items-center justify-between">
                <span>v{version.version}</span>
                <div className="flex items-center space-x-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                        version.status === 'stable' ? 'bg-green-500' :
                            version.status === 'beta' ? 'bg-yellow-500' :
                                version.status === 'deprecated' ? 'bg-red-500' : 'bg-gray-500'
                    }`} />
                    {selectedVersion === version.version && (
                        <Eye className="w-3 h-3 text-blue-600" />
                    )}
                </div>
            </div>
        </button>
    );

    const renderService = (service: any, productId: string) => {
        const serviceVersions = versions[productId]?.[service.id] || [];
        const isExpanded = expandedProducts.includes(`${productId}-${service.id}`);

        return (
            <div key={service.id} className="ml-4">
                <button
                    onClick={() => onSelectService(productId, service.id)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between ${
                        selectedService === service.id
                            ? 'bg-gray-100 text-gray-900 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <span>{service.display_name || service.name}</span>
                    <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">
                            {serviceVersions.length} version{serviceVersions.length !== 1 ? 's' : ''}
                        </span>
                        {serviceVersions.length > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleProduct(`${productId}-${service.id}`);
                                }}
                                className="p-0.5 hover:bg-gray-200 rounded"
                            >
                                {isExpanded ? (
                                    <ChevronDown className="w-3 h-3" />
                                ) : (
                                    <ChevronRight className="w-3 h-3" />
                                )}
                            </button>
                        )}
                    </div>
                </button>

                {isExpanded && serviceVersions.length > 0 && (
                    <div className="mt-1 space-y-1">
                        {serviceVersions.map(version => renderVersion(version, productId, service.id))}
                    </div>
                )}
            </div>
        );
    };

    const renderProduct = (product: any) => {
        const productServices = services[product.id] || [];
        const isExpanded = expandedProducts.includes(product.id);
        const servicesCount = productServices.length;

        return (
            <div key={product.id} className="space-y-1">
                <button
                    onClick={() => onSelectProduct(product.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center justify-between ${
                        selectedProduct === product.id
                            ? 'bg-blue-50 text-blue-900 font-medium border-l-4 border-blue-500'
                            : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4" />
                        <span>{product.display_name || product.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">
                            {servicesCount} service{servicesCount !== 1 ? 's' : ''}
                        </span>
                        {productServices.length > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleProduct(product.id);
                                }}
                                className="p-0.5 hover:bg-gray-200 rounded"
                            >
                                {isExpanded ? (
                                    <ChevronDown className="w-3 h-3" />
                                ) : (
                                    <ChevronRight className="w-3 h-3" />
                                )}
                            </button>
                        )}
                    </div>
                </button>

                {isExpanded && productServices.length > 0 && (
                    <div className="mt-1 space-y-1">
                        {productServices.map(service => renderService(service, product.id))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Products</h2>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onAddProduct}
                        leftIcon={<Plus className="w-4 h-4" />}
                    >
                        Add Product
                    </Button>
                </div>
            </div>

            {/* Products List */}
            <div className="flex-1 overflow-y-auto p-4">
                {products.length === 0 ? (
                    <div className="text-center py-8">
                        <Package className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                        <h3 className="text-sm font-medium text-gray-900 mb-1">No products yet</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Get started by creating your first product
                        </p>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={onAddProduct}
                            leftIcon={<Plus className="w-4 h-4" />}
                        >
                            Create Product
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {products.map(renderProduct)}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <div className="space-y-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        leftIcon={<Globe className="w-4 h-4" />}
                    >
                        Preview Site
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        leftIcon={<Settings className="w-4 h-4" />}
                    >
                        Settings
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;