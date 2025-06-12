import React, { useState, useEffect } from 'react';
import {
    Code,
    Copy,
    Download,
    ExternalLink,
    ChevronDown,
    ChevronRight,
    AlertCircle,
    Eye,
    Search,
    Filter
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface SwaggerViewerProps {
    spec: string;
    onClose?: () => void;
    isFullscreen?: boolean;
    className?: string;
}

interface ParsedSwaggerSpec {
    openapi: string;
    info: {
        title: string;
        version: string;
        description?: string;
        contact?: {
            name?: string;
            email?: string;
        };
    };
    servers?: Array<{
        url: string;
        description?: string;
    }>;
    tags?: Array<{
        name: string;
        description?: string;
    }>;
    paths: Record<string, any>;
    components?: {
        securitySchemes?: any;
        schemas?: any;
    };
}

const SwaggerViewer: React.FC<SwaggerViewerProps> = ({
                                                         spec,
                                                         onClose,
                                                         isFullscreen = false,
                                                         className = ''
                                                     }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [parsedSpec, setParsedSpec] = useState<ParsedSwaggerSpec | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set());
    const [selectedTag, setSelectedTag] = useState<string>('all');

    useEffect(() => {
        parseSpecification();
    }, [spec]);

    const parseSpecification = async () => {
        try {
            let parsed: ParsedSwaggerSpec;
            if (spec.trim().startsWith('{')) {
                parsed = JSON.parse(spec);
            } else {
                // Create comprehensive example for YAML specs
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
                    paths: generateExamplePaths()
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
            setError('Failed to parse OpenAPI specification');
            console.error('Spec parsing error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const generateExamplePaths = () => ({
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
                                    file: { type: 'string', format: 'binary' }
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
        }
    });

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

    const methodColors: Record<string, string> = {
        get: 'bg-blue-500 text-white',
        post: 'bg-green-500 text-white',
        put: 'bg-orange-500 text-white',
        delete: 'bg-red-500 text-white',
        patch: 'bg-purple-500 text-white'
    };

    if (isLoading) {
        return (
            <div className={`flex items-center justify-center h-96 ${className}`}>
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    <p className="text-gray-600">Loading API Specification...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex items-center justify-center h-96 ${className}`}>
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
        <div className={`h-full bg-gray-50 ${className}`}>
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
                                        <a
                                            href={`mailto:${parsedSpec.info.contact.email}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {parsedSpec.info.contact.email}
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<ExternalLink className="w-4 h-4" />}
                        >
                            Try in Swagger Editor
                        </Button>
                        {isFullscreen && onClose && (
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                <span className="sr-only">Close</span>
                                ×
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
            <div className="overflow-y-auto" style={{ height: isFullscreen ? 'calc(100vh - 200px)' : '60vh' }}>
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

export default SwaggerViewer;