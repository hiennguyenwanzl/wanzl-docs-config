import React, { useState, useEffect } from 'react';
import {
    FileText,
    Copy,
    Download,
    ExternalLink,
    AlertCircle,
    Wifi
} from 'lucide-react';
import Button from '../ui/Button';

interface MqttViewerProps {
    spec: string;
    onClose?: () => void;
    isFullscreen?: boolean;
    className?: string;
}

interface ParsedMqttSpec {
    asyncapi: string;
    info: {
        title: string;
        version: string;
        description?: string;
    };
    servers?: Record<string, {
        url: string;
        protocol: string;
        description?: string;
    }>;
    channels: Record<string, {
        description?: string;
        subscribe?: {
            operationId?: string;
            message?: {
                name?: string;
                title?: string;
                summary?: string;
                payload?: any;
            };
        };
        publish?: {
            operationId?: string;
            message?: {
                name?: string;
                title?: string;
                summary?: string;
                payload?: any;
            };
        };
    }>;
}

const MqttViewer: React.FC<MqttViewerProps> = ({
                                                   spec,
                                                   onClose,
                                                   isFullscreen = false,
                                                   className = ''
                                               }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [parsedSpec, setParsedSpec] = useState<ParsedMqttSpec | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        parseSpecification();
    }, [spec]);

    const parseSpecification = async () => {
        try {
            let parsed: ParsedMqttSpec;
            if (spec.trim().startsWith('{')) {
                parsed = JSON.parse(spec);
            } else {
                // Create comprehensive example for YAML specs
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
                        },
                        production: {
                            url: 'mqtts://mqtt.wanzl.com:8883',
                            protocol: 'mqtts',
                            description: 'Production MQTT broker with TLS'
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
                                            timestamp: {
                                                type: 'string',
                                                format: 'date-time',
                                                description: 'Timestamp when the message was created'
                                            },
                                            messageType: {
                                                type: 'string',
                                                enum: ['sendFrame', 'getStatus', 'reset'],
                                                description: 'Type of action to perform'
                                            },
                                            parameters: {
                                                type: 'object',
                                                description: 'Additional parameters for the operation'
                                            }
                                        },
                                        required: ['timestamp', 'messageType']
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
                                            timestamp: {
                                                type: 'string',
                                                format: 'date-time',
                                                description: 'Timestamp when the frame was captured'
                                            },
                                            frame: {
                                                type: 'string',
                                                format: 'base64',
                                                description: 'Base64 encoded image frame'
                                            },
                                            metadata: {
                                                type: 'object',
                                                properties: {
                                                    width: { type: 'integer' },
                                                    height: { type: 'integer' },
                                                    format: { type: 'string', enum: ['jpeg', 'png'] }
                                                }
                                            }
                                        },
                                        required: ['timestamp', 'frame']
                                    }
                                }
                            }
                        },
                        'wz1/smarttrolley/aiservice/v1/status': {
                            description: 'Channel for system status updates',
                            publish: {
                                operationId: 'sendStatusMessage',
                                message: {
                                    name: 'StatusMessage',
                                    title: 'Status Message',
                                    summary: 'Current system status and health information',
                                    payload: {
                                        type: 'object',
                                        properties: {
                                            timestamp: { type: 'string', format: 'date-time' },
                                            status: {
                                                type: 'string',
                                                enum: ['online', 'offline', 'error', 'maintenance']
                                            },
                                            cpu_usage: { type: 'number', minimum: 0, maximum: 100 },
                                            memory_usage: { type: 'number', minimum: 0, maximum: 100 },
                                            uptime: { type: 'integer', description: 'Uptime in seconds' }
                                        },
                                        required: ['timestamp', 'status']
                                    }
                                }
                            }
                        },
                        'wz1/smarttrolley/aiservice/v1/errors': {
                            description: 'Channel for error notifications',
                            publish: {
                                operationId: 'sendErrorMessage',
                                message: {
                                    name: 'ErrorMessage',
                                    title: 'Error Message',
                                    summary: 'Error notifications from AI Service',
                                    payload: {
                                        type: 'object',
                                        properties: {
                                            timestamp: { type: 'string', format: 'date-time' },
                                            error_code: { type: 'string' },
                                            error_message: { type: 'string' },
                                            severity: {
                                                type: 'string',
                                                enum: ['low', 'medium', 'high', 'critical']
                                            },
                                            context: {
                                                type: 'object',
                                                description: 'Additional context about the error'
                                            }
                                        },
                                        required: ['timestamp', 'error_code', 'error_message', 'severity']
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
            console.error('MQTT spec parsing error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className={`flex items-center justify-center h-96 ${className}`}>
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    <p className="text-gray-600">Loading AsyncAPI Specification...</p>
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
                        <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<ExternalLink className="w-4 h-4" />}
                        >
                            Open in AsyncAPI Studio
                        </Button>
                        {isFullscreen && onClose && (
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                <span className="sr-only">Close</span>
                                ×
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto" style={{ height: isFullscreen ? 'calc(100vh - 150px)' : '60vh' }}>
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
                                            <div className="flex items-center space-x-2 mb-1">
                                                <Wifi className="w-4 h-4 text-purple-600" />
                                                <span className="font-medium text-purple-900">{name}</span>
                                                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                                                    {server.protocol?.toUpperCase()}
                                                </span>
                                            </div>
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
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Wifi className="w-5 h-5 text-purple-600" />
                                            <h3 className="text-lg font-semibold text-gray-900 font-mono break-all">
                                                {channelName}
                                            </h3>
                                        </div>
                                        {channel.description && (
                                            <p className="text-gray-600 text-sm mb-3">{channel.description}</p>
                                        )}
                                        <div className="flex items-center space-x-2">
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
                                            <div className="bg-white p-4 rounded border">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h5 className="text-sm font-medium text-gray-900">
                                                        {channel.subscribe.message.name || 'Message Schema'}
                                                    </h5>
                                                    {channel.subscribe.message.title && (
                                                        <span className="text-xs text-gray-500">
                                                            {channel.subscribe.message.title}
                                                        </span>
                                                    )}
                                                </div>
                                                {channel.subscribe.message.summary && (
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        {channel.subscribe.message.summary}
                                                    </p>
                                                )}
                                                <div className="bg-gray-50 p-3 rounded">
                                                    <h6 className="text-xs font-medium text-gray-700 mb-2">Payload Schema:</h6>
                                                    <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                                                        {JSON.stringify(channel.subscribe.message.payload, null, 2)}
                                                    </pre>
                                                </div>
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
                                            <div className="bg-white p-4 rounded border">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h5 className="text-sm font-medium text-gray-900">
                                                        {channel.publish.message.name || 'Message Schema'}
                                                    </h5>
                                                    {channel.publish.message.title && (
                                                        <span className="text-xs text-gray-500">
                                                            {channel.publish.message.title}
                                                        </span>
                                                    )}
                                                </div>
                                                {channel.publish.message.summary && (
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        {channel.publish.message.summary}
                                                    </p>
                                                )}
                                                <div className="bg-gray-50 p-3 rounded">
                                                    <h6 className="text-xs font-medium text-gray-700 mb-2">Payload Schema:</h6>
                                                    <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                                                        {JSON.stringify(channel.publish.message.payload, null, 2)}
                                                    </pre>
                                                </div>
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

export default MqttViewer;