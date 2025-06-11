import React, { useState } from 'react';
import {
    Edit2,
    Eye,
    FileText,
    Code,
    ExternalLink,
    Copy,
    Wifi,
    ChevronDown,
    ChevronRight,
    Plus,
    BookOpen,
    Clock
} from 'lucide-react';
import Button from '../ui/Button';
import Breadcrumb from '../ui/Breadcrumb';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import ApiSpecViewer from '../ui/ApiSpecViewer';
import type { ApiVersion } from '@/types';

interface VersionDetailViewProps {
    version: ApiVersion;
    productId: string;
    serviceId: string;
    onGoToService: () => void;
    onGoToProduct: () => void;
    onGoToProductsList: () => void;
    onEditVersion: (version: ApiVersion) => void;
    onEditReleaseNotes?: () => void;
    onViewApiSpec?: (spec: any, type: 'swagger' | 'mqtt', title: string) => void;
}

const VersionDetailView: React.FC<VersionDetailViewProps> = ({
                                                                 version,
                                                                 productId,
                                                                 serviceId,
                                                                 onGoToService,
                                                                 onGoToProduct,
                                                                 onGoToProductsList,
                                                                 onEditVersion,
                                                                 onEditReleaseNotes,
                                                                 onViewApiSpec
                                                             }) => {
    const [activeTab, setActiveTab] = useState('overview');

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
            label: serviceId,
            onClick: onGoToService
        },
        {
            key: 'version',
            label: `v${version.version}`,
            isActive: true
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'stable': return 'bg-green-100 text-green-700';
            case 'beta': return 'bg-yellow-100 text-yellow-700';
            case 'deprecated': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getApiTypeIcon = () => {
        const hasSwagger = version.api_specs?.openapi;
        const hasMqtt = version.api_specs?.mqtt;

        if (hasSwagger && hasMqtt) {
            return (
                <div className="flex items-center space-x-2">
                    <Code className="w-6 h-6 text-green-600" />
                    <Wifi className="w-6 h-6 text-purple-600" />
                </div>
            );
        } else if (hasMqtt) {
            return <Wifi className="w-8 h-8 text-purple-600" />;
        } else if (hasSwagger) {
            return <Code className="w-8 h-8 text-green-600" />;
        } else {
            return <FileText className="w-8 h-8 text-gray-600" />;
        }
    };

    const openSwaggerUI = () => {
        if (version.api_specs?.openapi && onViewApiSpec) {
            // Handle both string and FileData formats
            const spec = typeof version.api_specs.openapi === 'string'
                ? { name: 'openapi.yaml', content: version.api_specs.openapi, size: version.api_specs.openapi.length }
                : version.api_specs.openapi;
            onViewApiSpec(spec, 'swagger', 'OpenAPI Specification');
        }
    };

    const openAsyncAPIStudio = () => {
        if (version.api_specs?.mqtt && onViewApiSpec) {
            // Handle both string and FileData formats
            const spec = typeof version.api_specs.mqtt === 'string'
                ? { name: 'asyncapi.yaml', content: version.api_specs.mqtt, size: version.api_specs.mqtt.length }
                : version.api_specs.mqtt;
            onViewApiSpec(spec, 'mqtt', 'AsyncAPI Specification');
        }
    };

    const viewApiDocumentation = () => {
        const hasSwagger = version.api_specs?.openapi;
        const hasMqtt = version.api_specs?.mqtt;

        if (hasSwagger && hasMqtt) {
            const choice = confirm('Which documentation would you like to view?\nOK = Swagger UI\nCancel = AsyncAPI Studio');
            if (choice) {
                openSwaggerUI();
            } else {
                openAsyncAPIStudio();
            }
        } else if (hasSwagger) {
            openSwaggerUI();
        } else if (hasMqtt) {
            openAsyncAPIStudio();
        } else {
            alert('No API specifications available for this version');
        }
    };

    const hasSwaggerSpec = version.api_specs?.openapi;
    const hasMqttSpec = version.api_specs?.mqtt;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
        ...(hasSwaggerSpec ? [{ id: 'swagger', label: 'Swagger/OpenAPI', icon: <Code className="w-4 h-4" /> }] : []),
        ...(hasMqttSpec ? [{ id: 'mqtt', label: 'MQTT/AsyncAPI', icon: <Wifi className="w-4 h-4" /> }] : []),
        { id: 'release-notes', label: 'Release Notes', icon: <BookOpen className="w-4 h-4" /> }
    ];

    return (
        <div className="p-6">
            <Breadcrumb items={breadcrumbItems} />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    {/* API Type Icon */}
                    <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-gray-200">
                        {getApiTypeIcon()}
                    </div>
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">
                                API Version {version.version}
                            </h1>
                            <span className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(version.status)}`}>
                                {version.status}
                            </span>
                        </div>
                        <p className="text-gray-600">
                            Released on {new Date(version.release_date).toLocaleDateString()}
                            {version.supported_until && (
                                <span> • Supported until {new Date(version.supported_until).toLocaleDateString()}</span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <Button
                        variant="outline"
                        onClick={() => onEditVersion(version)}
                        leftIcon={<Edit2 className="w-4 h-4" />}
                    >
                        Edit Version
                    </Button>
                    <Button
                        variant="outline"
                        leftIcon={<Eye className="w-4 h-4" />}
                    >
                        Preview
                    </Button>
                </div>
            </div>

            {/* Version Status Indicators */}
            {(version.breaking_changes || version.deprecated || version.beta) && (
                <div className="flex items-center space-x-2 mb-6">
                    {version.breaking_changes && (
                        <span className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
                            Breaking Changes
                        </span>
                    )}
                    {version.deprecated && (
                        <span className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
                            Deprecated
                        </span>
                    )}
                    {version.beta && (
                        <span className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                            Beta Version
                        </span>
                    )}
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'overview' && (
                        <>
                            {/* Introduction */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Introduction</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 leading-relaxed">
                                        {version.introduction || 'No introduction available for this version.'}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Getting Started */}
                            {version.getting_started && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Getting Started</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="prose prose-sm max-w-none">
                                            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                                                {version.getting_started}
                                            </pre>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Tutorials */}
                            {version.tutorials && version.tutorials.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Tutorials</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {version.tutorials.map((tutorial, index) => (
                                                <div key={index} className="border-l-4 border-blue-200 pl-4">
                                                    <h4 className="font-semibold text-gray-900 mb-2">{tutorial.title}</h4>
                                                    <p className="text-gray-700 text-sm">{tutorial.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Code Examples */}
                            {version.code_examples && Object.keys(version.code_examples).length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Code Examples</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {Object.entries(version.code_examples).map(([language, code]) => (
                                                <div key={language}>
                                                    <h4 className="font-semibold text-gray-900 mb-2 capitalize">{language}</h4>
                                                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                                                        {code}
                                                    </pre>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}

                    {activeTab === 'swagger' && hasSwaggerSpec && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Swagger/OpenAPI Specification</h2>
                                <p className="text-gray-600">
                                    Interactive API documentation powered by OpenAPI specification.
                                </p>
                            </div>
                            <ApiSpecViewer
                                spec={typeof version.api_specs.openapi === 'string'
                                    ? { name: 'openapi.yaml', content: version.api_specs.openapi, size: version.api_specs.openapi.length }
                                    : version.api_specs.openapi}
                                type="swagger"
                                title="OpenAPI Specification"
                            />
                        </div>
                    )}

                    {activeTab === 'mqtt' && hasMqttSpec && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">MQTT/AsyncAPI Specification</h2>
                                <p className="text-gray-600">
                                    Event-driven API documentation for MQTT messaging.
                                </p>
                            </div>
                            <ApiSpecViewer
                                spec={typeof version.api_specs.mqtt === 'string'
                                    ? { name: 'asyncapi.yaml', content: version.api_specs.mqtt, size: version.api_specs.mqtt.length }
                                    : version.api_specs.mqtt}
                                type="mqtt"
                                title="AsyncAPI Specification"
                            />
                        </div>
                    )}

                    {activeTab === 'release-notes' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Release Notes</h2>
                                    <p className="text-gray-600">
                                        What's new, changed, or fixed in version {version.version}
                                    </p>
                                </div>
                                {onEditReleaseNotes && (
                                    <Button
                                        variant="outline"
                                        onClick={onEditReleaseNotes}
                                        leftIcon={<Edit2 className="w-4 h-4" />}
                                    >
                                        Edit Release Notes
                                    </Button>
                                )}
                            </div>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-center py-8">
                                        <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                        <h3 className="text-sm font-medium text-gray-900 mb-1">No release notes yet</h3>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Document what's new, changed, or fixed in this version
                                        </p>
                                        {onEditReleaseNotes && (
                                            <Button
                                                onClick={onEditReleaseNotes}
                                                leftIcon={<Plus className="w-4 h-4" />}
                                            >
                                                Create Release Notes
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                    leftIcon={<FileText className="w-4 h-4" />}
                                    onClick={viewApiDocumentation}
                                >
                                    View API Documentation
                                </Button>

                                {hasSwaggerSpec && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full justify-start"
                                        leftIcon={<Code className="w-4 h-4" />}
                                        onClick={openSwaggerUI}
                                    >
                                        Open in Swagger UI
                                    </Button>
                                )}

                                {hasMqttSpec && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full justify-start"
                                        leftIcon={<Wifi className="w-4 h-4" />}
                                        onClick={openAsyncAPIStudio}
                                    >
                                        Open in AsyncAPI Studio
                                    </Button>
                                )}

                                {onEditReleaseNotes && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full justify-start"
                                        leftIcon={<BookOpen className="w-4 h-4" />}
                                        onClick={onEditReleaseNotes}
                                    >
                                        Edit Release Notes
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Version Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Version Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="font-medium text-gray-500">Version:</span>
                                    <p className="text-gray-900">{version.version}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-500">Status:</span>
                                    <p className="text-gray-900 capitalize">{version.status}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-500">Release Date:</span>
                                    <p className="text-gray-900">
                                        {new Date(version.release_date).toLocaleDateString()}
                                    </p>
                                </div>
                                {version.supported_until && (
                                    <div>
                                        <span className="font-medium text-gray-500">Support Until:</span>
                                        <p className="text-gray-900">
                                            {new Date(version.supported_until).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* API Specifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle>API Specifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                {hasSwaggerSpec && (
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <div className="flex items-center space-x-2">
                                            <Code className="w-4 h-4 text-green-600" />
                                            <span className="text-gray-600">OpenAPI Spec</span>
                                        </div>
                                        <Button variant="ghost" size="xs" onClick={openSwaggerUI}>
                                            <ExternalLink className="w-3 h-3" />
                                        </Button>
                                    </div>
                                )}
                                {hasMqttSpec && (
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <div className="flex items-center space-x-2">
                                            <Wifi className="w-4 h-4 text-purple-600" />
                                            <span className="text-gray-600">AsyncAPI Spec</span>
                                        </div>
                                        <Button variant="ghost" size="xs" onClick={openAsyncAPIStudio}>
                                            <ExternalLink className="w-3 h-3" />
                                        </Button>
                                    </div>
                                )}
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-gray-600">Examples</span>
                                    <Button variant="ghost" size="xs">
                                        <ExternalLink className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default VersionDetailView;