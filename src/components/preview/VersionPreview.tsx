// src/components/preview/VersionPreview.tsx
import React, { useState } from 'react';
import { ArrowLeft, Code, FileText, ExternalLink, Copy, Eye } from 'lucide-react';

// Button Component
const Button: React.FC<{
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    className?: string;
    leftIcon?: React.ReactNode;
    onClick?: () => void;
    [key: string]: any;
}> = ({
          variant = 'primary',
          size = 'md',
          children,
          className = '',
          leftIcon,
          ...props
      }) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
        ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500'
    };

    const sizes = {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
        <button className={classes} {...props}>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
        </button>
    );
};

// Card Component
const Card: React.FC<{
    children: React.ReactNode;
    className?: string;
    [key: string]: any;
}> = ({ children, className = '', ...props }) => {
    return (
        <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`} {...props}>
            {children}
        </div>
    );
};

const CardContent: React.FC<{
    children: React.ReactNode;
    className?: string;
    [key: string]: any;
}> = ({ children, className = '', ...props }) => {
    return (
        <div className={`p-6 ${className}`} {...props}>
            {children}
        </div>
    );
};

// API Spec Viewer Component
const ApiSpecViewer: React.FC<{
    spec: { name: string; content: string; size?: number };
    type: string;
    title: string;
}> = ({ spec, type, title }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(spec.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getLanguage = () => {
        if (spec.name.endsWith('.json')) return 'json';
        return 'yaml';
    };

    const formatContent = (content: string) => {
        try {
            if (getLanguage() === 'json') {
                return JSON.stringify(JSON.parse(content), null, 2);
            }
            return content;
        } catch {
            return content;
        }
    };

    return (
        <Card className="mt-4">
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {type === 'swagger' ? (
                            <Code className="w-5 h-5 text-green-600" />
                        ) : (
                            <FileText className="w-5 h-5 text-purple-600" />
                        )}
                        <h4 className="font-semibold text-gray-900">{title}</h4>
                        <span className="text-sm text-gray-500">({spec.name})</span>
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
                        <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<ExternalLink className="w-4 h-4" />}
                            onClick={() => {
                                // Open Swagger UI with the spec content
                                const swaggerUrl = `https://editor.swagger.io/?url=data:application/yaml;base64,${btoa(spec.content)}`;
                                window.open(swaggerUrl, '_blank');
                            }}
                        >
                            Open in {type === 'swagger' ? 'Swagger Editor' : 'AsyncAPI Studio'}
                        </Button>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto max-h-96 overflow-y-auto">
                        <code className={`language-${getLanguage()}`}>
                            {formatContent(spec.content)}
                        </code>
                    </pre>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                    File size: {((spec.size || spec.content.length) / 1024).toFixed(1)} KB • Lines: {spec.content.split('\n').length}
                </div>
            </div>
        </Card>
    );
};

// Version Preview Component
interface VersionPreviewProps {
    version: {
        version: string;
        status: string;
        release_date: string;
        supported_until?: string;
        deprecated?: boolean;
        beta?: boolean;
        breaking_changes?: boolean;
        introduction?: string;
        getting_started?: string;
        tutorials?: Array<{ title: string; content: string }>;
        api_specs?: {
            openapi?: any;
            mqtt?: any;
        };
        supported_apis?: string[];
        supports_swagger?: boolean;
        supports_mqtt?: boolean;
    };
    productId: string;
    serviceId: string;
    onBack: () => void;
}

export const VersionPreview: React.FC<VersionPreviewProps> = ({
                                                                  version,
                                                                  productId,
                                                                  serviceId,
                                                                  onBack
                                                              }) => {
    const [activeTab, setActiveTab] = useState('overview');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'stable': return 'bg-green-100 text-green-700';
            case 'beta': return 'bg-yellow-100 text-yellow-700';
            case 'deprecated': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const hasSwaggerSpec = version.api_specs?.openapi && version.api_specs.openapi.content;
    const hasMqttSpec = version.api_specs?.mqtt && version.api_specs.mqtt.content;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
        ...(hasSwaggerSpec ? [{ id: 'swagger', label: 'Swagger/OpenAPI', icon: <Code className="w-4 h-4" /> }] : []),
        ...(hasMqttSpec ? [{ id: 'mqtt', label: 'MQTT/AsyncAPI', icon: <FileText className="w-4 h-4" /> }] : [])
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Button variant="ghost" onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                            Back to CMS
                        </Button>
                        <div className="text-2xl font-bold text-blue-600">WANZL DOCS</div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <nav className="flex space-x-6">
                            <a href="#" className="text-gray-700 hover:text-blue-600">PRODUCTS</a>
                            <a href="#" className="text-gray-700 hover:text-blue-600">FAQ</a>
                        </nav>
                        <Button variant="outline" size="sm">Sign In</Button>
                    </div>
                </div>
            </header>

            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-100 px-6 py-3">
                <nav className="flex items-center text-sm text-gray-600">
                    <span>Home</span>
                    <span className="mx-2">›</span>
                    <span>{productId}</span>
                    <span className="mx-2">›</span>
                    <span>{serviceId}</span>
                    <span className="mx-2">›</span>
                    <span className="text-blue-600">Getting Started</span>
                </nav>
            </div>

            {/* Version Header */}
            <section className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white py-12">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <Code className="w-8 h-8" />
                        <h1 className="text-3xl font-bold">{serviceId}</h1>
                        <span className="text-2xl font-bold text-indigo-200">Version {version.version}</span>
                        <span className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(version.status)} text-indigo-900`}>
                            {version.status}
                        </span>
                    </div>

                    <p className="text-indigo-100 mb-4">
                        {version.introduction || 'API documentation for this version'}
                    </p>

                    <div className="flex items-center space-x-6 text-sm text-indigo-200">
                        <span>Released: {new Date(version.release_date).toLocaleDateString()}</span>
                        {version.supported_until && (
                            <span>Support until: {new Date(version.supported_until).toLocaleDateString()}</span>
                        )}
                    </div>

                    {/* Status Badges */}
                    {(version.breaking_changes || version.deprecated || version.beta) && (
                        <div className="flex items-center space-x-2 mt-4">
                            {version.breaking_changes && (
                                <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded font-medium">
                                    Breaking Changes
                                </span>
                            )}
                            {version.deprecated && (
                                <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded font-medium">
                                    Deprecated
                                </span>
                            )}
                            {version.beta && (
                                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded font-medium">
                                    Beta
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6">
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
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Quick Start Guide */}
                            {version.getting_started && (
                                <Card>
                                    <CardContent>
                                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                            <div className="flex items-center space-x-2 text-blue-800">
                                                <span>ℹ️</span>
                                                <span className="font-medium">Set up your stuff real quick. Here is a very important information.</span>
                                            </div>
                                        </div>

                                        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick start Guide</h2>
                                        <p className="text-gray-700 mb-4">
                                            This guide will show you some of the most important features you get by writing your application
                                            as a Hydra app. If you only want to use Hydra for config composition, check out Hydra's compose
                                            API for an alternative. Please also read the full tutorial to gain a deeper understanding.
                                        </p>

                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <pre className="text-sm text-gray-800 whitespace-pre-wrap">{version.getting_started}</pre>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Tutorials */}
                            {version.tutorials && version.tutorials.length > 0 && (
                                <Card>
                                    <CardContent>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tutorials</h3>
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
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* API Endpoints */}
                            <Card>
                                <CardContent>
                                    <h3 className="font-semibold text-gray-900 mb-4">API Endpoints</h3>
                                    <div className="space-y-3">
                                        {hasSwaggerSpec && (
                                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                                <div className="flex items-center space-x-2">
                                                    <Code className="w-4 h-4 text-green-600" />
                                                    <span className="text-sm font-medium text-green-800">REST API</span>
                                                </div>
                                                <Button variant="outline" size="sm" onClick={() => setActiveTab('swagger')}>
                                                    View Docs
                                                </Button>
                                            </div>
                                        )}

                                        {hasMqttSpec && (
                                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                                <div className="flex items-center space-x-2">
                                                    <FileText className="w-4 h-4 text-purple-600" />
                                                    <span className="text-sm font-medium text-purple-800">MQTT API</span>
                                                </div>
                                                <Button variant="outline" size="sm" onClick={() => setActiveTab('mqtt')}>
                                                    View Docs
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Version Info */}
                            <Card>
                                <CardContent>
                                    <h3 className="font-semibold text-gray-900 mb-4">Version Information</h3>
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
                        </div>
                    </div>
                )}

                {activeTab === 'swagger' && hasSwaggerSpec && (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Swagger/OpenAPI Specification</h2>
                            <p className="text-gray-600">
                                Interactive API documentation powered by OpenAPI specification.
                            </p>
                        </div>

                        {/* Swagger UI Simulation */}
                        <Card className="mb-6">
                            <div className="p-4 bg-green-50 border-b border-green-200">
                                <div className="flex items-center space-x-2">
                                    <Code className="w-5 h-5 text-green-600" />
                                    <h3 className="font-semibold text-green-800">Interactive API Explorer</h3>
                                </div>
                                <p className="text-sm text-green-700 mt-1">
                                    This would render the full Swagger UI interface with your API specification
                                </p>
                            </div>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Mock API Endpoint */}
                                    <div className="border border-gray-200 rounded-lg">
                                        <div className="bg-blue-50 px-4 py-3 border-b border-blue-200">
                                            <div className="flex items-center space-x-3">
                                                <span className="bg-green-500 text-white px-2 py-1 text-xs rounded font-mono">GET</span>
                                                <span className="font-mono text-gray-800">/api/v{version.version}/transactions</span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <p className="text-gray-700 mb-3">Retrieve a list of transactions</p>
                                            <Button variant="outline" size="sm" leftIcon={<ExternalLink className="w-4 h-4" />}>
                                                Try it out
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="border border-gray-200 rounded-lg">
                                        <div className="bg-blue-50 px-4 py-3 border-b border-blue-200">
                                            <div className="flex items-center space-x-3">
                                                <span className="bg-blue-500 text-white px-2 py-1 text-xs rounded font-mono">POST</span>
                                                <span className="font-mono text-gray-800">/api/v{version.version}/transactions</span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <p className="text-gray-700 mb-3">Create a new transaction</p>
                                            <Button variant="outline" size="sm" leftIcon={<ExternalLink className="w-4 h-4" />}>
                                                Try it out
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <ApiSpecViewer
                            spec={version.api_specs.openapi}
                            type="swagger"
                            title="OpenAPI Specification"
                        />
                    </div>
                )}

                {activeTab === 'mqtt' && hasMqttSpec && (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">MQTT/AsyncAPI Specification</h2>
                            <p className="text-gray-600">
                                Event-driven API documentation for MQTT messaging.
                            </p>
                        </div>

                        {/* AsyncAPI UI Simulation */}
                        <Card className="mb-6">
                            <div className="p-4 bg-purple-50 border-b border-purple-200">
                                <div className="flex items-center space-x-2">
                                    <FileText className="w-5 h-5 text-purple-600" />
                                    <h3 className="font-semibold text-purple-800">MQTT Message Explorer</h3>
                                </div>
                                <p className="text-sm text-purple-700 mt-1">
                                    This would render the full AsyncAPI interface with your MQTT specification
                                </p>
                            </div>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Mock MQTT Topics */}
                                    <div className="border border-gray-200 rounded-lg">
                                        <div className="bg-purple-50 px-4 py-3 border-b border-purple-200">
                                            <div className="flex items-center space-x-3">
                                                <span className="bg-purple-500 text-white px-2 py-1 text-xs rounded font-mono">SUB</span>
                                                <span className="font-mono text-gray-800">transactions/created</span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <p className="text-gray-700 mb-3">Subscribe to transaction creation events</p>
                                            <div className="bg-gray-50 p-3 rounded text-sm">
                                                <strong>Payload Schema:</strong> TransactionCreatedEvent
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border border-gray-200 rounded-lg">
                                        <div className="bg-purple-50 px-4 py-3 border-b border-purple-200">
                                            <div className="flex items-center space-x-3">
                                                <span className="bg-orange-500 text-white px-2 py-1 text-xs rounded font-mono">PUB</span>
                                                <span className="font-mono text-gray-800">transactions/process</span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <p className="text-gray-700 mb-3">Publish transaction processing commands</p>
                                            <div className="bg-gray-50 p-3 rounded text-sm">
                                                <strong>Payload Schema:</strong> ProcessTransactionCommand
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <ApiSpecViewer
                            spec={version.api_specs.mqtt}
                            type="mqtt"
                            title="AsyncAPI Specification"
                        />
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 mt-12">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400 mb-4">WANZL</div>
                        <p className="text-gray-400">© 2025 Wanzl. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default VersionPreview;