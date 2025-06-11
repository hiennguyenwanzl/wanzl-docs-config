import React, { useState, useEffect } from 'react';
import {
    Code,
    FileText,
    Copy,
    Download,
    Maximize2,
    X,
    ExternalLink,
    ChevronDown,
    ChevronRight,
    AlertCircle,
    Eye,
    Search,
    Filter,
    Bookmark
} from 'lucide-react';
import Button from '../ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import Modal from '../ui/Modal';
import Input from '../ui/Input';

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

// Enhanced Swagger UI Component
const SwaggerUI: React.FC<{
    spec: string;
    onClose: () => void;
    isFullscreen?: boolean;
}> = ({ spec, onClose, isFullscreen = false }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [parsedSpec, setParsedSpec] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set());
    const [selectedTag, setSelectedTag] = useState<string>('all');

    useEffect(() => {
        const parseSpec = async () => {
            try {
                let parsed;
                if (spec.trim().startsWith('{')) {
                    parsed = JSON.parse(spec);
                } else {
                    // For demo purposes, create a comprehensive example spec
                    parsed = {
                        openapi: '3.0.3',
                        info: {
                            title: 'FastLaner Cloud Service API',
                            version: '1.0.1',
                            description: 'API for FastLaner Cloud Service providing transaction processing, receipt generation, and real-time analytics.',
                            contact: {
                                name: 'API Support',
                                email: 'api-support@wanzl.com'
                            }
                        },
                        servers: [
                            { url: 'https://api.wanzl.com/fastlaner/v1', description: 'Production' },
                            { url: 'https://staging-api.wanzl.com/fastlaner/v1', description: 'Staging' }
                        ],
                        tags: [
                            { name: 'APK', description: 'APK file management' },
                            { name: 'Auth', description: 'Authentication endpoints' },
                            { name: 'Groups', description: 'Group management' },
                            { name: 'Trolley', description: 'Trolley operations' }
                        ],
                        paths: {
                            '/api/v1/apks/upload-apk/{groupId}': {
                                post: {
                                    tags: ['APK'],
                                    summary: 'Upload APK file',
                                    description: 'Upload an APK file for a specific group',
                                    parameters: [
                                        {
                                            name: 'groupId',
                                            in: 'path',
                                            required: true,
                                            schema: { type: 'string' },
                                            description: 'Group identifier'
                                        }
                                    ],
                                    requestBody: {
                                        required: true,
                                        content: {
                                            'multipart/form-data': {
                                                schema: {
                                                    type: 'object',
                                                    properties: {
                                                        file: {
                                                            type: 'string',
                                                            format: 'binary'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    responses: {
                                        '200': {
                                            description: 'APK uploaded successfully',
                                            content: {
                                                'application/json': {
                                                    schema: {
                                                        type: 'object',
                                                        properties: {
                                                            success: { type: 'boolean' },
                                                            message: { type: 'string' },
                                                            apkId: { type: 'string' }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        '400': { description: 'Bad request' },
                                        '401': { description: 'Unauthorized' }
                                    }
                                }
                            },
                            '/api/v1/apks': {
                                get: {
                                    tags: ['APK'],
                                    summary: 'Search APKs information',
                                    description: 'Retrieve information about APK files',
                                    parameters: [
                                        {
                                            name: 'search',
                                            in: 'query',
                                            schema: { type: 'string' },
                                            description: 'Search term'
                                        }
                                    ],
                                    responses: {
                                        '200': {
                                            description: 'APK information retrieved',
                                            content: {
                                                'application/json': {
                                                    schema: {
                                                        type: 'array',
                                                        items: {
                                                            type: 'object',
                                                            properties: {
                                                                id: { type: 'string' },
                                                                name: { type: 'string' },
                                                                version: { type: 'string' },
                                                                size: { type: 'integer' }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            '/api/v1/auth/refresh-token': {
                                post: {
                                    tags: ['Auth'],
                                    summary: 'Refresh token',
                                    description: 'Refresh authentication token',
                                    requestBody: {
                                        required: true,
                                        content: {
                                            'application/json': {
                                                schema: {
                                                    type: 'object',
                                                    properties: {
                                                        refreshToken: { type: 'string' }
                                                    },
                                                    required: ['refreshToken']
                                                }
                                            }
                                        }
                                    },
                                    responses: {
                                        '200': {
                                            description: 'Token refreshed successfully',
                                            content: {
                                                'application/json': {
                                                    schema: {
                                                        type: 'object',
                                                        properties: {
                                                            accessToken: { type: 'string' },
                                                            refreshToken: { type: 'string' },
                                                            expiresIn: { type: 'integer' }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            '/api/v1/groups': {
                                get: {
                                    tags: ['Groups'],
                                    summary: 'Get available groups',
                                    responses: {
                                        '200': {
                                            description: 'Groups retrieved successfully',
                                            content: {
                                                'application/json': {
                                                    schema: {
                                                        type: 'array',
                                                        items: {
                                                            type: 'object',
                                                            properties: {
                                                                id: { type: 'string' },
                                                                name: { type: 'string' },
                                                                description: { type: 'string' }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                post: {
                                    tags: ['Groups'],
                                    summary: 'Create new group',
                                    requestBody: {
                                        required: true,
                                        content: {
                                            'application/json': {
                                                schema: {
                                                    type: 'object',
                                                    properties: {
                                                        name: { type: 'string' },
                                                        description: { type: 'string' }
                                                    },
                                                    required: ['name']
                                                }
                                            }
                                        }
                                    },
                                    responses: {
                                        '201': { description: 'Group created successfully' }
                                    }
                                }
                            }
                        },
                        components: {
                            securitySchemes: {
                                bearerAuth: {
                                    type: 'http',
                                    scheme: 'bearer',
                                    bearerFormat: 'JWT'
                                }
                            },
                            schemas: {
                                Error: {
                                    type: 'object',
                                    properties: {
                                        code: { type: 'integer' },
                                        message: { type: 'string' }
                                    }
                                }
                            }
                        }
                    };
                }

                setParsedSpec(parsed);
                setError(null);

                // Auto-expand first few endpoints
                if (parsed.paths) {
                    const pathKeys = Object.keys(parsed.paths).slice(0, 2);
                    setExpandedEndpoints(new Set(pathKeys));
                }
            } catch (err) {
                setError('Failed to parse API specification');
                console.error('Spec parsing error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        parseSpec();
    }, [spec]);

    const toggleEndpoint = (path: string) => {
        setExpandedEndpoints(prev => {
            const newSet = new Set(prev);
            if (newSet.has(path)) {
                newSet.delete(path);
            } else {
                newSet.add(path);
            }
            return newSet;
        });
    };

    const filteredPaths = () => {
        if (!parsedSpec?.paths) return {};

        let paths = parsedSpec.paths;

        // Filter by tag
        if (selectedTag !== 'all') {
            paths = Object.fromEntries(
                Object.entries(paths).filter(([path, methods]: [string, any]) =>
                    Object.values(methods).some((method: any) =>
                        method.tags?.includes(selectedTag)
                    )
                )
            );
        }

        // Filter by search term
        if (searchTerm) {
            paths = Object.fromEntries(
                Object.entries(paths).filter(([path, methods]: [string, any]) =>
                    path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    Object.values(methods).some((method: any) =>
                        method.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        method.description?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                )
            );
        }

        return paths;
    };

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

    const methodColors: Record<string, string> = {
        get: 'bg-blue-500 text-white',
        post: 'bg-green-500 text-white',
        put: 'bg-orange-500 text-white',
        delete: 'bg-red-500 text-white',
        patch: 'bg-purple-500 text-white'
    };

    return (
        <div className={`h-full ${isFullscreen ? 'min-h-screen' : ''} bg-gray-50`}>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                        <Code className="w-8 h-8 text-green-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {parsedSpec?.info?.title || 'API Documentation'}
                            </h1>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>Version {parsedSpec?.info?.version || '1.0.0'}</span>
                                <span>•</span>
                                <span>OpenAPI {parsedSpec?.openapi || '3.0.0'}</span>
                                {parsedSpec?.info?.contact?.email && (
                                    <>
                                        <span>•</span>
                                        <a href={`mailto:${parsedSpec.info.contact.email}`} className="text-blue-600 hover:underline">
                                            {parsedSpec.info.contact.email}
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button variant="outline" size="sm" leftIcon={<ExternalLink className="w-4 h-4" />}>
                            Try in Swagger Editor
                        </Button>
                        {isFullscreen && (
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                <X className="w-5 h-5" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between p-4 bg-gray-50">
                    <div className="flex items-center space-x-4">
                        <Input
                            placeholder="Search endpoints..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            leftIcon={<Search className="w-4 h-4" />}
                            className="w-64"
                        />
                        <select
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                            <option value="all">All Tags</option>
                            {parsedSpec?.tags?.map((tag: any) => (
                                <option key={tag.name} value={tag.name}>{tag.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedEndpoints(new Set(Object.keys(parsedSpec?.paths || {})))}
                        >
                            Expand All
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedEndpoints(new Set())}
                        >
                            Collapse All
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className={`${isFullscreen ? 'h-[calc(100vh-200px)]' : 'max-h-[60vh]'} overflow-y-auto`}>
                <div className="max-w-6xl mx-auto p-6">
                    {/* API Info */}
                    {parsedSpec?.info?.description && (
                        <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                            <p className="text-gray-700 leading-relaxed">{parsedSpec.info.description}</p>
                        </div>
                    )}

                    {/* Servers */}
                    {parsedSpec?.servers && parsedSpec.servers.length > 0 && (
                        <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Servers</h2>
                            <div className="space-y-3">
                                {parsedSpec.servers.map((server: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                        <div>
                                            <code className="text-sm font-mono text-blue-800 bg-blue-100 px-2 py-1 rounded">
                                                {server.url}
                                            </code>
                                            {server.description && (
                                                <p className="text-sm text-blue-700 mt-1">{server.description}</p>
                                            )}
                                        </div>
                                        <Button variant="outline" size="sm">
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Endpoints */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">API Endpoints</h2>

                        {Object.entries(filteredPaths()).map(([path, methods]: [string, any]) => (
                            <div key={path} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => toggleEndpoint(path)}
                                    className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            {expandedEndpoints.has(path) ? (
                                                <ChevronDown className="w-5 h-5 text-gray-400" />
                                            ) : (
                                                <ChevronRight className="w-5 h-5 text-gray-400" />
                                            )}
                                            <code className="font-mono text-sm text-gray-900">{path}</code>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {Object.keys(methods).map(method => (
                                                <span
                                                    key={method}
                                                    className={`px-2 py-1 text-xs font-semibold rounded uppercase ${
                                                        methodColors[method] || 'bg-gray-500 text-white'
                                                    }`}
                                                >
                                                    {method}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </button>

                                {expandedEndpoints.has(path) && (
                                    <div className="border-t border-gray-200">
                                        {Object.entries(methods).map(([method, details]: [string, any]) => (
                                            <div key={method} className="p-6 border-b border-gray-100 last:border-b-0">
                                                <div className="flex items-start space-x-4 mb-4">
                                                    <span className={`px-3 py-1 text-sm font-semibold rounded uppercase ${
                                                        methodColors[method] || 'bg-gray-500 text-white'
                                                    }`}>
                                                        {method}
                                                    </span>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                            {details.summary || `${method.toUpperCase()} ${path}`}
                                                        </h3>
                                                        {details.description && (
                                                            <p className="text-gray-600 mb-4">{details.description}</p>
                                                        )}
                                                    </div>
                                                    <Button variant="outline" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                                                        Try it out
                                                    </Button>
                                                </div>

                                                {/* Parameters */}
                                                {details.parameters && details.parameters.length > 0 && (
                                                    <div className="mb-6">
                                                        <h4 className="font-semibold text-gray-900 mb-3">Parameters</h4>
                                                        <div className="overflow-x-auto">
                                                            <table className="min-w-full divide-y divide-gray-200">
                                                                <thead className="bg-gray-50">
                                                                <tr>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">In</th>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Required</th>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody className="bg-white divide-y divide-gray-200">
                                                                {details.parameters.map((param: any, idx: number) => (
                                                                    <tr key={idx}>
                                                                        <td className="px-4 py-2 text-sm font-mono text-gray-900">{param.name}</td>
                                                                        <td className="px-4 py-2 text-sm text-gray-600">{param.in}</td>
                                                                        <td className="px-4 py-2 text-sm text-gray-600">{param.schema?.type}</td>
                                                                        <td className="px-4 py-2 text-sm">
                                                                            {param.required ? (
                                                                                <span className="text-red-600 font-semibold">Required</span>
                                                                            ) : (
                                                                                <span className="text-gray-500">Optional</span>
                                                                            )}
                                                                        </td>
                                                                        <td className="px-4 py-2 text-sm text-gray-600">{param.description}</td>
                                                                    </tr>
                                                                ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Responses */}
                                                {details.responses && (
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 mb-3">Responses</h4>
                                                        <div className="space-y-3">
                                                            {Object.entries(details.responses).map(([code, response]: [string, any]) => (
                                                                <div key={code} className="border border-gray-200 rounded-lg p-4">
                                                                    <div className="flex items-center space-x-3 mb-2">
                                                                        <span className={`px-2 py-1 text-sm font-mono rounded ${
                                                                            code.startsWith('2') ? 'bg-green-100 text-green-800' :
                                                                                code.startsWith('4') ? 'bg-yellow-100 text-yellow-800' :
                                                                                    code.startsWith('5') ? 'bg-red-100 text-red-800' :
                                                                                        'bg-gray-100 text-gray-800'
                                                                        }`}>
                                                                            {code}
                                                                        </span>
                                                                        <span className="text-gray-700">{response.description}</span>
                                                                    </div>
                                                                    {response.content && (
                                                                        <div className="mt-3">
                                                                            <h5 className="text-sm font-medium text-gray-900 mb-2">Response Schema</h5>
                                                                            <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                                                                                {JSON.stringify(response.content, null, 2)}
                                                                            </pre>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Enhanced MQTT UI Component (similar structure but for MQTT/AsyncAPI)
const MqttUI: React.FC<{
    spec: string;
    onClose: () => void;
    isFullscreen?: boolean;
}> = ({ spec, onClose, isFullscreen = false }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [parsedSpec, setParsedSpec] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const parseSpec = async () => {
            try {
                let parsed;
                if (spec.trim().startsWith('{')) {
                    parsed = JSON.parse(spec);
                } else {
                    // Create example MQTT spec
                    parsed = {
                        asyncapi: '2.6.0',
                        info: {
                            title: 'AI Service MQTT API',
                            version: '2.0.0',
                            description: 'MQTT API for AI Service providing real-time frame processing and event notifications'
                        },
                        servers: {
                            broker: {
                                url: 'mqtt://localhost:1883',
                                protocol: 'mqtt',
                                description: 'Local MQTT broker'
                            }
                        },
                        channels: {
                            'wz1/smarttrolley/aiservice/v1/call': {
                                description: 'Channel for requesting actions from the AI Service',
                                subscribe: {
                                    operationId: 'receiveCallMessage',
                                    message: {
                                        name: 'CallMessage',
                                        title: 'Call Message',
                                        summary: 'Message to request actions from AI Service',
                                        payload: {
                                            type: 'object',
                                            properties: {
                                                timestamp: { type: 'string', format: 'date-time' },
                                                messageType: { type: 'string', enum: ['sendFrame'] }
                                            }
                                        }
                                    }
                                }
                            },
                            'wz1/smarttrolley/aiservice/v1/frame': {
                                description: 'Channel for returning requested frames',
                                publish: {
                                    operationId: 'sendFrameMessage',
                                    message: {
                                        name: 'FrameMessage',
                                        title: 'Frame Message',
                                        summary: 'Response with the current frame from AI Service',
                                        payload: {
                                            type: 'object',
                                            properties: {
                                                timestamp: { type: 'string', format: 'date-time' },
                                                frame: { type: 'string', format: 'base64' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    };
                }

                setParsedSpec(parsed);
                setError(null);
            } catch (err) {
                setError('Failed to parse AsyncAPI specification');
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
        <div className={`h-full ${isFullscreen ? 'min-h-screen' : ''} bg-gray-50`}>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center space-x-4">
                        <FileText className="w-8 h-8 text-purple-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {parsedSpec?.info?.title || 'MQTT API Documentation'}
                            </h1>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>Version {parsedSpec?.info?.version || '1.0.0'}</span>
                                <span>•</span>
                                <span>AsyncAPI {parsedSpec?.asyncapi || '2.6.0'}</span>
                                <span>•</span>
                                <span>Protocol: MQTT</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button variant="outline" size="sm" leftIcon={<ExternalLink className="w-4 h-4" />}>
                            Open in AsyncAPI Studio
                        </Button>
                        {isFullscreen && (
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                <X className="w-5 h-5" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className={`${isFullscreen ? 'h-[calc(100vh-150px)]' : 'max-h-[60vh]'} overflow-y-auto`}>
                <div className="max-w-6xl mx-auto p-6">
                    {/* API Info */}
                    {parsedSpec?.info?.description && (
                        <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                            <p className="text-gray-700 leading-relaxed">{parsedSpec.info.description}</p>
                        </div>
                    )}

                    {/* Servers */}
                    {parsedSpec?.servers && (
                        <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">MQTT Brokers</h2>
                            <div className="space-y-3">
                                {Object.entries(parsedSpec.servers).map(([name, server]: [string, any]) => (
                                    <div key={name} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                        <div>
                                            <code className="text-sm font-mono text-purple-800 bg-purple-100 px-2 py-1 rounded">
                                                {server.url}
                                            </code>
                                            {server.description && (
                                                <p className="text-sm text-purple-700 mt-1">{server.description}</p>
                                            )}
                                        </div>
                                        <Button variant="outline" size="sm">
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Channels */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">MQTT Channels</h2>

                        {Object.entries(parsedSpec?.channels || {}).map(([channelName, channel]: [string, any]) => (
                            <div key={channelName} className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 font-mono">{channelName}</h3>
                                        {channel.subscribe && (
                                            <span className="bg-purple-500 text-white px-3 py-1 text-xs rounded font-medium">
                                                SUBSCRIBE
                                            </span>
                                        )}
                                        {channel.publish && (
                                            <span className="bg-orange-500 text-white px-3 py-1 text-xs rounded font-medium">
                                                PUBLISH
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Subscribe Operation */}
                                {channel.subscribe && (
                                    <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                                        <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                                            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                            Subscribe Operation
                                        </h4>
                                        <p className="text-sm text-purple-700 mb-3">
                                            Listen for messages on this channel
                                        </p>
                                        {channel.subscribe.message && (
                                            <div className="bg-white p-3 rounded border">
                                                <h5 className="text-sm font-medium text-gray-900 mb-2">Message Schema</h5>
                                                <div className="text-sm font-mono text-gray-700 mb-2">
                                                    {channel.subscribe.message.name || 'Message'}
                                                </div>
                                                <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                                                    {JSON.stringify(channel.subscribe.message.payload, null, 2)}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Publish Operation */}
                                {channel.publish && (
                                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                        <h4 className="font-semibold text-orange-900 mb-3 flex items-center">
                                            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                            Publish Operation
                                        </h4>
                                        <p className="text-sm text-orange-700 mb-3">
                                            Send messages to this channel
                                        </p>
                                        {channel.publish.message && (
                                            <div className="bg-white p-3 rounded border">
                                                <h5 className="text-sm font-medium text-gray-900 mb-2">Message Schema</h5>
                                                <div className="text-sm font-mono text-gray-700 mb-2">
                                                    {channel.publish.message.name || 'Message'}
                                                </div>
                                                <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                                                    {JSON.stringify(channel.publish.message.payload, null, 2)}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
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
    const [copied, setCopied] = useState(false);

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

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(spec.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy content:', error);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([spec.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = spec.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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
                                    Interactive
                                </button>
                                <button
                                    onClick={() => setViewMode('code')}
                                    className={`px-3 py-1 text-sm font-medium transition-colors ${
                                        viewMode === 'code'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Source
                                </button>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopy}
                                leftIcon={<Copy className="w-4 h-4" />}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDownload}
                                leftIcon={<Download className="w-4 h-4" />}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Download
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={openFullscreen}
                                leftIcon={<Maximize2 className="w-4 h-4" />}
                                className="text-gray-600 hover:text-gray-900"
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

            {/* Enhanced Fullscreen Modal */}
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