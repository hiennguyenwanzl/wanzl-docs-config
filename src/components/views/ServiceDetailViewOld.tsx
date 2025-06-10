import React from 'react';
import { Edit2, Plus, Eye, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';
import Breadcrumb from '../ui/Breadcrumb';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import VersionCard from '../cards/VersionCard';
import EmptyState from '../ui/EmptyState';

interface ServiceDetailViewProps {
    service: {
        id: string;
        name: string;
        display_name?: string;
        short_description: string;
        category?: string;
        status?: string;
        overview?: string;
        key_features?: string[];
        supported_protocols?: string[];
        integration_guide?: string;
    };
    versions: any[];
    productId: string;
    onGoToProduct: () => void;
    onGoToProductsList: () => void;
    onEditService: (service: any) => void;
    onAddVersion: () => void;
    onEditVersion: (version: any) => void;
    onDeleteVersion: (versionId: string) => void;
    onSelectVersion: (versionId: string) => void;
}

const ServiceDetailViewOld: React.FC<ServiceDetailViewProps> = ({
                                                                 service,
                                                                 versions,
                                                                 productId,
                                                                 onGoToProduct,
                                                                 onGoToProductsList,
                                                                 onEditService,
                                                                 onAddVersion,
                                                                 onEditVersion,
                                                                 onDeleteVersion,
                                                                 onSelectVersion
                                                             }) => {
    const breadcrumbItems = [
        {
            key: 'home',
            label: 'Products',
            onClick: onGoToProductsList
        },
        {
            key: 'product',
            label: productId,
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
        <div className="p-6">
            <Breadcrumb items={breadcrumbItems} />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {service.display_name || service.name}
                    </h1>
                    <p className="text-gray-600">{service.short_description}</p>
                </div>
                <div className="flex space-x-3">
                    <Button
                        variant="outline"
                        onClick={() => onEditService(service)}
                        leftIcon={<Edit2 className="w-4 h-4" />}
                    >
                        Edit Service
                    </Button>
                    <Button
                        variant="outline"
                        leftIcon={<Eye className="w-4 h-4" />}
                    >
                        Preview
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

            {/* Service Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 mb-4">
                            {service.overview || 'No overview available.'}
                        </p>

                        {service.key_features && service.key_features.length > 0 && (
                            <div className="mb-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
                                <ul className="list-disc list-inside space-y-1">
                                    {service.key_features.map((feature, index) => (
                                        <li key={index} className="text-gray-700">{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {service.integration_guide && (
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Integration Guide</h4>
                                <p className="text-gray-700">{service.integration_guide}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Service Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div>
                                <span className="text-sm font-medium text-gray-500">Category</span>
                                <p className="text-gray-900">{service.category || 'General'}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500">Status</span>
                                <p className="text-gray-900">{service.status || 'Active'}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500">Versions</span>
                                <p className="text-gray-900">{versions.length}</p>
                            </div>
                            {service.supported_protocols && service.supported_protocols.length > 0 && (
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Protocols</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {service.supported_protocols.map(protocol => (
                                            <span key={protocol} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                                {protocol}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* API Versions List */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">API Versions</h2>
                {versions.length === 0 ? (
                    <EmptyState
                        title="No versions yet"
                        description="Add your first API version to get started"
                        actionLabel="Add Version"
                        onAction={onAddVersion}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {versions.map(version => (
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

export default ServiceDetailViewOld;