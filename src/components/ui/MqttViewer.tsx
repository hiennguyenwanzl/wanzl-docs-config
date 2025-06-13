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
    const [copied, setCopied] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const asyncAPIRef = useRef<any>(null);

    useEffect(() => {
        loadAsyncAPIViewer();

        // Cleanup function to prevent memory leaks
        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
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

            // Add custom CSS for AsyncAPI styling
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                .asyncapi-component {
                    --primary-color: #8b5cf6;
                    --primary-light-color: #ede9fe;
                    --primary-dark-color: #7c3aed;
                    --secondary-color: #60a5fa;
                    --text-color: #1f2937;
                    --heading-font-weight: 600;
                    --heading-color: #111827;
                    --heading-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    --body-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    --border-radius: 0.5rem;
                    --border-color: #e5e7eb;
                    font-family: var(--body-font-family);
                }
                
                .asyncapi-component .header {
                    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                    padding: 1.5rem;
                    border-radius: var(--border-radius) var(--border-radius) 0 0;
                }
                
                .asyncapi-component .header h1 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: white;
                    margin: 0;
                }
                
                .asyncapi-component .header .version {
                    background: rgba(255,255,255,0.2);
                    color: white;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                    font-size: 0.875rem;
                    margin-left: 0.5rem;
                }
                
                .asyncapi-component .info-section {
                    padding: 1.5rem;
                }
                
                .asyncapi-component .card {
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius);
                    margin-bottom: 1rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                    background: white;
                }
                
                .asyncapi-component .card-header {
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    align-items: center;
                    background: #f9fafb;
                    border-radius: var(--border-radius) var(--border-radius) 0 0;
                }
                
                .asyncapi-component .card-header h3 {
                    font-size: 1rem;
                    font-weight: 600;
                    margin: 0;
                    color: var(--heading-color);
                }
                
                .asyncapi-component .card-body {
                    padding: 1.5rem;
                }
                
                .asyncapi-component .server-item {
                    padding: 1rem;
                    background: var(--primary-light-color);
                    border: 1px solid rgba(139, 92, 246, 0.2);
                    border-radius: var(--border-radius);
                    margin-bottom: 1rem;
                }
                
                .asyncapi-component .server-item h4 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--primary-dark-color);
                    margin: 0 0 0.5rem 0;
                }
                
                .asyncapi-component .server-url {
                    font-family: monospace;
                    background: rgba(255,255,255,0.5);
                    padding: 0.5rem;
                    border-radius: 0.25rem;
                    word-break: break-all;
                }
                
                .asyncapi-component .channel-item {
                    margin-bottom: 1.5rem;
                }
                
                .asyncapi-component .channel-name {
                    font-family: monospace;
                    font-weight: 600;
                    color: var(--heading-color);
                    margin-bottom: 0.5rem;
                    word-break: break-all;
                }
                
                .asyncapi-component .operation {
                    padding: 1rem;
                    border-radius: var(--border-radius);
                    margin-bottom: 1rem;
                }
                
                .asyncapi-component .operation.publish {
                    background: #fff7ed;
                    border-left: 4px solid #f59e0b;
                }
                
                .asyncapi-component .operation.subscribe {
                    background: #ede9fe;
                    border-left: 4px solid #8b5cf6;
                }
                
                .asyncapi-component .operation-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }
                
                .asyncapi-component .operation-type {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    font-weight: 700;
                    border-radius: 0.25rem;
                    padding: 0.25rem 0.5rem;
                    margin-right: 0.5rem;
                }
                
                .asyncapi-component .operation-type.publish {
                    background: #f59e0b;
                    color: white;
                }
                
                .asyncapi-component .operation-type.subscribe {
                    background: #8b5cf6;
                    color: white;
                }
                
                .asyncapi-component .schema {
                    background: #f9fafb;
                    padding: 1rem;
                    border-radius: 0.25rem;
                    font-family: monospace;
                    font-size: 0.875rem;
                    overflow-x: auto;
                }
                
                .asyncapi-component .schema-property {
                    margin-bottom: 0.5rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px dashed #e5e7eb;
                }
                
                .asyncapi-component .schema-property:last-child {
                    margin-bottom: 0;
                    padding-bottom: 0;
                    border-bottom: none;
                }
                
                .asyncapi-component .property-name {
                    font-weight: 600;
                    color: #4b5563;
                }
                
                .asyncapi-component .property-type {
                    font-size: 0.75rem;
                    background: #e5e7eb;
                    padding: 0.125rem 0.375rem;
                    border-radius: 0.25rem;
                    margin-left: 0.25rem;
                }
                
                .asyncapi-component .required {
                    color: #ef4444;
                    margin-left: 0.25rem;
                }
                
                .asyncapi-component .property-description {
                    margin-top: 0.25rem;
                    font-size: 0.875rem;
                    color: #6b7280;
                    font-family: var(--body-font-family);
                }
                
                .asyncapi-component .tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.25rem;
                    margin-top: 0.5rem;
                }
                
                .asyncapi-component .tag {
                    font-size: 0.75rem;
                    background: #e5e7eb;
                    color: #4b5563;
                    padding: 0.125rem 0.375rem;
                    border-radius: 0.25rem;
                }
                
                .asyncapi-component pre {
                    background: #1f2937;
                    color: #f9fafb;
                    padding: 1rem;
                    border-radius: 0.25rem;
                    overflow-x: auto;
                    font-size: 0.875rem;
                }
                
                .asyncapi-component code {
                    font-family: monospace;
                }
            `;
            document.head.appendChild(styleElement);

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
                        messageExamples: true,
                        schemaExamples: true
                    },
                    sidebar: {
                        showServers: true,
                        showOperations: true
                    },
                    theme: {
                        bg: {
                            primary: '#faf5ff',
                            secondary: '#ffffff'
                        },
                        fg: {
                            primary: '#1f2937',
                            secondary: '#4b5563'
                        },
                        primary: {
                            main: '#8b5cf6',
                            light: '#ede9fe',
                            dark: '#7c3aed',
                            contrastText: '#ffffff'
                        },
                        success: {
                            main: '#10b981',
                            light: '#d1fae5',
                            dark: '#059669',
                            contrastText: '#ffffff'
                        },
                        error: {
                            main: '#ef4444',
                            light: '#fee2e2',
                            dark: '#b91c1c',
                            contrastText: '#ffffff'
                        }
                    }
                }));

                // Set full height to container
                asyncAPIElement.style.height = '100%';
                asyncAPIElement.style.width = '100%';
                asyncAPIElement.style.display = 'block';
                asyncAPIElement.style.border = 'none';

                containerRef.current.appendChild(asyncAPIElement);
                asyncAPIRef.current = asyncAPIElement;
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
        container.className = 'h-full overflow-auto bg-purple-50';

        // Create custom AsyncAPI viewer
        const viewer = document.createElement('div');
        viewer.className = 'max-w-6xl mx-auto p-6 space-y-8 asyncapi-component';

        // API Info Section
        if (specObject.info) {
            const infoSection = document.createElement('div');
            infoSection.className = 'card';
            infoSection.innerHTML = `
                <div class="header">
                    <h1>${specObject.info.title || 'MQTT API'} <span class="version">${specObject.info.version || '1.0.0'}</span></h1>
                    <p class="mt-2 text-white text-opacity-90">${specObject.info.description || 'MQTT API Documentation'}</p>
                </div>
                <div class="info-section">
                    <div class="mb-4">
                        <span class="text-sm text-gray-500">AsyncAPI Version:</span>
                        <span class="text-sm font-medium">${specObject.asyncapi || '2.6.0'}</span>
                    </div>
                    ${specObject.info.contact ? `
                        <div class="mb-4">
                            <h3 class="text-sm font-medium mb-1">Contact</h3>
                            <p class="text-sm">${specObject.info.contact.name || ''} ${specObject.info.contact.email ? `(${specObject.info.contact.email})` : ''}</p>
                            ${specObject.info.contact.url ? `<a href="${specObject.info.contact.url}" target="_blank" class="text-sm text-purple-600 hover:text-purple-800">${specObject.info.contact.url}</a>` : ''}
                        </div>
                    ` : ''}
                    ${specObject.info.license ? `
                        <div class="mb-4">
                            <h3 class="text-sm font-medium mb-1">License</h3>
                            <p class="text-sm">${specObject.info.license.name || ''}</p>
                            ${specObject.info.license.url ? `<a href="${specObject.info.license.url}" target="_blank" class="text-sm text-purple-600 hover:text-purple-800">${specObject.info.license.url}</a>` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
            viewer.appendChild(infoSection);
        }

        // Servers Section
        if (specObject.servers && Object.keys(specObject.servers).length > 0) {
            const serversSection = document.createElement('div');
            serversSection.className = 'card';
            serversSection.innerHTML = `
                <div class="card-header">
                    <h3>MQTT Brokers</h3>
                </div>
                <div class="card-body">
                    <div class="space-y-4">
                        ${Object.entries(specObject.servers).map(([name, server]: [string, any]) => `
                            <div class="server-item">
                                <h4>${name}</h4>
                                <div class="mb-2">
                                    <span class="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                                        ${server.protocol || 'mqtt'}
                                    </span>
                                </div>
                                <div class="server-url">${server.url}</div>
                                ${server.description ? `<p class="mt-2 text-sm text-gray-700">${server.description}</p>` : ''}
                                ${server.security ? `
                                    <div class="mt-2">
                                        <span class="text-xs font-medium text-gray-500">Security:</span>
                                        <span class="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded">${Array.isArray(server.security) ? server.security.map(s => Object.keys(s)[0]).join(', ') : 'Protected'}</span>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            viewer.appendChild(serversSection);
        }

        // Channels Section
        if (specObject.channels && Object.keys(specObject.channels).length > 0) {
            const channelsSection = document.createElement('div');
            channelsSection.className = 'card';
            channelsSection.innerHTML = `
                <div class="card-header">
                    <h3>MQTT Channels</h3>
                </div>
                <div class="card-body">
                    <div class="space-y-6">
                        ${Object.entries(specObject.channels).map(([channelName, channel]: [string, any]) => {
                const operations = [];
                if (channel.subscribe) operations.push({ type: 'subscribe', data: channel.subscribe });
                if (channel.publish) operations.push({ type: 'publish', data: channel.publish });

                return `
                                <div class="channel-item">
                                    <h4 class="channel-name">${channelName}</h4>
                                    ${channel.description ? `<p class="text-sm text-gray-700 mb-2">${channel.description}</p>` : ''}
                                    <div class="space-y-2">
                                        ${operations.map(operation => `
                                            <div class="operation ${operation.type}">
                                                <div class="operation-header">
                                                    <span class="operation-type ${operation.type}">${operation.type}</span>
                                                    <span class="text-sm font-medium">${operation.data.summary || (operation.type === 'subscribe' ? 'Subscribe to messages' : 'Publish messages')}</span>
                                                </div>
                                                ${operation.data.description ? `<p class="text-sm text-gray-700 mb-2">${operation.data.description}</p>` : ''}
                                                ${operation.data.message ? `
                                                    <div class="mt-2">
                                                        <div class="text-sm font-medium mb-1">Message: ${operation.data.message.name || 'Message'}</div>
                                                        ${operation.data.message.summary ? `<p class="text-sm text-gray-700 mb-2">${operation.data.message.summary}</p>` : ''}
                                                        ${operation.data.message.payload ? `
                                                            <div class="schema">
                                                                <pre><code>${JSON.stringify(operation.data.message.payload, null, 2)}</code></pre>
                                                            </div>
                                                        ` : ''}
                                                    </div>
                                                ` : ''}
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
            }).join('')}
                    </div>
                </div>
            `;
            viewer.appendChild(channelsSection);
        }

        container.appendChild(viewer);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(spec);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy spec:', error);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([spec], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        // Determine file extension based on content
        const fileExtension = spec.trim().startsWith('{') ? 'json' : 'yaml';

        link.href = url;
        link.download = `asyncapi-spec.${fileExtension}`;
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
                    <p className="text-gray-600">Loading MQTT Documentation...</p>
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
                            {copied ? 'Copied!' : 'Copy'}
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

            {/* AsyncAPI Container - Full height without scrollbars */}
            <div
                ref={containerRef}
                className="asyncapi-container w-full"
                style={{
                    height: 'calc(100% - 72px)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}
            />
        </div>
    );
};

export default MqttViewer;