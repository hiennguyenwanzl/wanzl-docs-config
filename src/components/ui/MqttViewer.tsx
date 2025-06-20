// src/components/ui/MqttViewer.tsx
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

declare global {
    interface Window {
        jsyaml: {
            load: (str: string) => any;
        };
    }
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

    useEffect(() => {
        loadAsyncAPIViewer();

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
                    // Load YAML parser first
                    await loadYAMLParser();
                    specObject = window.jsyaml.load(spec);
                }
            } else {
                specObject = spec;
            }

            setParsedSpec(specObject);

            // Initialize custom AsyncAPI renderer
            initializeAsyncAPI(specObject);

        } catch (err) {
            console.error('Failed to load AsyncAPI viewer:', err);
            setError('Failed to load MQTT API specification. Please check the format.');
        } finally {
            setIsLoading(false);
        }
    };

    const loadYAMLParser = async (): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (window.jsyaml) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load YAML parser'));
            document.head.appendChild(script);
        });
    };

    const initializeAsyncAPI = (specObject: any) => {
        if (!containerRef.current) return;

        try {
            // Clear previous content
            containerRef.current.innerHTML = '';
            containerRef.current.className = 'h-full overflow-auto bg-purple-50';

            // Create custom AsyncAPI viewer
            renderCustomAsyncAPI(specObject);

        } catch (err) {
            console.error('Failed to initialize AsyncAPI viewer:', err);
            setError('Failed to render MQTT API documentation');
        }
    };

    const renderCustomAsyncAPI = (specObject: any) => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        container.innerHTML = '';

        // Create main wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'max-w-6xl mx-auto space-y-6 asyncapi-component';
        wrapper.style.padding = '24px';

        // API Info Section
        if (specObject.info) {
            const infoSection = document.createElement('div');
            infoSection.className = 'bg-white rounded-xl border border-purple-200 overflow-hidden shadow-sm';
            infoSection.innerHTML = `
                <div class="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-8 text-white">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="p-2 bg-white bg-opacity-20 rounded-lg">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                            </svg>
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold">${specObject.info.title || 'MQTT API'}</h1>
                            <div class="flex items-center space-x-4 mt-2 text-purple-100">
                                <span class="flex items-center space-x-1">
                                    <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span>Version ${specObject.info.version || '1.0.0'}</span>
                                </span>
                                <span>•</span>
                                <span>AsyncAPI ${specObject.asyncapi || '2.6.0'}</span>
                                <span>•</span>
                                <span>Protocol: MQTT</span>
                            </div>
                        </div>
                    </div>
                    ${specObject.info.description ? `<p class="text-purple-100 text-lg leading-relaxed">${specObject.info.description}</p>` : ''}
                </div>
                <div class="p-6 space-y-4">
                    ${specObject.info.contact ? `
                        <div class="flex items-start space-x-3">
                            <div class="p-2 bg-purple-100 rounded-lg">
                                <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Contact Information</h3>
                                <p class="text-gray-600">${specObject.info.contact.name || ''} ${specObject.info.contact.email ? `(${specObject.info.contact.email})` : ''}</p>
                                ${specObject.info.contact.url ? `<a href="${specObject.info.contact.url}" target="_blank" class="text-purple-600 hover:text-purple-800 text-sm">${specObject.info.contact.url}</a>` : ''}
                            </div>
                        </div>
                    ` : ''}
                    ${specObject.info.license ? `
                        <div class="flex items-start space-x-3">
                            <div class="p-2 bg-purple-100 rounded-lg">
                                <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 2L3 7v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7l-7-5zm0 2.83L15 8.1V18H5V8.1l5-3.27z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">License</h3>
                                <p class="text-gray-600">${specObject.info.license.name || ''}</p>
                                ${specObject.info.license.url ? `<a href="${specObject.info.license.url}" target="_blank" class="text-purple-600 hover:text-purple-800 text-sm">${specObject.info.license.url}</a>` : ''}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
            wrapper.appendChild(infoSection);
        }

        // Servers Section
        if (specObject.servers && Object.keys(specObject.servers).length > 0) {
            const serversSection = document.createElement('div');
            serversSection.className = 'bg-white rounded-xl border border-purple-200 overflow-hidden shadow-sm';
            serversSection.innerHTML = `
                <div class="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-purple-200">
                    <div class="flex items-center space-x-3">
                        <div class="p-2 bg-purple-200 rounded-lg">
                            <svg class="w-5 h-5 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                            </svg>
                        </div>
                        <h2 class="text-xl font-bold text-gray-900">MQTT Brokers</h2>
                    </div>
                </div>
                <div class="p-6">
                    <div class="grid gap-4">
                        ${Object.entries(specObject.servers).map(([name, server]: [string, any]) => `
                            <div class="border border-purple-200 rounded-lg p-4 hover:bg-purple-50 transition-colors">
                                <div class="flex items-start justify-between mb-3">
                                    <h3 class="text-lg font-semibold text-gray-900">${name}</h3>
                                    <div class="flex items-center space-x-2">
                                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            ${server.protocol || 'mqtt'}
                                        </span>
                                        ${server.security ? `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Secured</span>` : ''}
                                    </div>
                                </div>
                                <div class="bg-gray-900 rounded-lg p-3 mb-3">
                                    <code class="text-green-400 font-mono text-sm">${server.url}</code>
                                </div>
                                ${server.description ? `<p class="text-gray-600 text-sm">${server.description}</p>` : ''}
                                ${server.security ? `
                                    <div class="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                                        <div class="flex items-center space-x-2">
                                            <svg class="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"/>
                                            </svg>
                                            <span class="text-sm font-medium text-red-800">Authentication Required</span>
                                        </div>
                                        <p class="text-sm text-red-700 mt-1">
                                            Security: ${Array.isArray(server.security) ? server.security.map(s => Object.keys(s)[0]).join(', ') : 'Protected'}
                                        </p>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            wrapper.appendChild(serversSection);
        }

        // Channels Section
        if (specObject.channels && Object.keys(specObject.channels).length > 0) {
            const channelsSection = document.createElement('div');
            channelsSection.className = 'bg-white rounded-xl border border-purple-200 overflow-hidden shadow-sm';
            channelsSection.innerHTML = `
                <div class="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-purple-200">
                    <div class="flex items-center space-x-3">
                        <div class="p-2 bg-purple-200 rounded-lg">
                            <svg class="w-5 h-5 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
                            </svg>
                        </div>
                        <h2 class="text-xl font-bold text-gray-900">MQTT Channels & Operations</h2>
                    </div>
                </div>
                <div class="p-6">
                    <div class="space-y-6">
                        ${Object.entries(specObject.channels).map(([channelName, channel]: [string, any]) => {
                const operations = [];
                if (channel.subscribe) operations.push({ type: 'subscribe', data: channel.subscribe });
                if (channel.publish) operations.push({ type: 'publish', data: channel.publish });

                return `
                                <div class="border border-gray-200 rounded-lg overflow-hidden">
                                    <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <h3 class="text-lg font-semibold text-gray-900 font-mono">${channelName}</h3>
                                                ${channel.description ? `<p class="text-gray-600 text-sm mt-1">${channel.description}</p>` : ''}
                                            </div>
                                            <div class="flex items-center space-x-2">
                                                ${operations.map(op => `
                                                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    op.type === 'publish'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-purple-100 text-purple-800'
                }">
                                                        ${op.type.toUpperCase()}
                                                    </span>
                                                `).join('')}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="p-6 space-y-4">
                                        ${operations.map(operation => `
                                            <div class="border-l-4 ${operation.type === 'publish' ? 'border-orange-400 bg-orange-50' : 'border-purple-400 bg-purple-50'} p-4 rounded-r-lg">
                                                <div class="flex items-center space-x-3 mb-3">
                                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                    operation.type === 'publish'
                        ? 'bg-orange-500 text-white'
                        : 'bg-purple-500 text-white'
                }">
                                                        ${operation.type.toUpperCase()}
                                                    </span>
                                                    <span class="text-lg font-semibold text-gray-900">
                                                        ${operation.data.summary || (operation.type === 'subscribe' ? 'Subscribe to messages' : 'Publish messages')}
                                                    </span>
                                                </div>
                                                ${operation.data.description ? `<p class="text-gray-700 mb-4">${operation.data.description}</p>` : ''}
                                                ${operation.data.message ? `
                                                    <div class="bg-white rounded-lg border border-gray-200 p-4">
                                                        <div class="flex items-center space-x-2 mb-3">
                                                            <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                                                            </svg>
                                                            <h4 class="font-semibold text-gray-900">Message: ${operation.data.message.name || 'Message'}</h4>
                                                        </div>
                                                        ${operation.data.message.summary ? `<p class="text-gray-700 mb-3">${operation.data.message.summary}</p>` : ''}
                                                        ${operation.data.message.payload ? `
                                                            <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                                                <pre class="text-green-400 text-sm font-mono leading-relaxed"><code>${JSON.stringify(operation.data.message.payload, null, 2)}</code></pre>
                                                            </div>
                                                        ` : ''}
                                                        ${operation.data.message.examples ? `
                                                            <div class="mt-4">
                                                                <h5 class="font-medium text-gray-900 mb-2">Examples:</h5>
                                                                <div class="space-y-2">
                                                                    ${Object.entries(operation.data.message.examples).map(([name, example]: [string, any]) => `
                                                                        <div class="bg-gray-50 rounded-lg p-3">
                                                                            <div class="font-medium text-gray-900 mb-2">${name}</div>
                                                                            <div class="bg-gray-900 rounded p-2 overflow-x-auto">
                                                                                <pre class="text-green-400 text-sm font-mono"><code>${JSON.stringify(example, null, 2)}</code></pre>
                                                                            </div>
                                                                        </div>
                                                                    `).join('')}
                                                                </div>
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
            wrapper.appendChild(channelsSection);
        }

        // Components/Schemas Section
        if (specObject.components && (specObject.components.schemas || specObject.components.messages)) {
            const componentsSection = document.createElement('div');
            componentsSection.className = 'bg-white rounded-xl border border-purple-200 overflow-hidden shadow-sm';
            componentsSection.innerHTML = `
                <div class="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-purple-200">
                    <div class="flex items-center space-x-3">
                        <div class="p-2 bg-purple-200 rounded-lg">
                            <svg class="w-5 h-5 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                            </svg>
                        </div>
                        <h2 class="text-xl font-bold text-gray-900">Components & Schemas</h2>
                    </div>
                </div>
                <div class="p-6">
                    ${specObject.components.schemas ? `
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Schemas</h3>
                            <div class="space-y-4">
                                ${Object.entries(specObject.components.schemas).map(([name, schema]: [string, any]) => `
                                    <div class="border border-gray-200 rounded-lg p-4">
                                        <h4 class="font-semibold text-gray-900 mb-2">${name}</h4>
                                        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                            <pre class="text-green-400 text-sm font-mono leading-relaxed"><code>${JSON.stringify(schema, null, 2)}</code></pre>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    ${specObject.components.messages ? `
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Message Components</h3>
                            <div class="space-y-4">
                                ${Object.entries(specObject.components.messages).map(([name, message]: [string, any]) => `
                                    <div class="border border-gray-200 rounded-lg p-4">
                                        <h4 class="font-semibold text-gray-900 mb-2">${name}</h4>
                                        ${message.summary ? `<p class="text-gray-600 mb-3">${message.summary}</p>` : ''}
                                        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                            <pre class="text-green-400 text-sm font-mono leading-relaxed"><code>${JSON.stringify(message, null, 2)}</code></pre>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
            wrapper.appendChild(componentsSection);
        }

        container.appendChild(wrapper);

        // Apply custom styles
        applyMqttStyles();
    };

    const applyMqttStyles = () => {
        // Remove existing styles
        const existingStyle = document.getElementById('mqtt-custom-styles');
        if (existingStyle) {
            existingStyle.remove();
        }

        // Add custom styles for MQTT viewer
        const styleEl = document.createElement('style');
        styleEl.id = 'mqtt-custom-styles';
        styleEl.textContent = `
            .asyncapi-component {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                line-height: 1.6;
                color: #1a202c;
            }
            
            .asyncapi-component h1 {
                font-size: 2rem;
                font-weight: 800;
                line-height: 1.2;
            }
            
            .asyncapi-component h2 {
                font-size: 1.5rem;
                font-weight: 700;
                line-height: 1.3;
            }
            
            .asyncapi-component h3 {
                font-size: 1.25rem;
                font-weight: 600;
                line-height: 1.4;
            }
            
            .asyncapi-component h4 {
                font-size: 1.125rem;
                font-weight: 600;
                line-height: 1.4;
            }
            
            .asyncapi-component p {
                font-size: 0.875rem;
                line-height: 1.6;
                margin-bottom: 0.5rem;
            }
            
            .asyncapi-component code {
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 0.875rem;
                line-height: 1.4;
            }
            
            .asyncapi-component pre {
                overflow-x: auto;
                white-space: pre-wrap;
                word-wrap: break-word;
            }
            
            /* Scrollbar styling */
            .asyncapi-component::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            
            .asyncapi-component::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 4px;
            }
            
            .asyncapi-component::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 4px;
            }
            
            .asyncapi-component::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
            }
            
            /* Responsive design */
            @media (max-width: 768px) {
                .asyncapi-component {
                    padding: 16px;
                }
                
                .asyncapi-component h1 {
                    font-size: 1.75rem;
                }
                
                .asyncapi-component h2 {
                    font-size: 1.25rem;
                }
                
                .asyncapi-component .grid {
                    grid-template-columns: 1fr;
                }
                
                .asyncapi-component .flex {
                    flex-direction: column;
                    align-items: flex-start;
                }
                
                .asyncapi-component .space-x-4 > * + * {
                    margin-left: 0;
                    margin-top: 0.5rem;
                }
            }
        `;
        document.head.appendChild(styleEl);
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
            <div className={`flex items-center justify-center h-full ${className}`}>
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    <p className="text-gray-600 font-medium">Loading MQTT Documentation...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex items-center justify-center h-full ${className}`}>
                <div className="flex flex-col items-center space-y-4 text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Error Loading MQTT API Specification</h3>
                        <p className="text-red-600 text-sm mb-4">{error}</p>
                        <div className="flex space-x-2 justify-center">
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
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Wifi className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">
                                {parsedSpec?.info?.title || 'MQTT API Documentation'}
                            </h1>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                    <span>Version {parsedSpec?.info?.version || '1.0.0'}</span>
                                </span>
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

            {/* AsyncAPI Container */}
            <div
                ref={containerRef}
                className="asyncapi-container"
                style={{
                    height: 'calc(100% - 80px)',
                    width: '100%',
                    position: 'relative'
                }}
            />
        </div>
    );
};

export default MqttViewer;