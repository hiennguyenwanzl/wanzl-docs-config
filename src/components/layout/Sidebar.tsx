import React from 'react';
import {
    Package,
    ChevronRight,
    ChevronDown,
    Settings,
    Eye,
    Code,
    Wifi,
    PanelLeftClose,
    PanelLeftOpen,
    Plus
} from 'lucide-react';
import Button from '../ui/Button';
import DefaultServiceIcon from '../ui/DefaultServiceIcon';

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

    // Handle clicking anywhere on sidebar when collapsed to expand
    const handleSidebarClick = (e: React.MouseEvent) => {
        if (isCollapsed) {
            // Only expand if clicking on the sidebar background, not on specific buttons/content
            const target = e.target as HTMLElement;
            const isDirectSidebarClick = target.classList.contains('sidebar-background') ||
                target.closest('.sidebar-background');
            if (isDirectSidebarClick) {
                setIsCollapsed(false);
            }
        }
    };

    const getVersionIcon = (version: any) => {
        const protocolType = version.service_protocol_type;

        if (protocolType === 'MQTT') {
            return (
                <div className="w-3 h-3 rounded-sm bg-purple-500 flex items-center justify-center">
                    <Wifi className="w-2 h-2 text-white" />
                </div>
            );
        } else {
            return (
                <div className="w-3 h-3 rounded-sm bg-green-500 flex items-center justify-center">
                    <Code className="w-2 h-2 text-white" />
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

        if (isCollapsed) {
            return (
                <div key={version.version} className="relative group">
                    <button
                        onClick={() => onSelectVersion(productId, serviceId, version.version)}
                        className={`w-full text-left px-2 py-2 text-sm transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center rounded-md mx-1 relative ${
                            isSelected
                                ? 'bg-blue-100 text-blue-900 border-l-2 border-blue-500'
                                : 'text-gray-600 hover:text-blue-600'
                        }`}
                    >
                        {getVersionIcon(version)}
                    </button>
                    {/* Tooltip positioning */}
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap shadow-lg pointer-events-none top-0">
                        <div className="font-medium">v{version.version}</div>
                        <div className="text-xs text-gray-300">{version.status}</div>
                        {/* Arrow positioning */}
                        <div className="absolute right-full top-1/2 transform translate-x-0 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                    </div>
                </div>
            );
        }

        return (
            <div key={version.version} className="relative">
                <button
                    onClick={() => onSelectVersion(productId, serviceId, version.version)}
                    className={`w-full text-left px-3 py-2 text-sm transition-all duration-200 group hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center space-x-2 rounded-md mx-2 relative ${
                        isSelected
                            ? 'bg-blue-100 text-blue-900 border-l-2 border-blue-500 ml-2'
                            : 'text-gray-600 hover:text-blue-600'
                    }`}
                >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                        {getVersionIcon(version)}
                        <span className="font-mono text-xs truncate">v{version.version}</span>
                        <div className="flex items-center space-x-1 ml-auto">
                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(version.status)}`} />
                            {version.breaking_changes && (
                                <span className="text-xs text-orange-600 font-bold">!</span>
                            )}
                        </div>
                    </div>
                </button>
            </div>
        );
    };

    const renderService = (service: any, productId: string) => {
        const serviceVersions = versions[productId]?.[service.id] || [];
        const isServiceExpanded = expandedProducts.includes(`${productId}-${service.id}`);
        const isServiceSelected = selectedService === service.id && selectedProduct === productId;

        // Get service icon with fallback
        const serviceIcon = service.icon ? (
            <img src={service.icon} alt={service.name} className="w-6 h-6 object-contain rounded" />
        ) : (
            <DefaultServiceIcon className="w-6 h-6 text-blue-600" />
        );

        if (isCollapsed) {
            return (
                <div key={service.id} className="relative group mb-1">
                    <button
                        onClick={() => onSelectService(productId, service.id)}
                        className={`w-full text-left px-2 py-3 text-sm transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center rounded-md mx-1 relative ${
                            isServiceSelected
                                ? 'bg-blue-100 text-blue-900 border-l-2 border-blue-500'
                                : 'text-gray-700 hover:text-blue-600'
                        }`}
                    >
                        <div className="w-6 h-6 flex items-center justify-center">
                            {serviceIcon}
                        </div>
                    </button>
                    {/* Tooltip positioning */}
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap shadow-lg min-w-[200px] pointer-events-none top-0">
                        <div className="font-medium">{service.display_name || service.name}</div>
                        <div className="text-xs text-gray-300">{serviceVersions.length} versions</div>
                        <div className="text-xs text-gray-300 mt-1">{service.protocol_type || 'REST'} API</div>
                        {/* Arrow positioning */}
                        <div className="absolute right-full top-1/2 transform translate-x-0 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                    </div>
                </div>
            );
        }

        return (
            <div key={service.id} className="relative mb-1">
                <div className="mx-2">
                    <button
                        onClick={() => onSelectService(productId, service.id)}
                        className={`w-full text-left px-3 py-3 text-sm transition-all duration-200 flex items-center group hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md relative ${
                            isServiceSelected
                                ? 'bg-blue-100 text-blue-900 border-l-2 border-blue-500'
                                : 'text-gray-700 hover:text-blue-600'
                        }`}
                    >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                {serviceIcon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="truncate font-medium">{service.display_name || service.name}</div>
                                <div className="text-xs text-gray-500 truncate">{service.protocol_type || 'REST'} API</div>
                            </div>
                            <div className="flex items-center space-x-2 ml-auto flex-shrink-0">
                                <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full font-medium">
                                    {serviceVersions.length}
                                </span>
                                {serviceVersions.length > 0 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleProduct(`${productId}-${service.id}`);
                                        }}
                                        className="p-0.5 hover:bg-blue-200 rounded transition-colors duration-200"
                                    >
                                        {isServiceExpanded ? (
                                            <ChevronDown className="w-3 h-3" />
                                        ) : (
                                            <ChevronRight className="w-3 h-3" />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </button>

                    {isServiceExpanded && serviceVersions.length > 0 && (
                        <div className="ml-4 mt-1 space-y-1">
                            {serviceVersions
                                .sort((a, b) => {
                                    const aParts = a.version.split('.').map(Number);
                                    const bParts = b.version.split('.').map(Number);
                                    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
                                        const aPart = aParts[i] || 0;
                                        const bPart = bParts[i] || 0;
                                        if (aPart !== bPart) {
                                            return bPart - aPart;
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

        // Get product icon with fallback
        const productIcon = product.icon ? (
            <img src={product.icon} alt={product.name} className="w-8 h-8 object-contain rounded-lg" />
        ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
            </div>
        );

        if (isCollapsed) {
            return (
                <div key={product.id} className="mb-2 relative group">
                    <button
                        onClick={() => onSelectProduct(product.id)}
                        className={`w-full text-left px-2 py-4 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center rounded-lg mx-1 relative ${
                            isProductSelected
                                ? 'bg-blue-100 text-blue-900 border-l-2 border-blue-500'
                                : 'text-gray-800 hover:text-blue-600'
                        }`}
                    >
                        <div className="w-8 h-8 flex items-center justify-center">
                            {productIcon}
                        </div>
                    </button>
                    {/* Tooltip positioning */}
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap shadow-lg min-w-[200px] pointer-events-none top-0">
                        <div className="font-medium">{product.display_name || product.name}</div>
                        <div className="text-xs text-gray-300">{servicesCount} services</div>
                        <div className="text-xs text-gray-300 mt-1">{product.category || 'Other'}</div>
                        {/* Arrow positioning */}
                        <div className="absolute right-full top-1/2 transform translate-x-0 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                    </div>
                </div>
            );
        }

        return (
            <div key={product.id} className="mb-2">
                <button
                    onClick={() => onSelectProduct(product.id)}
                    className={`w-full text-left px-3 py-4 transition-all duration-200 flex items-center group hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg mx-2 relative ${
                        isProductSelected
                            ? 'bg-blue-100 text-blue-900 border-l-2 border-blue-500 ml-2'
                            : 'text-gray-800 hover:text-blue-600'
                    }`}
                >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                            {productIcon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="truncate font-semibold text-base">{product.display_name || product.name}</div>
                            <div className="text-xs text-gray-500 truncate">{product.category || 'Other'}</div>
                        </div>
                        <div className="flex items-center space-x-2 ml-auto flex-shrink-0">
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
                    </div>
                </button>

                {isExpanded && productServices.length > 0 && (
                    <div className="mt-2 ml-2 space-y-1">
                        {productServices.map(service => renderService(service, product.id))}
                    </div>
                )}
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
                {isMobileOpen ? (
                    <div className="w-5 h-5 relative">
                        <div className="absolute inset-0 w-5 h-0.5 bg-gray-600 rotate-45 top-2"></div>
                        <div className="absolute inset-0 w-5 h-0.5 bg-gray-600 -rotate-45 top-2"></div>
                    </div>
                ) : (
                    <div className="w-5 h-5 relative">
                        <div className="absolute w-5 h-0.5 bg-gray-600 top-1"></div>
                        <div className="absolute w-5 h-0.5 bg-gray-600 top-2"></div>
                        <div className="absolute w-5 h-0.5 bg-gray-600 top-3"></div>
                    </div>
                )}
            </button>

            {mobileOverlay}

            <div
                className={`
                    ${isCollapsed ? 'w-16' : 'w-80'} 
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
                    bg-white border-r border-gray-200 flex flex-col
                    transition-all duration-300 ease-in-out
                    shadow-lg lg:shadow-none
                    sidebar-background
                `}
                onClick={handleSidebarClick}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex-shrink-0 bg-gray-50">
                    <div className="flex items-center justify-between">
                        {!isCollapsed && (
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                                    <Package className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-900">Products</h2>
                                    <p className="text-xs text-gray-500">Manage your APIs</p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleCollapse();
                            }}
                            className={`
                                hidden lg:flex p-1 hover:bg-gray-100 rounded transition-colors duration-200
                                focus:outline-none text-gray-600 hover:text-gray-900
                                ${isCollapsed ? 'w-8 h-8 items-center justify-center' : ''}
                            `}
                            style={{ border: 'none', boxShadow: 'none' }}
                            onBlur={(e) => e.target.blur()}
                        >
                            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Products List - Removed bottom space when collapsed */}
                <div className={`flex-1 overflow-y-auto custom-scrollbar ${isCollapsed ? 'pb-0' : ''}`}>
                    <div className="p-4">
                        {/* When collapsed, only show empty state when there are no products */}
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAddProduct();
                                        }}
                                        leftIcon={<Plus className="w-4 h-4" />}
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

                {/* Footer spacing when collapsed */}
                <div className={`p-4 border-t border-gray-200 flex-shrink-0 bg-gray-50 ${isCollapsed ? 'py-2' : ''}`}>
                    {isCollapsed ? (
                        // Collapsed: Larger icons with better tooltips - Fixed spacing
                        <div className="space-y-2 flex flex-col items-center w-full">
                            <div className="relative group w-full">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onPreviewProject?.();
                                    }}
                                    className="w-full h-10 p-0 text-gray-600 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center rounded-md transition-colors duration-200 focus:outline-none"
                                    onBlur={(e) => e.target.blur()}
                                >
                                    <Eye className="w-5 h-5" />
                                </button>
                                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap shadow-lg pointer-events-none top-0">
                                    <div className="font-medium">Preview Site</div>
                                    <div className="text-xs text-gray-300">See how your docs look</div>
                                    <div className="absolute right-full top-1/2 transform translate-x-0 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                                </div>
                            </div>
                            <div className="relative group w-full">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSettings?.();
                                    }}
                                    className="w-full h-10 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center rounded-md transition-colors duration-200 focus:outline-none"
                                    onBlur={(e) => e.target.blur()}
                                >
                                    <Settings className="w-5 h-5" />
                                </button>
                                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap shadow-lg pointer-events-none top-0">
                                    <div className="font-medium">Settings</div>
                                    <div className="text-xs text-gray-300">Configure preferences</div>
                                    <div className="absolute right-full top-1/2 transform translate-x-0 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Expanded: Full buttons with improved styling
                        <div className="space-y-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPreviewProject?.();
                                }}
                                className="w-full justify-start text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 rounded-md p-2 flex items-center space-x-3 focus:outline-none"
                                onBlur={(e) => e.target.blur()}
                            >
                                <Eye className="w-4 h-4" />
                                <span className="font-medium">Preview Site</span>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSettings?.();
                                }}
                                className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 rounded-md p-2 flex items-center space-x-3 focus:outline-none"
                                onBlur={(e) => e.target.blur()}
                            >
                                <Settings className="w-4 h-4" />
                                <span className="font-medium">Settings</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sidebar;