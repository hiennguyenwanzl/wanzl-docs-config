import React, { useState, useEffect, useRef } from 'react';
import {
    FileText,
    Copy,
    Download,
    ExternalLink,
    AlertCircle,
    Wifi,
    Minimize2
} from 'lucide-react';
import Button from '../ui/Button';

interface MqttViewerProps {
    spec: string;
    onClose?: () => void;
    isFullscreen?: boolean;
    className?: string;
}

const MqttViewer: React.FC<MqttViewerProps> = ({
                                                   spec,
                                                   onClose,
                                                   isFullscreen = false,
                                                   className = ''
                                               }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [parsedSpec, setParsedSpec] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const asyncAPIRef = useRef<any>(null);

    useEffect(() => {
        loadAsyncAPIViewer();
    }, [spec]);

    const loadAsyncAPIViewer = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Parse the spec
            let specObject;
            if (typeof spec === 'string') {
                if (spec.trim().startsWith('{')) {
                    specObject = JSON.parse(spec);
                } else {
                    // For YAML, we'll use js-yaml parser via CDN
                    const yamlModule = await loadYAMLParser();
                    specObject = yamlModule.load(spec);
                }
            } else {
                specObject = spec;
            }

            setParsedSpec(specObject);

            // Load and initialize AsyncAPI Studio
            await loadAsyncAPILibrary();
            initializeAsyncAPI(specObject);

        } catch (err) {
            console.error('Failed to load AsyncAPI viewer:', err);
            setError('Failed to load MQTT API specification. Please check the format.');
        } finally {
            setIsLoading(false);
        }
    };

    const loadYAMLParser = async () => {
        return new Promise((resolve, reject) => {
            if ((window as any).jsyaml) {
                resolve((window as any).jsyaml);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js';
            script.onload = () => resolve((window as any).jsyaml);
            script.onerror = () => reject(new Error('Failed to load YAML parser'));
            document.head.appendChild(script);
        });
    };

    const loadAsyncAPILibrary = async () => {
        return new Promise((resolve, reject) => {
            if ((window as any).AsyncAPIStudio) {
                resolve((window as any).AsyncAPIStudio);
                return;
            }

            // Load AsyncAPI Web Component
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@asyncapi/web-component@1.0.0-next.54/lib/asyncapi-web-component.js';
            script.type = 'module';
            script.onload = () => {
                // Custom element will be available
                resolve(true);
            };
            script.onerror = () => {
                // Fallback to manual rendering
                console.warn('AsyncAPI Web Component failed to load, using fallback renderer');
                resolve(true);
            };
            document.head.appendChild(script);
        });
    };

    const initializeAsyncAPI = (specObject: any) => {
        if (!containerRef.current) return;

        try {
            // Clear previous content
            containerRef.current.innerHTML = '';

            // Check if AsyncAPI web component is available
            if (customElements.get('asyncapi-component')) {
                const asyncAPIElement = document.createElement('asyncapi-component');
                asyncAPIElement.setAttribute('schema', JSON.stringify(specObject));
                asyncAPIElement.setAttribute('config', JSON.stringify({
                    show: {
                        sidebar: true,
                        info: true,
                        servers: true,
                        operations: true,
                        messages: true,
                        schemas: true,
                        errors: false
                    },
                    expand: {
                        messageExamples: false,
                        schemaExamples: false
                    },
                    sidebar: {
                        showServers: true,
                        showOperations: true
                    }
                }));

                // Set full height to container
                asyncAPIElement.style.height = '100%';
                asyncAPIElement.style.width = '100%';

                containerRef.current.appendChild(asyncAPIElement);
            } else {
                // Fallback to custom renderer
                renderCustomAsyncAPI(specObject);
            }

        } catch (err) {
            console.error('Failed to initialize AsyncAPI viewer:', err);
            renderCustomAsyncAPI(specObject);
        }
    };

    const renderCustomAsyncAPI = (specObject: any) => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        container.innerHTML = '';
        container.className = 'h-full overflow-auto bg-gray-50';

        // Create custom AsyncAPI viewer
        const viewer = document.createElement('div');
        viewer.className = 'max-w-6xl mx-auto p-6 space-y-8';

        // API Info Section
        if (specObject.info) {
            const infoSection = document.createElement('div');
            infoSection.className = 'bg-white rounded-lg border border-gray-200 p-6';
            infoSection.innerHTML = `
                <div class="mb-6">
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">${specObject.info.title || 'MQTT API'}</h1>
                    <div class="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <span>Version ${specObject.info.version || '1.0.0'}</span>
                        <span>•</span>
                        <span>AsyncAPI ${specObject.asyncapi || '2.6.0'}</span>
                        <span>•</span>
                        <span class="flex items-center space-x-1">
                            <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
                            </svg>
                            <span>MQTT Protocol</span>
                        </span>
                    </div>
                    ${specObject.info.description ? `<p class="text-gray-700 leading-relaxed">${specObject.info.description}</p>` : ''}
                </div>
            `;
            viewer.appendChild(infoSection);
        }

        // Servers Section
        if (specObject.servers && Object.keys(specObject.servers).length > 0) {
            const serversSection = document.createElement('div');
            serversSection.className = 'bg-white rounded-lg border border-gray-200 p-6';
            serversSection.innerHTML = `
                <h2 class="text-xl font-semibold text-gray-900 mb-4">MQTT Brokers</h2>
                <div class="space-y-3">
                    ${Object.entries(specObject.servers).map(([name, server]: [string, any]) => `
                        <div class="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <div class="flex-1">
                                <div class="flex items-center space-x-2 mb-2">
                                    <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
                                    </svg>
                                    <span class="font-medium text-purple-900">${name}</span>
                                    <span class="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded uppercase">
                                        ${server.protocol || 'mqtt'}
                                    </span>
                                </div>
                                <code class="text-sm font-mono text-purple-800 bg-purple-100 px-2 py-1 rounded">
                                    ${server.url}
                                </code>
                                ${server.description ? `<p class="text-sm text-purple-700 mt-2">${server.description}</p>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            viewer.appendChild(serversSection);
        }

        // Channels Section
        if (specObject.channels && Object.keys(specObject.channels).length > 0) {
            const channelsSection = document.createElement('div');
            channelsSection.className = 'space-y-4';

            const channelsTitle = document.createElement('h2');
            channelsTitle.className = 'text-xl font-semibold text-gray-900';
            channelsTitle.textContent = 'MQTT Channels';
            channelsSection.appendChild(channelsTitle);

            Object.entries(specObject.channels).forEach(([channelName, channel]: [string, any]) => {
                const channelCard = document.createElement('div');
                channelCard.className = 'bg-white rounded-lg border border-gray-200 p-6';

                const operations = [];
                if (channel.subscribe) operations.push({ type: 'subscribe', data: channel.subscribe, color: 'purple' });
                if (channel.publish) operations.push({ type: 'publish', data: channel.publish, color: 'orange' });

                channelCard.innerHTML = `
                    <div class="mb-6">
                        <div class="flex items-center space-x-3 mb-3">
                            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
                            </svg>
                            <h3 class="text-lg font-semibold text-gray-900 font-mono break-all">${channelName}</h3>
                        </div>
                        ${channel.description ? `<p class="text-gray-600 mb-4">${channel.description}</p>` : ''}
                        <div class="flex items-center space-x-2">
                            ${operations.map(op => `
                                <span class="bg-${op.color}-500 text-white px-3 py-1 text-xs rounded font-medium uppercase">
                                    ${op.type}
                                </span>
                            `).join('')}
                        </div>
                    </div>

                    ${operations.map(operation => `
                        <div class="mb-6 p-4 bg-${operation.color}-50 rounded-lg border border-${operation.color}-200">
                            <h4 class="font-semibold text-${operation.color}-900 mb-3 flex items-center">
                                <span class="w-2 h-2 bg-${operation.color}-500 rounded-full mr-2"></span>
                                ${operation.type.charAt(0).toUpperCase() + operation.type.slice(1)} Operation
                            </h4>
                            <p class="text-sm text-${operation.color}-700 mb-3">
                                ${operation.type === 'subscribe' ? 'Listen for messages on this channel' : 'Send messages to this channel'}
                            </p>
                            ${operation.data.message ? `
                                <div class="bg-white p-4 rounded border">
                                    <div class="flex items-center justify-between mb-3">
                                        <h5 class="text-sm font-medium text-gray-900">
                                            ${operation.data.message.name || 'Message Schema'}
                                        </h5>
                                        ${operation.data.message.title ? `
                                            <span class="text-xs text-gray-500">${operation.data.message.title}</span>
                                        ` : ''}
                                    </div>
                                    ${operation.data.message.summary ? `
                                        <p class="text-sm text-gray-600 mb-3">${operation.data.message.summary}</p>
                                    ` : ''}
                                    ${operation.data.message.payload ? `
                                        <div class="bg-gray-50 p-3 rounded">
                                            <h6 class="text-xs font-medium text-gray-700 mb-2">Payload Schema:</h6>
                                            <pre class="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">${JSON.stringify(operation.data.message.payload, null, 2)}</pre>
                                        </div>
                                    ` : ''}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                `;

                channelsSection.appendChild(channelCard);
            });

            viewer.appendChild(channelsSection);
        }

        container.appendChild(viewer);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(spec);
            // You could add a toast notification here
        } catch (error) {
            console.error('Failed to copy spec:', error);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([spec], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'asyncapi-spec.yaml';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const openInAsyncAPIStudio = () => {
        try {
            const encoded = encodeURIComponent(spec);
            const url = `https://studio.asyncapi.com/?url=data:text/yaml;charset=utf-8,${encoded}`;
            window.open(url, '_blank');
        } catch (error) {
            console.error('Failed to open in AsyncAPI Studio:', error);
        }
    };

    if (isLoading) {
        return (
            <div className={`flex items-center justify-center h-96 ${className}`}>
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    <p className="text-gray-600">Loading AsyncAPI Viewer...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex items-center justify-center h-96 ${className}`}>
                <div className="flex flex-col items-center space-y-4 text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Error Loading MQTT API Specification</h3>
                        <p className="text-red-600 text-sm">{error}</p>
                        <div className="mt-4 space-x-2">
                            <Button variant="outline" size="sm" onClick={() => loadAsyncAPIViewer()}>
                                Retry
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleCopy}>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Spec
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`h-full bg-white ${className}`}>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                        <Wifi className="w-6 h-6 text-purple-600" />
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">
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
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                            leftIcon={<Copy className="w-4 h-4" />}
                        >
                            Copy
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownload}
                            leftIcon={<Download className="w-4 h-4" />}
                        >
                            Download
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={openInAsyncAPIStudio}
                            leftIcon={<ExternalLink className="w-4 h-4" />}
                        >
                            Open in Studio
                        </Button>
                        {isFullscreen && onClose && (
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                <Minimize2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* AsyncAPI Container - NO SCROLLBARS, FULL HEIGHT */}
            <div
                ref={containerRef}
                className="asyncapi-container"
                style={{
                    height: isFullscreen ? 'calc(100vh - 80px)' : '600px',
                    overflow: 'hidden' // Remove scrollbars as requested
                }}
            />

            {/* Custom AsyncAPI Styles */}
            <style>{`
                .asyncapi-container :global(asyncapi-component) {
                    height: 100%;
                    width: 100%;
                    display: block;
                }
                
                .asyncapi-container :global(.asyncapi) {
                    font-family: inherit;
                    height: 100%;
                }
                
                .asyncapi-container :global(.asyncapi .container) {
                    max-width: none;
                    padding: 0;
                }
                
                .asyncapi-container :global(.asyncapi .header) {
                    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                    color: white;
                    padding: 2rem;
                }
                
                .asyncapi-container :global(.asyncapi .content) {
                    padding: 1.5rem;
                }
                
                .asyncapi-container :global(.asyncapi .channel) {
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    margin-bottom: 1rem;
                    overflow: hidden;
                }
                
                .asyncapi-container :global(.asyncapi .channel-header) {
                    background: #f9fafb;
                    padding: 1rem;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .asyncapi-container :global(.asyncapi .channel-name) {
                    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
                    font-weight: 600;
                    color: #1f2937;
                }
                
                .asyncapi-container :global(.asyncapi .operation) {
                    padding: 1rem;
                    border-bottom: 1px solid #f3f4f6;
                }
                
                .asyncapi-container :global(.asyncapi .operation.subscribe) {
                    background: linear-gradient(to right, #faf5ff, #ffffff);
                    border-left: 4px solid #8b5cf6;
                }
                
                .asyncapi-container :global(.asyncapi .operation.publish) {
                    background: linear-gradient(to right, #fff7ed, #ffffff);
                    border-left: 4px solid #f59e0b;
                }
                
                .asyncapi-container :global(.asyncapi .message-schema) {
                    background: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.375rem;
                    padding: 1rem;
                    margin-top: 1rem;
                }
                
                .asyncapi-container :global(.asyncapi .schema-property) {
                    padding: 0.5rem 0;
                    border-bottom: 1px solid #f3f4f6;
                }
                
                .asyncapi-container :global(.asyncapi .schema-property:last-child) {
                    border-bottom: none;
                }
                
                .asyncapi-container :global(.asyncapi .property-name) {
                    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
                    font-weight: 600;
                    color: #374151;
                }
                
                .asyncapi-container :global(.asyncapi .property-type) {
                    color: #6b7280;
                    font-size: 0.875rem;
                }
                
                .asyncapi-container :global(.asyncapi .property-description) {
                    color: #4b5563;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                }
                
                .asyncapi-container :global(.asyncapi .servers-section) {
                    background: #faf5ff;
                    border: 1px solid #e9d5ff;
                    border-radius: 0.5rem;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                }
                
                .asyncapi-container :global(.asyncapi .server-card) {
                    background: white;
                    border: 1px solid #d1d5db;
                    border-radius: 0.375rem;
                    padding: 1rem;
                    margin-bottom: 1rem;
                }
                
                .asyncapi-container :global(.asyncapi .server-url) {
                    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
                    background: #f3f4f6;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                    font-size: 0.875rem;
                }
            `}</style>
        </div>
    );
};

export default MqttViewer;