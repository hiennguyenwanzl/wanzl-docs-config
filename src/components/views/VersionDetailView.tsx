// src/components/views/VersionDetailView.tsx
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
    Clock,
    Sparkles,
    Bug,
    AlertTriangle,
    Zap
} from 'lucide-react';
import Button from '../ui/Button';
import Breadcrumb from '../ui/Breadcrumb';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import ReleaseNotesEditor from '../forms/ReleaseNotesEditor';
import Modal from '../ui/Modal';
import type { ApiVersion } from '@/types';

interface VersionDetailViewProps {
    version: ApiVersion;
    productId: string;
    productName?: string;
    serviceId: string;
    serviceName?: string;
    releaseNotes?: any;
    onGoToService: () => void;
    onGoToProduct: () => void;
    onGoToLandingPage: () => void;
    onEditVersion: (version: ApiVersion) => void;
    onEditReleaseNotes?: (productId: string, serviceId: string, versionId: string) => void;
    onSaveReleaseNotes?: (productId: string, serviceId: string, versionId: string, data: any) => void;
    onViewApiSpec?: (spec: any, type: 'swagger' | 'mqtt', title: string) => void;
}

const VersionDetailView: React.FC<VersionDetailViewProps> = ({
                                                                 version,
                                                                 productId,
                                                                 productName,
                                                                 serviceId,
                                                                 serviceName,
                                                                 releaseNotes,
                                                                 onGoToService,
                                                                 onGoToProduct,
                                                                 onGoToLandingPage,
                                                                 onEditVersion,
                                                                 onEditReleaseNotes,
                                                                 onSaveReleaseNotes,
                                                                 onViewApiSpec
                                                             }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [showReleaseNotesEditor, setShowReleaseNotesEditor] = useState(false);

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
            label: serviceName || serviceId,
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
        const protocolType = hasMqtt ? 'MQTT' : 'REST';

        if (protocolType === 'MQTT' || hasMqtt) {
            return <Wifi className="w-8 h-8 text-purple-600" />;
        } else if (protocolType === 'REST' || hasSwagger) {
            return <Code className="w-8 h-8 text-green-600" />;
        } else {
            return <FileText className="w-8 h-8 text-gray-600" />;
        }
    };

    const hasSwaggerSpec = version.api_specs?.openapi;
    const hasMqttSpec = version.api_specs?.mqtt;
    const protocolType = hasMqttSpec ? 'MQTT' : 'REST';

    // Build tabs based on protocol type and available specs
    const tabs = [
        { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
        ...(protocolType === 'REST' && hasSwaggerSpec ? [{ id: 'swagger', label: 'REST API', icon: <Code className="w-4 h-4" /> }] : []),
        ...(protocolType === 'MQTT' && hasMqttSpec ? [{ id: 'mqtt', label: 'MQTT API', icon: <Wifi className="w-4 h-4" /> }] : []),
        { id: 'release-notes', label: 'Release Notes', icon: <BookOpen className="w-4 h-4" /> }
    ];

    const handleSaveReleaseNotes = (data: any) => {
        if (onSaveReleaseNotes) {
            onSaveReleaseNotes(productId, serviceId, version.version, data);
        }
        setShowReleaseNotesEditor(false);
    };

    const handleEditReleaseNotes = () => {
        setShowReleaseNotesEditor(true);
    };

    // Render release notes content based on format
    const renderReleaseNotesContent = () => {
        if (!releaseNotes) {
            return (
                <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No release notes yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Document what's new, changed, or fixed in this version to help developers understand the updates.
                    </p>
                    <Button
                        onClick={handleEditReleaseNotes}
                        leftIcon={<Plus className="w-4 h-4" />}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    >
                        Create Release Notes
                    </Button>
                </div>
            );
        }

        // Check if it's the new structured format or old format
        const isStructuredFormat = releaseNotes.notes || releaseNotes.highlights || releaseNotes.summary;

        if (isStructuredFormat) {
            // New structured format
            return (
                <div className="space-y-6">
                    {/* Release Summary */}
                    {releaseNotes.summary && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
                            <p className="text-gray-700 leading-relaxed">{releaseNotes.summary}</p>
                        </div>
                    )}

                    {/* Key Highlights */}
                    {releaseNotes.highlights && releaseNotes.highlights.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Highlights</h3>
                            <ul className="list-disc list-inside space-y-2">
                                {releaseNotes.highlights.map((highlight: string, index: number) => (
                                    <li key={index} className="text-gray-700">{highlight}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Categorized Notes */}
                    {releaseNotes.notes && releaseNotes.notes.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Changes</h3>
                            <div className="space-y-4">
                                {['feature', 'improvement', 'bugfix', 'breaking'].map(type => {
                                    const notesOfType = releaseNotes.notes.filter((note: any) => note.type === type);
                                    if (notesOfType.length === 0) return null;

                                    const typeConfig = {
                                        feature: { icon: <Sparkles className="w-5 h-5 text-green-600" />, label: 'New Features', bgColor: 'bg-green-50 border-green-200' },
                                        improvement: { icon: <Zap className="w-5 h-5 text-blue-600" />, label: 'Improvements', bgColor: 'bg-blue-50 border-blue-200' },
                                        bugfix: { icon: <Bug className="w-5 h-5 text-yellow-600" />, label: 'Bug Fixes', bgColor: 'bg-yellow-50 border-yellow-200' },
                                        breaking: { icon: <AlertTriangle className="w-5 h-5 text-red-600" />, label: 'Breaking Changes', bgColor: 'bg-red-50 border-red-200' }
                                    };

                                    const config = typeConfig[type as keyof typeof typeConfig];

                                    return (
                                        <div key={type}>
                                            <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                                {config.icon}
                                                <span>{config.label}</span>
                                            </h4>
                                            <div className="space-y-3">
                                                {notesOfType.map((note: any, index: number) => (
                                                    <div key={index} className={`border-l-4 pl-4 py-2 rounded-r-lg ${config.bgColor}`}>
                                                        <h5 className="font-medium text-gray-900">{note.title}</h5>
                                                        <p className="text-gray-800 text-sm mt-1">{note.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            );
        } else {
            // Legacy format - try to display whatever is available
            return (
                <div className="space-y-6">
                    {Object.entries(releaseNotes).map(([key, value]) => {
                        if (!value || (Array.isArray(value) && value.length === 0)) return null;

                        return (
                            <div key={key}>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
                                    {key.replace(/_/g, ' ')}
                                </h3>
                                {Array.isArray(value) ? (
                                    <ul className="list-disc list-inside space-y-2">
                                        {value.map((item: any, index: number) => (
                                            <li key={index} className="text-gray-700">
                                                {typeof item === 'object' ? item.title || item.description || JSON.stringify(item) : item}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-700">{String(value)}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        }
    };

    return (
        <div className="p-6">
            <Breadcrumb items={breadcrumbItems} />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    {/* API Type Icon with Protocol-specific styling */}
                    <div className={`w-16 h-16 flex items-center justify-center rounded-lg border border-gray-200 ${
                        protocolType === 'MQTT'
                            ? 'bg-gradient-to-br from-purple-50 to-purple-100'
                            : 'bg-gradient-to-br from-green-50 to-green-100'
                    }`}>
                        {getApiTypeIcon()}
                    </div>
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {protocolType} API Version {version.version}
                            </h1>
                            <span className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(version.status)}`}>
                                {version.status}
                            </span>
                            {version.breaking_changes && (
                                <span className="text-sm px-2 py-1 rounded-full font-medium bg-orange-100 text-orange-700 flex items-center space-x-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span>Breaking Changes</span>
                                </span>
                            )}
                        </div>
                        <p className="text-gray-600">
                            Released on {new Date(version.release_date).toLocaleDateString()}
                            {version.supported_until && (
                                <span> • Supported until {new Date(version.supported_until).toLocaleDateString()}</span>
                            )}
                        </p>
                        {/* Protocol indicator */}
                        <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-500">Protocol:</span>
                            <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${
                                protocolType === 'MQTT'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-green-100 text-green-700'
                            }`}>
                                {protocolType === 'MQTT' ? <Wifi className="w-3 h-3" /> : <Code className="w-3 h-3" />}
                                <span>{protocolType}</span>
                            </div>
                        </div>
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
            <div className="space-y-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Introduction */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Introduction</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 leading-relaxed">
                                        {version.introduction || `No introduction available for this ${protocolType} API version.`}
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
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
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
                                            <span className="font-medium text-gray-500">Protocol:</span>
                                            <p className="text-gray-900">{protocolType}</p>
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
                                        {protocolType === 'REST' && hasSwaggerSpec && (
                                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                <div className="flex items-center space-x-2">
                                                    <Code className="w-4 h-4 text-green-600" />
                                                    <span className="text-gray-600">OpenAPI Spec</span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="xs"
                                                    onClick={() => setActiveTab('swagger')}
                                                >
                                                    <Eye className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        )}
                                        {protocolType === 'MQTT' && hasMqttSpec && (
                                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                <div className="flex items-center space-x-2">
                                                    <Wifi className="w-4 h-4 text-purple-600" />
                                                    <span className="text-gray-600">AsyncAPI Spec</span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="xs"
                                                    onClick={() => setActiveTab('mqtt')}
                                                >
                                                    <Eye className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-gray-600">Release Notes</span>
                                            <Button
                                                variant="ghost"
                                                size="xs"
                                                onClick={() => setActiveTab('release-notes')}
                                            >
                                                <BookOpen className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* REST API Tab */}
                {activeTab === 'swagger' && hasSwaggerSpec && (
                    <div className="w-full -mx-6">
                        <div className="px-6 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">REST API Specification</h2>
                            <p className="text-gray-600">
                                Interactive API documentation powered by OpenAPI specification.
                            </p>
                        </div>

                        <div className="w-full bg-white border-t border-gray-200">
                            <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">OpenAPI Specification</h3>
                                <div className="bg-white p-4 rounded border">
                                    <pre className="text-sm text-gray-700 overflow-x-auto">
                                        {typeof version.api_specs.openapi === 'string'
                                            ? version.api_specs.openapi
                                            : version.api_specs.openapi?.content || 'No OpenAPI specification available'}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* MQTT API Tab */}
                {activeTab === 'mqtt' && hasMqttSpec && (
                    <div className="w-full -mx-6">
                        <div className="px-6 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">MQTT API Specification</h2>
                            <p className="text-gray-600">
                                Event-driven API documentation for MQTT messaging.
                            </p>
                        </div>

                        <div className="w-full bg-white border-t border-gray-200">
                            <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">AsyncAPI Specification</h3>
                                <div className="bg-white p-4 rounded border">
                                    <pre className="text-sm text-gray-700 overflow-x-auto">
                                        {typeof version.api_specs.mqtt === 'string'
                                            ? version.api_specs.mqtt
                                            : version.api_specs.mqtt?.content || 'No AsyncAPI specification available'}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Release Notes Tab */}
                {activeTab === 'release-notes' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Release Notes</h2>
                                <p className="text-gray-600">
                                    What's new, changed, or fixed in version {version.version}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={handleEditReleaseNotes}
                                leftIcon={<Edit2 className="w-4 h-4" />}
                            >
                                {releaseNotes ? 'Edit Release Notes' : 'Create Release Notes'}
                            </Button>
                        </div>

                        <Card>
                            <CardContent className="p-6">
                                {renderReleaseNotesContent()}
                            </CardContent>
                        </Card>

                        {/* Release Notes Tips */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                            <h3 className="font-medium text-blue-900 mb-3">Release Notes Best Practices</h3>
                            <div className="text-sm text-blue-800 space-y-2">
                                <p>• <strong>Be Clear:</strong> Use simple language that both technical and non-technical users can understand</p>
                                <p>• <strong>Categorize Changes:</strong> Group updates into features, fixes, improvements, and breaking changes</p>
                                <p>• <strong>Include Migration Guides:</strong> For breaking changes, provide step-by-step migration instructions</p>
                                <p>• <strong>Highlight Impact:</strong> Explain how changes affect existing users and integrations</p>
                                <p>• <strong>Version Consistency:</strong> Keep the same format and structure across all release notes</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Release Notes Editor Modal */}
            <Modal
                isOpen={showReleaseNotesEditor}
                onClose={() => setShowReleaseNotesEditor(false)}
                title={releaseNotes ? 'Edit Release Notes' : 'Create Release Notes'}
                size="full"
            >
                <ReleaseNotesEditor
                    initialData={releaseNotes}
                    version={version.version}
                    onSave={handleSaveReleaseNotes}
                    onCancel={() => setShowReleaseNotesEditor(false)}
                />
            </Modal>
        </div>
    );
};

export default VersionDetailView;