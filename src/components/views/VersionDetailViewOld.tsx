import React, { useState } from 'react';
import { Edit2, Eye, FileText, Code, ExternalLink, Copy, Wifi, ChevronDown, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import Breadcrumb from '../ui/Breadcrumb';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';

interface VersionDetailViewProps {
    version: {
        version: string;
        status: string;
        release_date: string;
        deprecated?: boolean;
        beta?: boolean;
        breaking_changes?: boolean;
        introduction?: string;
        getting_started?: string;
        tutorials?: Array<{ title: string; content: string }>;
        code_examples?: Record<string, string>;
        supported_until?: string;
        api_specs?: {
            openapi?: { name: string; content: string; size?: number };
            mqtt?: { name: string; content: string; size?: number };
        };
        supported_apis?: string[];
    };
    productId: string;
    serviceId: string;
    onGoToService: () => void;
    onGoToProduct: () => void;
    onGoToProductsList: () => void;
    onEditVersion: (version: any) => void;
}

// YAML/JSON Viewer Component
const CodeViewer: React.FC<{
    title: string;
    filename: string;
    content: string;
    language: string;
    icon: React.ReactNode;
    onOpenExternal?: () => void;
    externalLabel?: string;
}> = ({ title, filename, content, language, icon, onOpenExternal, externalLabel }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatContent = (content: string) => {
        try {
            if (language === 'json') {
                return JSON.stringify(JSON.parse(content), null, 2);
            }
            return content;
        } catch {
            return content;
        }
    };

    const lineCount = content.split('\n').length;

    return (
        <Card className="mb-6">
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {icon}
                        <div>
                            <h3 className="font-semibold text-gray-900">{title}</h3>
                            <p className="text-sm text-gray-500">{filename} • {lineCount} lines</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopy}
                            leftIcon={<Copy className="w-4 h-4" />}
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </Button>
                        {onOpenExternal && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onOpenExternal}
                                leftIcon={<ExternalLink className="w-4 h-4" />}
                            >
                                {externalLabel}
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            leftIcon={isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        >
                            {isExpanded ? 'Collapse' : 'Expand'}
                        </Button>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="p-4">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto max-h-96 overflow-y-auto">
                        <code className={`language-${language}`}>
                            {formatContent(content)}
                        </code>
                    </pre>
                </div>
            )}
        </Card>
    );
};

const VersionDetailViewOld: React.FC<VersionDetailViewProps> = ({
                                                                 version,
                                                                 productId,
                                                                 serviceId,
                                                                 onGoToService,
                                                                 onGoToProduct,
                                                                 onGoToProductsList,
                                                                 onEditVersion
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
        if (version.api_specs?.openapi?.content) {
            // Create a blob URL for the YAML content
            const blob = new Blob([version.api_specs.openapi.content], { type: 'text/yaml' });
            const url = URL.createObjectURL(blob);

            // Open Swagger Editor with the spec
            const swaggerEditorUrl = `https://editor.swagger.io/?url=${encodeURIComponent(url)}`;
            window.open(swaggerEditorUrl, '_blank');

            // Clean up the blob URL after a delay
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } else {
            alert('No OpenAPI specification available to preview');
        }
    };

    const openAsyncAPIStudio = () => {
        if (version.api_specs?.mqtt?.content) {
            // For AsyncAPI, we can use the AsyncAPI Studio
            const asyncApiUrl = `https://studio.asyncapi.com/?url=data:text/yaml;base64,${btoa(version.api_specs.mqtt.content)}`;
            window.open(asyncApiUrl, '_blank');
        } else {
            alert('No AsyncAPI specification available to preview');
        }
    };

    const viewApiDocumentation = () => {
        // This would navigate to a full API documentation page
        // For now, we'll show which specs are available
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
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

                    {/* API Specifications */}
                    {(version.api_specs?.openapi || version.api_specs?.mqtt) && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900">API Specifications</h2>

                            {version.api_specs.openapi && (
                                <CodeViewer
                                    title="OpenAPI Specification (Swagger)"
                                    filename={version.api_specs.openapi.name}
                                    content={version.api_specs.openapi.content}
                                    language={version.api_specs.openapi.name.endsWith('.json') ? 'json' : 'yaml'}
                                    icon={<Code className="w-5 h-5 text-green-600" />}
                                    onOpenExternal={openSwaggerUI}
                                    externalLabel="Open in Swagger UI"
                                />
                            )}

                            {version.api_specs.mqtt && (
                                <CodeViewer
                                    title="AsyncAPI Specification (MQTT)"
                                    filename={version.api_specs.mqtt.name}
                                    content={version.api_specs.mqtt.content}
                                    language={version.api_specs.mqtt.name.endsWith('.json') ? 'json' : 'yaml'}
                                    icon={<Wifi className="w-5 h-5 text-purple-600" />}
                                    onOpenExternal={openAsyncAPIStudio}
                                    externalLabel="Open in AsyncAPI Studio"
                                />
                            )}
                        </div>
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

                                {version.api_specs?.openapi && (
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

                                {version.api_specs?.mqtt && (
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

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                    leftIcon={<ExternalLink className="w-4 h-4" />}
                                >
                                    Release Notes
                                </Button>
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
                                {version.api_specs?.openapi && (
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
                                {version.api_specs?.mqtt && (
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

export default VersionDetailViewOld;