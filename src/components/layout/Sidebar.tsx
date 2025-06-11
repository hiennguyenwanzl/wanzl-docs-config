import React from 'react';
import {
    Package,
    ChevronRight,
    ChevronDown,
    Settings,
    Eye,
    Menu,
    X,
    Code,
    Wifi,
    FileText,
    PanelLeftClose,
    PanelLeftOpen,
    Box
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
    onPreviewProject?: () => void;
    onSettings?: () => void;
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
                                             onToggleProduct,
                                             onPreviewProject,
                                             onSettings
                                         }) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleMobile = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    const getVersionIcon = (version: any) => {
        const hasSwagger = version.api_specs?.openapi || version.supported_apis?.includes('swagger');
        const hasMqtt = version.api_specs?.mqtt || version.supported_apis?.includes('mqtt');

        if (hasSwagger && hasMqtt) {
            return (
                <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-sm bg-green-500 flex items-center justify-center">
                        <Code className="w-2 h-2 text-white" />
                    </div>
                    <div className="w-3 h-3 rounded-sm bg-purple-500 flex items-center justify-center">
                        <Wifi className="w-2 h-2 text-white" />
                    </div>
                </div>
            );
        } else if (hasMqtt) {
            return (
                <div className="w-4 h-4 rounded-sm bg-purple-500 flex items-center justify-center">
                    <Wifi className="w-2.5 h-2.5 text-white" />
                </div>
            );
        } else if (hasSwagger) {
            return (
                <div className="w-4 h-4 rounded-sm bg-green-500 flex items-center justify-center">
                    <Code className="w-2.5 h-2.5 text-white" />
                </div>
            );
        } else {
            return (
                <div className="w-4 h-4 rounded-sm bg-gray-400 flex items-center justify-center">
                    <FileText className="w-2.5 h-2.5 text-white" />
                </div>
            );
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'stable': return 'bg-green-500';
            case 'beta': return 'bg-yellow-500';
            case 'deprecated': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const renderVersion = (version: any, productId: string, serviceId: string) => {
        const isSelected = selectedVersion === version.version &&
            selectedService === serviceId &&
            selectedProduct === productId;

        return (
            <div
                key={version.version}
                className={`ml-12 relative ${isSelected ? 'bg-blue-100' : ''}`}
            >
                {/* Connection line to parent service */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 -ml-6"></div>
                <div className="absolute left-0 top-4 w-6 h-px bg-gray-200 -ml-6"></div>

                <button
                    onClick={() => onSelectVersion(productId, serviceId, version.version)}
                    className={`w-full text-left px-3 py-2.5 text-sm transition-all duration-200 group hover:bg-gray-50 flex items-center space-x-3 ${
                        isSelected
                            ? 'text-blue-900 font-medium bg-blue-100'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    {!isCollapsed && (
                        <>
                            {getVersionIcon(version)}
                            <span className="flex-1 font-mono text-xs">v{version.version}</span>
                            <div className="flex items-center space-x-1">
                                <span className={`w-2 h-2 rounded-full ${getStatusColor(version.status)}`} />
                                {version.breaking_changes && (
                                    <span className="text-xs text-orange-600 font-bold">!</span>
                                )}
                            </div>
                        </>
                    )}
                    {isCollapsed && (
                        <div className="flex items-center space-x-1">
                            {getVersionIcon(version)}
                            <span className="text-xs font-mono">v{version.version}</span>
                        </div>
                    )}
                </button>

                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                        v{version.version} ({version.status})
                    </div>
                )}
            </div>
        );
    };

    const renderService = (service: any, productId: string) => {
        const serviceVersions = versions[productId]?.[service.id] || [];
        const isServiceExpanded = expandedProducts.includes(`${productId}-${service.id}`);
        const isServiceSelected = selectedService === service.id && selectedProduct === productId;

        return (
            <div key={service.id} className="relative">
                {/* Connection line to parent product */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200"></div>
                <div className="absolute left-6 top-6 w-6 h-px bg-gray-200"></div>

                <div className={`ml-6 ${isServiceSelected ? 'bg-blue-100' : ''}`}>
                    <button
                        onClick={() => onSelectService(productId, service.id)}
                        className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 flex items-center group hover:bg-gray-50 ${
                            isServiceSelected
                                ? 'text-blue-900 font-medium bg-blue-100'
                                : 'text-gray-700 hover:text-gray-900'
                        }`}
                    >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                                <Box className="w-3 h-3 text-white" />
                            </div>
                            {!isCollapsed && (
                                <>
                                    <span className="truncate font-medium">{service.display_name || service.name}</span>
                                    <div className="flex items-center space-x-2 ml-auto">
                                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-medium">
                                            {serviceVersions.length}
                                        </span>
                                        {serviceVersions.length > 0 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onToggleProduct(`${productId}-${service.id}`);
                                                }}
                                                className="p-1 hover:bg-blue-200 rounded transition-colors duration-200"
                                            >
                                                {isServiceExpanded ? (
                                                    <ChevronDown className="w-3 h-3" />
                                                ) : (
                                                    <ChevronRight className="w-3 h-3" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Tooltip for collapsed mode */}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                                {service.display_name || service.name} ({serviceVersions.length} versions)
                            </div>
                        )}
                    </button>

                    {isServiceExpanded && serviceVersions.length > 0 && !isCollapsed && (
                        <div className="pb-2">
                            {serviceVersions
                                .sort((a, b) => {
                                    // Sort versions with latest first
                                    const aParts = a.version.split('.').map(Number);
                                    const bParts = b.version.split('.').map(Number);

                                    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
                                        const aPart = aParts[i] || 0;
                                        const bPart = bParts[i] || 0;
                                        if (aPart !== bPart) {
                                            return bPart - aPart; // Descending order
                                        }
                                    }
                                    return 0;
                                })
                                .map(version => renderVersion(version, productId, service.id))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderProduct = (product: any) => {
        const productServices = services[product.id] || [];
        const isExpanded = expandedProducts.includes(product.id);
        const servicesCount = productServices.length;
        const isProductSelected = selectedProduct === product.id;

        return (
            <div key={product.id} className="mb-2">
                <div className={`${isProductSelected ? 'bg-blue-100' : ''}`}>
                    <button
                        onClick={() => onSelectProduct(product.id)}
                        className={`w-full text-left px-4 py-4 transition-all duration-200 flex items-center group hover:bg-gray-50 ${
                            isProductSelected
                                ? 'text-blue-900 font-semibold bg-blue-100'
                                : 'text-gray-800 hover:text-gray-900'
                        }`}
                    >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                                <Package className="w-4 h-4 text-white" />
                            </div>
                            {!isCollapsed && (
                                <>
                                    <span className="truncate font-semibold text-base">{product.display_name || product.name}</span>
                                    <div className="flex items-center space-x-2 ml-auto">
                                        <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full font-semibold">
                                            {servicesCount}
                                        </span>
                                        {productServices.length > 0 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onToggleProduct(product.id);
                                                }}
                                                className="p-1 hover:bg-indigo-200 rounded transition-colors duration-200"
                                            >
                                                {isExpanded ? (
                                                    <ChevronDown className="w-4 h-4" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Tooltip for collapsed mode */}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                                {product.display_name || product.name} ({servicesCount} services)
                            </div>
                        )}
                    </button>

                    {isExpanded && productServices.length > 0 && !isCollapsed && (
                        <div className="pb-2">
                            {productServices.map(service => renderService(service, product.id))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Mobile overlay
    const mobileOverlay = isMobileOpen && (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleMobile}
        />
    );

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                onClick={toggleMobile}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md border border-gray-200"
            >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {mobileOverlay}

            <div className={`
                ${isCollapsed ? 'w-12' : 'w-80'} 
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
                bg-white border-r border-gray-200 flex flex-col
                transition-all duration-300 ease-in-out
                shadow-lg lg:shadow-none
            `}>
                {/* Header */}
                <div className="p-3 border-b border-gray-200 flex-shrink-0 bg-gray-50">
                    {isCollapsed ? (
                        // Collapsed header - only toggle button
                        <div className="flex justify-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleCollapse}
                                className="p-2"
                            >
                                <PanelLeftOpen className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        // Expanded header - full content
                        <>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                                        <Package className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-gray-900">Products</h2>
                                        <p className="text-xs text-gray-500">Manage your APIs</p>
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleCollapse}
                                    className="hidden lg:flex"
                                >
                                    <PanelLeftClose className="w-4 h-4" />
                                </Button>
                            </div>
                        </>
                    )}
                </div>

                {/* Products List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-4">
                        {products.length === 0 ? (
                            !isCollapsed && (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                        <Package className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">No products yet</h3>
                                    <p className="text-sm text-gray-500 mb-6 px-4">
                                        Get started by creating your first product
                                    </p>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={onAddProduct}
                                        leftIcon={<Package className="w-4 h-4" />}
                                    >
                                        Create Product
                                    </Button>
                                </div>
                            )
                        ) : (
                            <div className="space-y-1">
                                {products.map(renderProduct)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer with Settings and Preview */}
                <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-gray-50">
                    {isCollapsed ? (
                        // Collapsed footer - icon buttons only
                        <div className="space-y-2 flex flex-col items-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onPreviewProject}
                                className="w-8 h-8 p-0 text-gray-600 hover:text-gray-900 relative group"
                            >
                                <Eye className="w-4 h-4" />
                                {/* Tooltip */}
                                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                                    Preview Project
                                </div>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onSettings}
                                className="w-8 h-8 p-0 text-gray-600 hover:text-gray-900 relative group"
                            >
                                <Settings className="w-4 h-4" />
                                {/* Tooltip */}
                                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                                    Settings
                                </div>
                            </Button>
                        </div>
                    ) : (
                        // Expanded footer - full buttons
                        <div className="space-y-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-gray-600 hover:text-gray-900"
                                leftIcon={<Eye className="w-4 h-4" />}
                                onClick={onPreviewProject}
                            >
                                Preview Project
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-gray-600 hover:text-gray-900"
                                leftIcon={<Settings className="w-4 h-4" />}
                                onClick={onSettings}
                            >
                                Settings
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sidebar;