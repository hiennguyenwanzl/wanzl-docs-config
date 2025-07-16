// src/components/views/ServiceDetailView.tsx
import React from 'react';
import { Edit2, Plus, Eye, ArrowLeft, Package, Code, Wifi, Layers } from 'lucide-react';
import Button from '../ui/Button';
import Breadcrumb from '../ui/Breadcrumb';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import VersionCard from '../cards/VersionCard';

interface EnhancedServiceDetailViewProps {
    service: {
        id: string;
        name: string;
        display_name?: string;
        short_description: string;
        category?: string;
        status?: string;
        icon?: string | null;
        overview?: string;
        key_features?: string[];
        supported_protocols?: string[];
        integration_guide?: string;
        protocol_type?: 'REST' | 'MQTT';
    };
    versions: any[];
    productId: string;
    productName?: string;
    onGoToProduct: () => void;
    onGoToLandingPage: () => void;
    onEditService: (service: any) => void;
    onAddVersion: () => void;
    onEditVersion: (version: any) => void;
    onDeleteVersion: (versionId: string) => void;
    onSelectVersion: (versionId: string) => void;
}

const ServiceDetailView: React.FC<EnhancedServiceDetailViewProps> = ({
                                                                         service,
                                                                         versions,
                                                                         productId,
                                                                         productName,
                                                                         onGoToProduct,
                                                                         onGoToLandingPage,
                                                                         onEditService,
                                                                         onAddVersion,
                                                                         onEditVersion,
                                                                         onDeleteVersion,
                                                                         onSelectVersion
                                                                     }) => {
    // Get protocol-specific styling and info
    const getProtocolInfo = () => {
        const protocolType = service.protocol_type || 'REST';

        if (protocolType === 'MQTT') {
            return {
                icon: <Wifi className="w-6 h-6 text-purple-600" />,
                label: 'MQTT API',
                bgGradient: 'from-purple-50 via-purple-50 to-indigo-50',
                badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                iconBgColor: 'bg-gradient-to-br from-purple-500 to-indigo-600',
                decorativeColor: 'from-purple-200/30 to-indigo-300/30',
                groupBg: 'bg-purple-600',
                groupHover: 'hover:bg-purple-700'
            };
        } else {
            return {
                icon: <Code className="w-6 h-6 text-green-600" />,
                label: 'REST API',
                bgGradient: 'from-green-50 via-emerald-50 to-teal-50',
                badgeColor: 'bg-green-100 text-green-700 border-green-200',
                iconBgColor: 'bg-gradient-to-br from-green-500 to-emerald-600',
                decorativeColor: 'from-green-200/30 to-emerald-300/30',
                groupBg: 'bg-green-600',
                groupHover: 'hover:bg-green-700'
            };
        }
    };

    const protocolInfo = getProtocolInfo();

    const breadcrumbItems = [
        {
            key: 'home',
            label: 'Landing Page',
            onClick: onGoToLandingPage
        },
        {
            key: 'product',
            label: productName || productId,
            onClick: onGoToProduct
        },
        {
            key: 'service',
            label: service.display_name || service.name,
            isActive: true
        }
    ];

    const handleDeleteVersion = (versionId: string) => {
        if (confirm('Are you sure you want to delete this version?')) {
            onDeleteVersion(versionId);
        }
    };

    return (
        <div className="p-6 main-content" style={{ overflowY: 'auto', height: '100%' }}>
            <Breadcrumb items={breadcrumbItems} />

            {/* Enhanced Hero Card */}
            <Card className="mb-8 overflow-hidden shadow-xl border-0">
                <div className="relative">
                    <div className={`bg-gradient-to-br ${protocolInfo.bgGradient} min-h-[240px] flex items-center`}>
                        <div className="flex w-full p-8 lg:p-12">
                            {/* Service Content */}
                            <div className="flex items-center space-x-8 w-full">
                                {/* Large Service Icon */}
                                <div className="flex-shrink-0">
                                    {service.icon ? (
                                        <div className="w-32 h-32 rounded-3xl bg-white/80 backdrop-blur-sm p-6 shadow-xl border border-white/50">
                                            <img
                                                src={service.icon}
                                                alt={service.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className={`w-32 h-32 rounded-3xl ${protocolInfo.iconBgColor} flex items-center justify-center shadow-xl`}>
                                            {protocolInfo.icon}
                                        </div>
                                    )}
                                </div>

                                {/* Service Info */}
                                <div className="flex-1">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                            {service.display_name || service.name}
                                        </h1>

                                        {service.status && (
                                            <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${
                                                service.status === 'active'
                                                    ? 'bg-green-100 text-green-700 border-green-200'
                                                    : 'bg-gray-100 text-gray-700 border-gray-200'
                                            }`}>
                                                {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-xl text-gray-600 mb-6 leading-relaxed max-w-3xl">
                                        {service.short_description}
                                    </p>

                                    {/* Enhanced Service Metadata */}
                                    <div className="flex items-center space-x-6">
                                        <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border-2 font-semibold ${protocolInfo.badgeColor}`}>
                                            {protocolInfo.icon}
                                            <span>{service.protocol_type || 'REST'} API</span>
                                        </div>

                                        {service.category && (
                                            <>
                                                <div className="h-6 w-px bg-gray-300"></div>
                                                <span className="text-gray-600 font-medium">
                                                    <span className="text-gray-500">Category:</span> {service.category}
                                                </span>
                                            </>
                                        )}

                                        <div className="h-6 w-px bg-gray-300"></div>
                                        <span className="text-gray-600 font-medium">
                                            <span className="text-gray-500">Versions:</span> {versions.length}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex-shrink-0 flex flex-col space-y-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => onEditService(service)}
                                        leftIcon={<Edit2 className="w-4 h-4" />}
                                        className="bg-white/80 backdrop-blur-sm border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                                    >
                                        Edit Service
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={onAddVersion}
                                        leftIcon={<Plus className="w-4 h-4" />}
                                        className={`${protocolInfo.groupBg} ${protocolInfo.groupHover} shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-white`}
                                    >
                                        Add Version
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className={`absolute top-6 right-6 w-20 h-20 bg-gradient-to-br ${protocolInfo.decorativeColor} rounded-full blur-xl`}></div>
                        <div className={`absolute bottom-6 left-6 w-16 h-16 bg-gradient-to-br ${protocolInfo.decorativeColor} rounded-full blur-lg`}></div>
                    </div>
                </div>
            </Card>

            {/* API Versions Group - Sidebar Style Design */}
            <div className="bg-slate-700 rounded-2xl overflow-hidden shadow-lg">
                <div className="p-6">
                    <div className="flex items-center justify-between text-white mb-6">
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 ${protocolInfo.groupBg} rounded-xl`}>
                                <Layers className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">API Versions</h2>
                                <p className="text-slate-300">
                                    Manage different versions of your {service.protocol_type || 'REST'} API with complete specifications and documentation
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="primary"
                            onClick={onAddVersion}
                            leftIcon={<Plus className="w-5 h-5" />}
                            className={`${protocolInfo.groupBg} ${protocolInfo.groupHover} shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-white`}
                        >
                            Add Version
                        </Button>
                    </div>

                    {versions.length === 0 ? (
                        <div className="text-center py-16 bg-slate-600 rounded-xl">
                            <div className={`w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-slate-500`}>
                                {service.protocol_type === 'MQTT' ? (
                                    <Wifi className="w-12 h-12 text-purple-400" />
                                ) : (
                                    <Code className="w-12 h-12 text-green-400" />
                                )}
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">No API versions yet</h3>
                            <p className="text-slate-300 mb-8 max-w-md mx-auto">
                                Add your first {service.protocol_type || 'REST'} API version to get started documenting your service endpoints and specifications.
                            </p>
                            <Button
                                variant="primary"
                                onClick={onAddVersion}
                                leftIcon={<Plus className="w-5 h-5" />}
                                className={`${protocolInfo.groupBg} ${protocolInfo.groupHover} shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-white`}
                            >
                                Add Your First Version
                            </Button>
                        </div>
                    ) : (
                        // TWO VERSIONS PER ROW
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {versions
                                .sort((a, b) => {
                                    // Sort by version number (newest first)
                                    const aVersion = a.version.split('.').map(Number);
                                    const bVersion = b.version.split('.').map(Number);

                                    for (let i = 0; i < Math.max(aVersion.length, bVersion.length); i++) {
                                        const aPart = aVersion[i] || 0;
                                        const bPart = bVersion[i] || 0;
                                        if (aPart !== bPart) {
                                            return bPart - aPart; // Descending order
                                        }
                                    }
                                    return 0;
                                })
                                .map(version => (
                                    <VersionCard
                                        key={version.version}
                                        version={version}
                                        onClick={() => onSelectVersion(version.version)}
                                        onEdit={onEditVersion}
                                        onDelete={handleDeleteVersion}
                                    />
                                ))}
                        </div>
                    )}

                    {/* Version Management Tips */}
                    {versions.length > 0 && (
                        <div className="mt-8 bg-slate-600 rounded-xl p-6">
                            <div className="flex items-start space-x-4">
                                <div className={`p-3 ${protocolInfo.groupBg} rounded-xl`}>
                                    <Layers className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-3">
                                        {service.protocol_type || 'REST'} API Version Management
                                    </h3>
                                    <div className="text-sm text-slate-300 space-y-2">
                                        <p>• Use semantic versioning (major.minor.patch) for clear version identification</p>
                                        <p>• {service.protocol_type === 'MQTT' ? 'Upload AsyncAPI specifications' : 'Upload OpenAPI/Swagger specifications'} for each version</p>
                                        <p>• Mark breaking changes to help developers understand migration requirements</p>
                                        <p>• Include release notes and migration guides for smooth transitions</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Service Details Section */}
            {(service.overview || service.key_features?.length || service.integration_guide) && (
                <div className="mt-8 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Service Details</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Service Description */}
                        {service.overview && (
                            <Card className="shadow-lg">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span>Overview</span>
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">{service.overview}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Integration Guide */}
                        {service.integration_guide && (
                            <Card className="shadow-lg">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                        <span>Integration Guide</span>
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">{service.integration_guide}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Key Features */}
                    {service.key_features && service.key_features.length > 0 && (
                        <Card className="shadow-lg">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                        service.protocol_type === 'MQTT' ? 'bg-purple-500' : 'bg-green-500'
                                    }`}></div>
                                    <span>Key Features</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {service.key_features.filter(feature => feature.trim()).map((feature, index) => (
                                        <div key={index} className={`flex items-center space-x-3 p-4 rounded-xl border hover:shadow-md transition-all duration-200 ${
                                            service.protocol_type === 'MQTT'
                                                ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-100'
                                                : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100'
                                        }`}>
                                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                                service.protocol_type === 'MQTT' ? 'bg-purple-500' : 'bg-green-500'
                                            }`}></div>
                                            <span className="text-gray-700 font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

export default ServiceDetailView;