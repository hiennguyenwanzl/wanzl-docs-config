import React, { useState } from 'react';
import {
    Code,
    FileText,
    Copy,
    ChevronDown,
    ChevronRight,
    AlertCircle,
    Eye,
    Download,
    Maximize2,
    X
} from 'lucide-react';
import Button from '../ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import Modal from '../ui/Modal';

interface FileData {
    name: string;
    content: string;
    size?: number;
    type?: string;
    lastModified?: number;
}

interface ApiSpecViewerProps {
    spec: FileData;
    type: 'swagger' | 'mqtt';
    title: string;
    className?: string;
}

interface SwaggerUIProps {
    spec: string;
    onClose: () => void;
    isFullscreen?: boolean;
}

interface MqttUIProps {
    spec: string;
    onClose: () => void;
    isFullscreen?: boolean;
}

// Real Swagger UI Component with actual spec parsing
const SwaggerUI: React.FC<SwaggerUIProps> = ({ spec, onClose, isFullscreen = false }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [parsedSpec, setParsedSpec] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        const parseSpec = async () => {
            try {
                let parsed;
                if (spec.trim().startsWith('{')) {
                    // JSON format
                    parsed = JSON.parse(spec);
                } else {
                    // YAML format - simplified parsing for demo
                    // In real implementation, you'd use a YAML parser
                    const lines = spec.split('\n');
                    parsed = {
                        openapi: '3.0.0',
                        info: { title: 'API Documentation', version: '1.0.0' },
                        paths: {}
                    };

                    // Simple YAML parsing for paths
                    let inPaths = false;
                    let currentPath = '';

                    lines.forEach(line => {
                        if (line.trim() === 'paths:') {
                            inPaths = true;
                            return;
                        }

                        if (inPaths && line.match(/^  \/\w+/)) {
                            currentPath = line.trim().replace(':', '');
                            parsed.paths[currentPath] = {
                                get: {
                                    summary: `${currentPath} endpoint`,
                                    responses: {
                                        '200': { description: 'Successful response' }
                                    }
                                }
                            };
                        }
                    });
                }

                setParsedSpec(parsed);
                setError(null);
            } catch (err) {
                setError('Failed to parse API specification');
                console.error('Spec parsing error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        parseSpec();
    }, [spec]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    <p className="text-gray-600">Loading API Specification...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <div>
                        <h3 className="font-semibold text-gray-900">Error Loading Specification</h3>
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`h-full ${isFullscreen ? 'min-h-screen' : ''}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-green-50">
                <div className="flex items-center space-x-3">
                    <Code className="w-6 h-6 text-green-600" />
                    <div>
                        <h3 className="font-semibold text-green-800">
                            {parsedSpec?.info?.title || 'API Documentation'}
                        </h3>
                        <p className="text-sm text-green-700">
                            Version {parsedSpec?.info?.version || '1.0.0'} • OpenAPI {parsedSpec?.openapi || '3.0.0'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {isFullscreen && (
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* API Content */}
            <div className={`p-6 bg-white overflow-y-auto ${isFullscreen ? 'max-h-[calc(100vh-120px)]' : 'max-h-[calc(80vh-200px)]'}`}>
                <div className="space-y-6">
                    {/* API Info */}
                    <div className="border-l-4 border-green-500 pl-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {parsedSpec?.info?.title || 'API Documentation'}
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {parsedSpec?.info?.description || 'Interactive API documentation powered by OpenAPI specification'}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Version: {parsedSpec?.info?.version || '1.0.0'}</span>
                            {parsedSpec?.servers?.[0]?.url && (
                                <>
                                    <span>•</span>
                                    <span>Base URL: {parsedSpec.servers[0].url}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Server Information */}
                    {parsedSpec?.servers && parsedSpec.servers.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-900 mb-2">Servers</h3>
                            {parsedSpec.servers.map((server: any, index: number) => (
                                <div key={index} className="flex items-center space-x-2 text-sm">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
                                        {server.url}
                                    </span>
                                    {server.description && (
                                        <span className="text-blue-700">{server.description}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Endpoints */}
                    {parsedSpec?.paths && Object.keys(parsedSpec.paths).length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Endpoints</h3>

                            {Object.entries(parsedSpec.paths).map(([path, methods]: [string, any]) => (
                                <div key={path} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                        <h4 className="font-mono text-sm font-semibold text-gray-900">{path}</h4>
                                    </div>
                                    <div className="divide-y divide-gray-200">
                                        {Object.entries(methods).map(([method, details]: [string, any]) => {
                                            const methodColors = {
                                                get: 'bg-blue-500',
                                                post: 'bg-green-500',
                                                put: 'bg-orange-500',
                                                delete: 'bg-red-500',
                                                patch: 'bg-purple-500'
                                            };

                                            return (
                                                <div key={method} className="p-4">
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <span className={`${methodColors[method as keyof typeof methodColors] || 'bg-gray-500'} text-white px-3 py-1 text-xs rounded font-mono uppercase`}>
                                                            {method}
                                                        </span>
                                                        <span className="font-semibold text-gray-900">
                                                            {details.summary || `${method.toUpperCase()} ${path}`}
                                                        </span>
                                                    </div>

                                                    {details.description && (
                                                        <p className="text-gray-600 text-sm mb-3">{details.description}</p>
                                                    )}

                                                    {/* Response Codes */}
                                                    {details.responses && (
                                                        <div className="space-y-2">
                                                            <h5 className="font-medium text-gray-900 text-sm">Responses:</h5>
                                                            {Object.entries(details.responses).map(([code, response]: [string, any]) => (
                                                                <div key={code} className="flex items-center space-x-2 text-sm">
                                                                    <span className={`px-2 py-1 rounded text-xs font-mono ${
                                                                        code.startsWith('2') ? 'bg-green-100 text-green-800' :
                                                                            code.startsWith('4') ? 'bg-yellow-100 text-yellow-800' :
                                                                                code.startsWith('5') ? 'bg-red-100 text-red-800' :
                                                                                    'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {code}
                                                                    </span>
                                                                    <span className="text-gray-600">
                                                                        {response.description || 'No description'}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            Try it out
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Components/Schemas */}
                    {parsedSpec?.components?.schemas && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Schemas</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(parsedSpec.components.schemas).map(([name, schema]: [string, any]) => (
                                    <div key={name} className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">{name}</h4>
                                        <p className="text-sm text-gray-600">
                                            {schema.description || `${name} object schema`}
                                        </p>
                                        {schema.type && (
                                            <span className="inline-block mt-2 bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded">
                                                Type: {schema.type}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Real MQTT/AsyncAPI UI Component
const MqttUI: React.FC<MqttUIProps> = ({ spec, onClose, isFullscreen = false }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [parsedSpec, setParsedSpec] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        const parseSpec = async () => {
            try {
                let parsed;
                if (spec.trim().startsWith('{')) {
                    // JSON format
                    parsed = JSON.parse(spec);
                } else {
                    // YAML format - simplified parsing for demo
                    const lines = spec.split('\n');
                    parsed = {
                        asyncapi: '2.6.0',
                        info: { title: 'MQTT API', version: '1.0.0' },
                        servers: {},
                        channels: {}
                    };

                    // Simple YAML parsing for channels
                    let inChannels = false;
                    let currentChannel = '';

                    lines.forEach(line => {
                        if (line.trim() === 'channels:') {
                            inChannels = true;
                            return;
                        }

                        if (inChannels && line.match(/^  [\w\/]+:/)) {
                            currentChannel = line.trim().replace(':', '');
                            parsed.channels[currentChannel] = {
                                description: `MQTT channel: ${currentChannel}`,
                                subscribe: {
                                    message: {
                                        name: `${currentChannel}Message`,
                                        title: `${currentChannel} Message`,
                                        payload: { type: 'object' }
                                    }
                                }
                            };
                        }
                    });
                }

                setParsedSpec(parsed);
                setError(null);
            } catch (err) {
                setError('Failed to parse AsyncAPI specification');
                console.error('Spec parsing error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        parseSpec();
    }, [spec]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    <p className="text-gray-600">Loading AsyncAPI Specification...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <div>
                        <h3 className="font-semibold text-gray-900">Error Loading Specification</h3>
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`h-full ${isFullscreen ? 'min-h-screen' : ''}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-purple-50">
                <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6 text-purple-600" />
                    <div>
                        <h3 className="font-semibold text-purple-800">
                            {parsedSpec?.info?.title || 'MQTT API Documentation'}
                        </h3>
                        <p className="text-sm text-purple-700">
                            Version {parsedSpec?.info?.version || '1.0.0'} • AsyncAPI {parsedSpec?.asyncapi || '2.6.0'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {isFullscreen && (
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* AsyncAPI Content */}
            <div className={`p-6 bg-white overflow-y-auto ${isFullscreen ? 'max-h-[calc(100vh-120px)]' : 'max-h-[calc(80vh-200px)]'}`}>
                <div className="space-y-6">
                    {/* API Info */}
                    <div className="border-l-4 border-purple-500 pl-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {parsedSpec?.info?.title || 'MQTT API Documentation'}
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {parsedSpec?.info?.description || 'Event-driven API documentation for MQTT messaging'}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Version: {parsedSpec?.info?.version || '1.0.0'}</span>
                            <span>•</span>
                            <span>Protocol: MQTT</span>
                        </div>
                    </div>

                    {/* Servers */}
                    {parsedSpec?.servers && Object.keys(parsedSpec.servers).length > 0 && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <h3 className="font-semibold text-purple-900 mb-2">MQTT Brokers</h3>
                            {Object.entries(parsedSpec.servers).map(([name, server]: [string, any]) => (
                                <div key={name} className="flex items-center space-x-2 text-sm mb-2">
                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-mono">
                                        {server.url || `mqtt://broker.example.com:1883`}
                                    </span>
                                    <span className="text-purple-700">
                                        {server.description || name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Channels */}
                    {parsedSpec?.channels && Object.keys(parsedSpec.channels).length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">MQTT Channels</h3>

                            {Object.entries(parsedSpec.channels).map(([channelName, channel]: [string, any]) => (
                                <div key={channelName} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                        <div className="flex items-center space-x-3">
                                            <h4 className="font-mono text-sm font-semibold text-gray-900">{channelName}</h4>
                                            <div className="flex space-x-2">
                                                {channel.subscribe && (
                                                    <span className="bg-purple-500 text-white px-2 py-1 text-xs rounded font-medium">
                                                        SUBSCRIBE
                                                    </span>
                                                )}
                                                {channel.publish && (
                                                    <span className="bg-orange-500 text-white px-2 py-1 text-xs rounded font-medium">
                                                        PUBLISH
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        {channel.description && (
                                            <p className="text-gray-600 text-sm mb-4">{channel.description}</p>
                                        )}

                                        {/* Subscribe Operation */}
                                        {channel.subscribe && (
                                            <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                                                <h5 className="font-medium text-purple-900 mb-2 flex items-center">
                                                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                                    Subscribe Operation
                                                </h5>
                                                <p className="text-sm text-purple-700 mb-2">
                                                    Listen for messages on this channel
                                                </p>
                                                {channel.subscribe.message && (
                                                    <div className="bg-white p-2 rounded border">
                                                        <span className="text-xs font-medium text-gray-500">Message Type:</span>
                                                        <p className="text-sm font-mono text-gray-900">
                                                            {channel.subscribe.message.name || 'Message'}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Publish Operation */}
                                        {channel.publish && (
                                            <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                                <h5 className="font-medium text-orange-900 mb-2 flex items-center">
                                                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                                    Publish Operation
                                                </h5>
                                                <p className="text-sm text-orange-700 mb-2">
                                                    Send messages to this channel
                                                </p>
                                                {channel.publish.message && (
                                                    <div className="bg-white p-2 rounded border">
                                                        <span className="text-xs font-medium text-gray-500">Message Type:</span>
                                                        <p className="text-sm font-mono text-gray-900">
                                                            {channel.publish.message.name || 'Message'}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Parameters */}
                                        {channel.parameters && Object.keys(channel.parameters).length > 0 && (
                                            <div className="mb-4">
                                                <h5 className="font-medium text-gray-900 mb-2">Parameters:</h5>
                                                <div className="space-y-2">
                                                    {Object.entries(channel.parameters).map(([paramName, param]: [string, any]) => (
                                                        <div key={paramName} className="flex items-center space-x-2 text-sm">
                                                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-mono">
                                                                {paramName}
                                                            </span>
                                                            <span className="text-gray-600">
                                                                {param.description || 'No description'}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Message Schemas */}
                    {parsedSpec?.components?.messages && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Message Schemas</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(parsedSpec.components.messages).map(([name, message]: [string, any]) => (
                                    <div key={name} className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">{name}</h4>
                                        <p className="text-sm text-gray-600">
                                            {message.description || `${name} message schema`}
                                        </p>
                                        {message.payload && (
                                            <span className="inline-block mt-2 bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded">
                                                Payload Type: {message.payload.type || 'object'}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Code Viewer Component for Raw Spec Display
const CodeViewer: React.FC<{
    title: string;
    filename: string;
    content: string;
    language: string;
    icon: React.ReactNode;
}> = ({ title, filename, content, language, icon }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy content:', error);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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
            <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {icon}
                        <div>
                            <CardTitle className="text-base">{title}</CardTitle>
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
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDownload}
                            leftIcon={<Download className="w-4 h-4" />}
                        >
                            Download
                        </Button>
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
            </CardHeader>

            {isExpanded && (
                <CardContent className="p-0">
                    <pre className="bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto max-h-96 overflow-y-auto">
                        <code className={`language-${language}`}>
                            {formatContent(content)}
                        </code>
                    </pre>
                </CardContent>
            )}
        </Card>
    );
};

// Main API Spec Viewer Component
const ApiSpecViewer: React.FC<ApiSpecViewerProps> = ({
                                                         spec,
                                                         type,
                                                         title,
                                                         className = ''
                                                     }) => {
    const [viewMode, setViewMode] = useState<'ui' | 'code'>('ui');
    const [showModal, setShowModal] = useState(false);

    const getLanguage = () => {
        if (spec.name.endsWith('.json')) return 'json';
        return 'yaml';
    };

    const getIcon = () => {
        if (type === 'swagger') {
            return <Code className="w-5 h-5 text-green-600" />;
        } else {
            return <FileText className="w-5 h-5 text-purple-600" />;
        }
    };

    const getHeaderColor = () => {
        if (type === 'swagger') {
            return 'bg-green-50 border-green-200';
        } else {
            return 'bg-purple-50 border-purple-200';
        }
    };

    const getTitleColor = () => {
        if (type === 'swagger') {
            return 'text-green-800';
        } else {
            return 'text-purple-800';
        }
    };

    const openFullscreen = () => {
        setShowModal(true);
    };

    return (
        <>
            <Card className={`${className} overflow-hidden`}>
                <CardHeader className={`${getHeaderColor()} border-b`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {getIcon()}
                            <div>
                                <CardTitle className={`text-base ${getTitleColor()}`}>{title}</CardTitle>
                                <p className="text-sm text-gray-600">{spec.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                                <button
                                    onClick={() => setViewMode('ui')}
                                    className={`px-3 py-1 text-sm font-medium transition-colors ${
                                        viewMode === 'ui'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    UI Preview
                                </button>
                                <button
                                    onClick={() => setViewMode('code')}
                                    className={`px-3 py-1 text-sm font-medium transition-colors ${
                                        viewMode === 'code'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Raw Code
                                </button>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={openFullscreen}
                                leftIcon={<Maximize2 className="w-4 h-4" />}
                            >
                                Fullscreen
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {viewMode === 'ui' ? (
                        <div className="h-96 overflow-hidden">
                            {type === 'swagger' ? (
                                <SwaggerUI spec={spec.content} onClose={() => {}} />
                            ) : (
                                <MqttUI spec={spec.content} onClose={() => {}} />
                            )}
                        </div>
                    ) : (
                        <div className="h-96 overflow-hidden">
                            <pre className="bg-gray-900 text-gray-100 p-4 text-sm overflow-auto h-full">
                                <code className={`language-${getLanguage()}`}>
                                    {spec.content}
                                </code>
                            </pre>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Fullscreen Modal - Much Larger */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title=""
                size="full"
                showCloseButton={false}
            >
                <div className="h-full w-full">
                    {type === 'swagger' ? (
                        <SwaggerUI spec={spec.content} onClose={() => setShowModal(false)} isFullscreen={true} />
                    ) : (
                        <MqttUI spec={spec.content} onClose={() => setShowModal(false)} isFullscreen={true} />
                    )}
                </div>
            </Modal>
        </>
    );
};

export default ApiSpecViewer;
export { SwaggerUI, MqttUI, CodeViewer };