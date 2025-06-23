// src/components/views/ServiceDetailView.tsx
import React from 'react';
import { Edit2, Plus, Eye, ArrowLeft, Package, Code, Wifi } from 'lucide-react';
import Button from '../ui/Button';
import Breadcrumb from '../ui/Breadcrumb';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import VersionCard from '../cards/VersionCard';
import EmptyState from '../ui/EmptyState';

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
                icon: <Wifi className="w-4 h-4 text-purple-600" />,
                label: 'MQTT API',
                bgColor: 'from-purple-50 to-purple-100',
                badgeColor: 'bg-purple-100 text-purple-700',
                iconBgColor: 'bg-purple-200',
                iconTextColor: 'text-purple-600'
            };
        } else {
            return {
                icon: <Code className="w-4 h-4 text-green-600" />,
                label: 'REST API',
                bgColor: 'from-green-50 to-green-100',
                badgeColor: 'bg-green-100 text-green-700',
                iconBgColor: 'bg-green-200',
                iconTextColor: 'text-green-600'
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

            {/* Enhanced Header with Service Icon */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                    {/* Service Icon */}
                    <div className="flex-shrink-0 w-24 h-24 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-gray-200 shadow-sm">
                        {service.icon ? (
                            <img
                                src={service.icon}
                                alt={service.name}
                                className="w-18 h-18 object-contain rounded-lg"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-blue-200 flex items-center justify-center">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                        )}
                    </div>

                    {/* Service Info */}
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {service.display_name || service.name}
                            </h1>
                            {service.status && (
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    service.status === 'active'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                                }`}>
                                    {service.status}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-600 text-lg">{service.short_description}</p>

                        {/* Service Metadata */}
                        <div className="flex items-center space-x-4 mt-3">
                            {service.category && (
                                <span className="text-sm text-gray-500">
                                    <span className="font-medium">Category:</span> {service.category}
                                </span>
                            )}
                            <span className="text-xs text-gray-400">•</span>
                            <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${protocolInfo.badgeColor}`}>
                                {protocolInfo.icon}
                                <span>{service.protocol_type || 'REST'}</span>
                            </div>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-sm text-gray-500">
                                <span className="font-medium">Versions:</span> {versions.length}
                            </span>
                            {service.supported_protocols && service.supported_protocols.length > 0 && (
                                <div className="flex items-center space-x-1">
                                    <span className="text-sm text-gray-500 font-medium">Protocols:</span>
                                    {service.supported_protocols.map(protocol => (
                                        <span key={protocol} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                            {protocol}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    <Button
                        variant="outline"
                        onClick={() => onEditService(service)}
                        leftIcon={<Edit2 className="w-4 h-4" />}
                    >
                        Edit Service
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onAddVersion}
                        leftIcon={<Plus className="w-4 h-4" />}
                    >
                        Add Version
                    </Button>
                </div>
            </div>

            {/* API Versions List */}
            <div>
                {versions.length === 0 ? (
                    <EmptyState
                        title="No versions yet"
                        description="Add your first API version to get started documenting your service endpoints"
                        actionLabel="Add Version"
                        onAction={onAddVersion}
                        icon={<div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-indigo-50 rounded-full">
                            <Package className="w-8 h-8 text-indigo-600" />
                        </div>}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            </div>
        </div>
    );
};

export default ServiceDetailView;