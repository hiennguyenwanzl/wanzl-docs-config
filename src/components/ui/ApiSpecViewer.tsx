import React, { useState, useEffect } from 'react';
import {
    Code,
    FileText,
    Copy,
    ExternalLink,
    ChevronDown,
    ChevronRight,
    AlertCircle,
    Eye,
    Download,
    Maximize2
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
}

interface MqttUIProps {
    spec: string;
    onClose: () => void;
}

// Swagger UI Component (Mock implementation)
const SwaggerUI: React.FC<SwaggerUIProps> = ({ spec, onClose }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const openInSwaggerEditor = () => {
        try {
            // Create a blob URL for the YAML content
            const blob = new Blob([spec], { type: 'application/yaml' });
            const url = URL.createObjectURL(blob);

            // Open Swagger Editor with the spec
            const swaggerEditorUrl = `https://editor.swagger.io/?url=${encodeURIComponent(url)}`;
            window.open(swaggerEditorUrl, '_blank');

            // Clean up the blob URL after a delay
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (error) {
            console.error('Failed to open in Swagger Editor:', error);
            alert('Failed to open in Swagger Editor');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    <p className="text-gray-600">Loading Swagger UI...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-green-50">
                <div className="flex items-center space-x-3">
                    <Code className="w-6 h-6 text-green-600" />
                    <div>
                        <h3 className="font-semibold text-green-800">Swagger UI Preview</h3>
                        <p className="text-sm text-green-700">Interactive API Documentation</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={openInSwaggerEditor}
                        leftIcon={<ExternalLink className="w-4 h-4" />}
                    >
                        Open in Editor
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        ✕
                    </Button>
                </div>
            </div>

            {/* Mock Swagger UI Content */}
            <div className="p-6 bg-white overflow-y-auto max-h-[calc(80vh-200px)]">
                <div className="space-y-6">
                    {/* API Info */}
                    <div className="border-l-4 border-green-500 pl-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sample API v1.0.0</h2>
                        <p className="text-gray-600 mb-4">Interactive API documentation powered by OpenAPI specification</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Base URL: https://api.example.com/v1</span>
                            <span>•</span>
                            <span>Format: OpenAPI 3.0.3</span>
                        </div>
                    </div>

                    {/* Mock Endpoints */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Endpoints</h3>

                        {/* GET Endpoint */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="flex items-center space-x-3 p-4 bg-blue-50 border-b border-blue-200">
                                <span className="bg-blue-500 text-white px-3 py-1 text-sm rounded font-mono">GET</span>
                                <span className="font-mono text-gray-800">/transactions</span>
                                <span className="text-gray-600">List transactions</span>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-700 mb-3">Retrieve a list of all transactions with pagination support</p>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Try it out
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        View Schema
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* POST Endpoint */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="flex items-center space-x-3 p-4 bg-green-50 border-b border-green-200">
                                <span className="bg-green-500 text-white px-3 py-1 text-sm rounded font-mono">POST</span>
                                <span className="font-mono text-gray-800">/transactions</span>
                                <span className="text-gray-600">Create a new transaction</span>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-700 mb-3">Create a new payment transaction with the provided details</p>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Try it out
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        View Schema
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* GET by ID Endpoint */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="flex items-center space-x-3 p-4 bg-blue-50 border-b border-blue-200">
                                <span className="bg-blue-500 text-white px-3 py-1 text-sm rounded font-mono">GET</span>
                                <span className="font-mono text-gray-800">/transactions/{`{id}`}</span>
                                <span className="text-gray-600">Get transaction by ID</span>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-700 mb-3">Retrieve a specific transaction by its unique identifier</p>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Try it out
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        View Schema
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Schemas Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Schemas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Transaction</h4>
                                <p className="text-sm text-gray-600">Main transaction object with all properties</p>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">CreateTransactionRequest</h4>
                                <p className="text-sm text-gray-600">Request payload for creating transactions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// MQTT/AsyncAPI UI Component (Mock implementation)
const MqttUI: React.FC<MqttUIProps> = ({ spec, onClose }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const openInAsyncAPIStudio = () => {
        try {
            // Encode the spec content and open in AsyncAPI Studio
            const encodedSpec = btoa(spec);
            const asyncApiUrl = `https://studio.asyncapi.com/?url=data:application/yaml;base64,${encodedSpec}`;
            window.open(asyncApiUrl, '_blank');
        } catch (error) {
            console.error('Failed to open in AsyncAPI Studio:', error);
            alert('Failed to open in AsyncAPI Studio');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    <p className="text-gray-600">Loading AsyncAPI UI...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-purple-50">
                <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6 text-purple-600" />
                    <div>
                        <h3 className="font-semibold text-purple-800">AsyncAPI Preview</h3>
                        <p className="text-sm text-purple-700">Event-driven API Documentation</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={openInAsyncAPIStudio}
                        leftIcon={<ExternalLink className="w-4 h-4" />}
                    >
                        Open in Studio
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        ✕
                    </Button>
                </div>
            </div>

            {/* Mock AsyncAPI Content */}
            <div className="p-6 bg-white overflow-y-auto max-h-[calc(80vh-200px)]">
                <div className="space-y-6">
                    {/* API Info */}
                    <div className="border-l-4 border-purple-500 pl-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sample MQTT API v1.0.0</h2>
                        <p className="text-gray-600 mb-4">Event-driven API documentation for MQTT messaging</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Broker: mqtt://broker.example.com:1883</span>
                            <span>•</span>
                            <span>Format: AsyncAPI 2.6.0</span>
                        </div>
                    </div>

                    {/* Mock Channels */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Channels</h3>

                        {/* Subscribe Channel */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="flex items-center space-x-3 p-4 bg-purple-50 border-b border-purple-200">
                                <span className="bg-purple-500 text-white px-3 py-1 text-sm rounded font-mono">SUB</span>
                                <span className="font-mono text-gray-800">transactions/created</span>
                                <span className="text-gray-600">Transaction created events</span>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-700 mb-3">Subscribe to receive notifications when new transactions are created</p>
                                <div className="bg-gray-50 p-3 rounded text-sm">
                                    <strong>Message Schema:</strong> TransactionCreated
                                </div>
                            </div>
                        </div>

                        {/* Publish Channel */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="flex items-center space-x-3 p-4 bg-orange-50 border-b border-orange-200">
                                <span className="bg-orange-500 text-white px-3 py-1 text-sm rounded font-mono">PUB</span>
                                <span className="font-mono text-gray-800">transactions/updated</span>
                                <span className="text-gray-600">Transaction updated events</span>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-700 mb-3">Publish notifications when transactions are updated</p>
                                <div className="bg-gray-50 p-3 rounded text-sm">
                                    <strong>Message Schema:</strong> TransactionUpdated
                                </div>
                            </div>
                        </div>

                        {/* System Status Channel */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="flex items-center space-x-3 p-4 bg-blue-50 border-b border-blue-200">
                                <span className="bg-blue-500 text-white px-3 py-1 text-sm rounded font-mono">SUB</span>
                                <span className="font-mono text-gray-800">system/status</span>
                                <span className="text-gray-600">System status updates</span>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-700 mb-3">Subscribe to receive system health and status updates</p>
                                <div className="bg-gray-50 p-3 rounded text-sm">
                                    <strong>Message Schema:</strong> SystemStatus
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message Schemas */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Message Schemas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">TransactionCreated</h4>
                                <p className="text-sm text-gray-600">Event payload when a transaction is created</p>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">TransactionUpdated</h4>
                                <p className="text-sm text-gray-600">Event payload when a transaction is updated</p>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">SystemStatus</h4>
                                <p className="text-sm text-gray-600">System health and status information</p>
                            </div>
                        </div>
                    </div>
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

            {/* Fullscreen Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={`${title} - ${spec.name}`}
                size="full"
            >
                <div className="h-full">
                    {type === 'swagger' ? (
                        <SwaggerUI spec={spec.content} onClose={() => setShowModal(false)} />
                    ) : (
                        <MqttUI spec={spec.content} onClose={() => setShowModal(false)} />
                    )}
                </div>
            </Modal>
        </>
    );
};

export default ApiSpecViewer;
export { SwaggerUI, MqttUI, CodeViewer };