// src/components/layout/Sidebar.tsx
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
import type { ProjectData } from '@/types';

interface SidebarProps {
    // Single project structure - simplified
    projectData: ProjectData;
    selectedProduct: string | null;
    selectedService: string | null;
    selectedVersion: string | null;
    selectedInfoCard: string | null;
    onSelectProduct: (productId: string) => void;
    onSelectService: (productId: string, serviceId: string) => void;
    onSelectVersion: (productId: string, serviceId: string, versionId: string) => void;
    onSelectInfoCard: (infoCardId: string) => void;
    onAddProduct: () => void;
    onAddInfoCard: () => void;
    expandedProducts: string[];
    onToggleProduct: (productId: string) => void;
    onPreviewProject?: () => void;
    onSettings?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
                                             projectData,
                                             selectedProduct,
                                             selectedService,
                                             selectedVersion,
                                             selectedInfoCard,
                                             onSelectProduct,
                                             onSelectService,
                                             onSelectVersion,
                                             onSelectInfoCard,
                                             onAddProduct,
                                             onAddInfoCard,
                                             expandedProducts,
                                             onToggleProduct,
                                             onPreviewProject,
                                             onSettings
                                         }) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);

    // Destructure project data with safe defaults
    const {
        info_cards = [],
        products = [],
        services = {},
        versions = {}
    } = projectData || {};

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleMobile = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    const handleSidebarClick = (e: React.MouseEvent) => {
        if (isCollapsed) {
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
                <div className="w-5 h-5 rounded-sm bg-purple-500 flex items-center justify-center">
                    <Wifi className="w-3 h-3 text-white" />
                </div>
            );
        } else {
            return (
                <div className="w-5 h-5 rounded-sm bg-green-500 flex items-center justify-center">
                    <Code className="w-3 h-3 text-white" />
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
                        className={`w-full text-left px-2 py-2 text-sm transition-all duration-200 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center justify-center rounded-md mx-1 relative ${
                            isSelected
                                ? 'bg-green-100 text-green-900 border-l-2 border-green-500'
                                : 'text-gray-600 hover:text-green-600'
                        }`}
                    >
                        {getVersionIcon(version)}
                    </button>
                    {/* Tooltip */}
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap shadow-lg pointer-events-none top-0">
                        <div className="font-medium">v{version.version}</div>
                        <div className="text-xs text-gray-300">{version.status}</div>
                        <div className="absolute right-full top-1/2 transform translate-x-0 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                    </div>
                </div>
            );
        }

        return (
            <div key={version.version} className="relative">
                <button
                    onClick={() => onSelectVersion(productId, serviceId, version.version)}
                    className={`w-full text-left px-3 py-2 text-sm transition-all duration-200 group hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center space-x-2 rounded-md mx-2 relative ${
                        isSelected
                            ? 'bg-green-100 text-green-900 border-l-2 border-green-500 ml-2'
                            : 'text-gray-600 hover:text-green-600'
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

        const serviceIcon = (
            <div className="w-7 h-7 bg-orange-200 rounded flex items-center justify-center">
                <span className="text-orange-700 text-xs font-bold">S</span>
            </div>
        );

        if (isCollapsed) {
            return (
                <div key={service.id} className="relative group mb-1">
                    <button
                        onClick={() => onSelectService(productId, service.id)}
                        className={`w-full text-left px-2 py-3 text-sm transition-all duration-200 hover:bg-orange-50 dark:hover:bg-orange-900/20 flex items-center justify-center rounded-md mx-1 relative ${
                            isServiceSelected
                                ? 'bg-orange-100 text-orange-900 border-l-2 border-orange-500'
                                : 'text-gray-700 hover:text-orange-600'
                        }`}
                    >
                        <div className="w-6 h-6 flex items-center justify-center">
                            {serviceIcon}
                        </div>
                    </button>
                    {/* Tooltip */}
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap shadow-lg min-w-[200px] pointer-events-none top-0">
                        <div className="font-medium">{service.display_name || service.name}</div>
                        <div className="text-xs text-gray-300">{serviceVersions.length} versions</div>
                        <div className="text-xs text-gray-300 mt-1">{service.protocol_type || 'REST'} API</div>
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
                        className={`w-full text-left px-3 py-3 text-sm transition-all duration-200 flex items-center group hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-md relative ${
                            isServiceSelected
                                ? 'bg-orange-100 text-orange-900 border-l-2 border-orange-500'
                                : 'text-gray-700 hover:text-orange-600'
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
                                <span className="text-xs text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full font-medium">
                                    {serviceVersions.length}
                                </span>
                                {serviceVersions.length > 0 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleProduct(`${productId}-${service.id}`);
                                        }}
                                        className="p-0.5 hover:bg-orange-200 rounded transition-colors duration-200"
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

                    {/* Versions */}
                    {!isCollapsed && isServiceExpanded && serviceVersions.length > 0 && (
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

    const renderInfoCard = (infoCard: any) => {
        const isInfoCardSelected = selectedInfoCard === infoCard.id;

        if (isCollapsed) {
            return (
                <div key={infoCard.id} className="relative group mb-1">
                    <button
                        onClick={() => onSelectInfoCard(infoCard.id)}
                        className={`w-full text-left px-2 py-2 text-sm transition-all duration-200 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center justify-center rounded-md mx-1 relative ${
                            isInfoCardSelected
                                ? 'bg-green-100 text-green-900 border-l-2 border-green-500'
                                : 'text-gray-700 hover:text-green-600'
                        }`}
                    >
                        <div className="w-4 h-4 bg-green-200 rounded flex items-center justify-center">
                            <span className="text-green-700 text-xs font-bold">C</span>
                        </div>
                    </button>
                    {/* Tooltip */}
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap shadow-lg min-w-[200px] pointer-events-none top-0">
                        <div className="font-medium">{infoCard.headline_title}</div>
                        <div className="text-xs text-gray-300">{infoCard.display_type}</div>
                        <div className="absolute right-full top-1/2 transform translate-x-0 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                    </div>
                </div>
            );
        }

        return (
            <div key={infoCard.id} className="relative mb-1">
                <div className="mx-2">
                    <button
                        onClick={() => onSelectInfoCard(infoCard.id)}
                        className={`w-full text-left px-3 py-2 text-sm transition-all duration-200 flex items-center group hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md relative ${
                            isInfoCardSelected
                                ? 'bg-green-100 text-green-900 border-l-2 border-green-500'
                                : 'text-gray-700 hover:text-green-600'
                        }`}
                    >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="flex-shrink-0 w-4 h-4 bg-green-200 rounded flex items-center justify-center">
                                <span className="text-green-700 text-xs font-bold">C</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="truncate font-medium text-sm">{infoCard.headline_title}</div>
                                <div className="text-xs text-gray-500 truncate">{infoCard.display_type}</div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        );
    };

    const renderProduct = (product: any) => {
        const productServices = services[product.id] || [];
        const isExpanded = expandedProducts.includes(product.id);
        const servicesCount = productServices.length;
        const isProductSelected = selectedProduct === product.id;

        const productIcon = (
            <div className="w-8 h-8 rounded-lg bg-blue-200 flex items-center justify-center">
                <span className="text-blue-700 text-lg font-bold">P</span>
            </div>
        );

        if (isCollapsed) {
            return (
                <div key={product.id} className="mb-1 relative group">
                    <button
                        onClick={() => onSelectProduct(product.id)}
                        className={`w-full text-left px-2 py-3 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center rounded-md mx-1 relative ${
                            isProductSelected
                                ? 'bg-blue-100 text-blue-900 border-l-2 border-blue-500'
                                : 'text-gray-800 hover:text-blue-600'
                        }`}
                    >
                        <div className="w-8 h-8 flex items-center justify-center">
                            {productIcon}
                        </div>
                    </button>
                    {/* Tooltip */}
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap shadow-lg min-w-[200px] pointer-events-none top-0">
                        <div className="font-medium">{product.display_name || product.name}</div>
                        <div className="text-xs text-gray-300">{servicesCount} services</div>
                        <div className="text-xs text-gray-300 mt-1">{product.category || 'Other'}</div>
                        <div className="absolute right-full top-1/2 transform translate-x-0 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                    </div>
                </div>
            );
        }

        return (
            <div key={product.id} className="mb-1">
                <button
                    onClick={() => onSelectProduct(product.id)}
                    className={`w-full text-left px-3 py-3 transition-all duration-200 flex items-center group hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md mx-2 relative ${
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
                            <div className="truncate font-semibold">{product.display_name || product.name}</div>
                            <div className="text-xs text-gray-500 truncate">{product.category || 'Other'}</div>
                        </div>
                        <div className="flex items-center space-x-2 ml-auto flex-shrink-0">
                            <span className="text-xs text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-full font-medium">
                                {servicesCount}
                            </span>
                            {productServices.length > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleProduct(product.id);
                                    }}
                                    className="p-0.5 hover:bg-indigo-200 rounded transition-colors duration-200"
                                >
                                    {isExpanded ? (
                                        <ChevronDown className="w-3 h-3" />
                                    ) : (
                                        <ChevronRight className="w-3 h-3" />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </button>

                {/* Services */}
                {!isCollapsed && isExpanded && productServices.length > 0 && (
                    <div className="mt-1 ml-2 space-y-1">
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

    const hasContent = info_cards.length > 0 || products.length > 0;

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
                                <div>
                                    <h2 className="font-bold text-gray-900">Docs Content</h2>
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

                {/* Content List */}
                <div className={`flex-1 overflow-y-auto custom-scrollbar ${isCollapsed ? 'pb-0' : ''}`}>
                    {!isCollapsed && (
                        <div className="p-4">
                            {!hasContent ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                        <Package className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Start Creating</h3>
                                    <p className="text-sm text-gray-500 mb-6 px-4">
                                        Build your documentation by adding landing page cards and API products
                                    </p>
                                    <div className="space-y-2">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAddInfoCard();
                                            }}
                                            leftIcon={<Plus className="w-4 h-4" />}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            Add Landing Card
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAddProduct();
                                            }}
                                            leftIcon={<Plus className="w-4 h-4" />}
                                            className="w-full"
                                        >
                                            Add Your First Product
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Add Info Card Button when no cards exist */}
                                    {products.length > 0 && info_cards.length === 0 && (
                                        <div className="mb-6 pb-4 border-b border-gray-200">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onAddInfoCard();
                                                }}
                                                leftIcon={<Plus className="w-4 h-4" />}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                Add Landing Card
                                            </Button>
                                        </div>
                                    )}
                                    {/* Info Cards Section */}
                                    {info_cards.length > 0 && (
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                    Landing Cards ({info_cards.length})
                                                </h3>
                                                <Button
                                                    variant="ghost"
                                                    size="xs"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onAddInfoCard();
                                                    }}
                                                    className="text-green-600 hover:text-green-700"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                            </div>
                                            <div className="space-y-1">
                                                {info_cards.map(infoCard => renderInfoCard(infoCard))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Products Section */}
                                    {products.length > 0 && (
                                        <div className={info_cards.length > 0 ? 'mt-6' : ''}>
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                    Products ({products.length})
                                                </h3>
                                                <Button
                                                    variant="ghost"
                                                    size="xs"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onAddProduct();
                                                    }}
                                                    className="text-blue-600 hover:text-blue-700"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                            </div>
                                            <div className="space-y-1">
                                                {products.map(renderProduct)}
                                            </div>
                                        </div>
                                    )}

                                    {/* Show add buttons when only one section has content */}
                                    {info_cards.length > 0 && products.length === 0 && (
                                        <div className="mt-6 pt-4 border-t border-gray-200">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onAddProduct();
                                                }}
                                                leftIcon={<Plus className="w-4 h-4" />}
                                                className="w-full"
                                            >
                                                Add Your First Product
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={`p-4 border-t border-gray-200 flex-shrink-0 bg-gray-50 ${isCollapsed ? 'py-2' : ''}`}>
                    {isCollapsed ? (
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