// src/components/ui/SwaggerViewer.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
    Code,
    Copy,
    Download,
    ExternalLink,
    AlertCircle,
    Minimize2
} from 'lucide-react';
import Button from '../ui/Button';

interface SwaggerViewerProps {
    spec: string;
    onClose?: () => void;
    isFullscreen?: boolean;
    className?: string;
}

declare global {
    interface Window {
        SwaggerUIBundle: any;
        SwaggerUIStandalonePreset: any;
        jsyaml: {
            load: (str: string) => any;
        };
    }
}

const SwaggerViewer: React.FC<SwaggerViewerProps> = ({
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
    const swaggerUIRef = useRef<any>(null);

    useEffect(() => {
        loadSwaggerUI();

        return () => {
            if (swaggerUIRef.current && typeof swaggerUIRef.current.unmount === 'function') {
                swaggerUIRef.current.unmount();
            }
        };
    }, [spec]);

    const loadSwaggerUI = async () => {
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

            // Load and initialize Swagger UI
            await loadSwaggerUILibrary();
            initializeSwaggerUI(specObject);

        } catch (err) {
            console.error('Failed to load Swagger UI:', err);
            setError('Failed to load API specification. Please check the format.');
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

    const loadSwaggerUILibrary = async (): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (window.SwaggerUIBundle) {
                resolve();
                return;
            }

            // Load CSS first
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.2/swagger-ui.css';
            document.head.appendChild(cssLink);

            // Then load JS
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.2/swagger-ui-bundle.min.js';
            script.onload = () => {
                const standAloneScript = document.createElement('script');
                standAloneScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.2/swagger-ui-standalone-preset.min.js';
                standAloneScript.onload = () => resolve();
                standAloneScript.onerror = () => reject(new Error('Failed to load Swagger UI standalone'));
                document.head.appendChild(standAloneScript);
            };
            script.onerror = () => reject(new Error('Failed to load Swagger UI bundle'));
            document.head.appendChild(script);
        });
    };

    const initializeSwaggerUI = (specObject: any) => {
        if (!containerRef.current || !window.SwaggerUIBundle) return;

        try {
            // Clear previous instance
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }

            // Create container for Swagger UI
            const swaggerContainer = document.createElement('div');
            swaggerContainer.id = `swagger-ui-${Date.now()}`;
            swaggerContainer.style.height = '100%';
            swaggerContainer.style.width = '100%';
            containerRef.current.appendChild(swaggerContainer);

            // Initialize Swagger UI
            swaggerUIRef.current = window.SwaggerUIBundle({
                domNode: swaggerContainer,
                spec: specObject,
                layout: 'BaseLayout',
                deepLinking: true,
                showExtensions: true,
                showCommonExtensions: true,
                defaultModelsExpandDepth: 1,
                defaultModelExpandDepth: 1,
                docExpansion: 'list',
                filter: true,
                maxDisplayedTags: 50,
                operationsSorter: 'alpha',
                tagsSorter: 'alpha',
                tryItOutEnabled: true,
                requestInterceptor: (req: any) => {
                    return req;
                },
                responseInterceptor: (res: any) => {
                    return res;
                },
                onComplete: () => {
                    console.log('Swagger UI loaded successfully');

                    // Apply custom styles after loading
                    setTimeout(() => {
                        applyCustomStyles();
                    }, 100);
                },
                presets: [
                    window.SwaggerUIBundle.presets.apis,
                    window.SwaggerUIStandalonePreset
                ],
                plugins: [
                    window.SwaggerUIBundle.plugins.DownloadUrl
                ],
                supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'],
                validatorUrl: null
            });

        } catch (err) {
            console.error('Failed to initialize Swagger UI:', err);
            setError('Failed to initialize API documentation viewer');
        }
    };

    const applyCustomStyles = () => {
        if (!containerRef.current) return;

        // Remove existing custom styles
        const existingStyle = document.getElementById('swagger-custom-styles');
        if (existingStyle) {
            existingStyle.remove();
        }

        // Add optimized custom styles
        const styleEl = document.createElement('style');
        styleEl.id = 'swagger-custom-styles';
        styleEl.textContent = `
            /* Container optimization */
            .swagger-ui-container {
                height: 100%;
                overflow: hidden;
                background: #fff;
            }
            
            .swagger-ui-container .swagger-ui {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                font-size: 14px;
                line-height: 1.5;
            }
            
            .swagger-ui-container .swagger-ui .wrapper {
                padding: 0;
                max-width: none;
                height: 100%;
                overflow-y: auto;
                overflow-x: hidden;
            }
            
            /* Header and info optimization */
            .swagger-ui-container .swagger-ui .info {
                margin: 16px 20px;
                padding: 0;
            }
            
            .swagger-ui-container .swagger-ui .info .title {
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 8px;
                color: #1a202c;
            }
            
            .swagger-ui-container .swagger-ui .info .description {
                font-size: 15px;
                line-height: 1.6;
                color: #4a5568;
                margin-bottom: 16px;
            }
            
            /* Server selection optimization */
            .swagger-ui-container .swagger-ui .scheme-container {
                background: #f7fafc;
                padding: 12px 20px;
                margin: 0;
                border-bottom: 1px solid #e2e8f0;
            }
            
            /* Operation blocks optimization */
            .swagger-ui-container .swagger-ui .opblock-tag {
                border-bottom: 1px solid #e2e8f0;
                margin: 0;
                padding: 16px 20px;
                background: #f8f9fa;
            }
            
            .swagger-ui-container .swagger-ui .opblock-tag .opblock-tag-section h3 {
                font-size: 18px;
                font-weight: 600;
                color: #2d3748;
                margin: 0;
            }
            
            .swagger-ui-container .swagger-ui .opblock {
                margin: 0 0 1px 0;
                border: none;
                border-radius: 0;
                box-shadow: none;
                border-left: 4px solid transparent;
            }
            
            /* HTTP method colors */
            .swagger-ui-container .swagger-ui .opblock.opblock-get {
                border-left-color: #61affe;
                background: rgba(97, 175, 254, 0.05);
            }
            
            .swagger-ui-container .swagger-ui .opblock.opblock-post {
                border-left-color: #49cc90;
                background: rgba(73, 204, 144, 0.05);
            }
            
            .swagger-ui-container .swagger-ui .opblock.opblock-put {
                border-left-color: #fca130;
                background: rgba(252, 161, 48, 0.05);
            }
            
            .swagger-ui-container .swagger-ui .opblock.opblock-delete {
                border-left-color: #f93e3e;
                background: rgba(249, 62, 62, 0.05);
            }
            
            .swagger-ui-container .swagger-ui .opblock.opblock-patch {
                border-left-color: #50e3c2;
                background: rgba(80, 227, 194, 0.05);
            }
            
            /* Operation summary optimization */
            .swagger-ui-container .swagger-ui .opblock-summary {
                padding: 12px 20px;
                border: none;
                background: transparent;
            }
            
            .swagger-ui-container .swagger-ui .opblock-summary:hover {
                background: rgba(0, 0, 0, 0.02);
            }
            
            .swagger-ui-container .swagger-ui .opblock-summary .opblock-summary-method {
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase;
                border-radius: 4px;
                padding: 4px 8px;
                margin-right: 12px;
                min-width: 60px;
                text-align: center;
            }
            
            .swagger-ui-container .swagger-ui .opblock-summary .opblock-summary-path {
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 14px;
                font-weight: 600;
                word-break: break-word;
                flex: 1;
            }
            
            .swagger-ui-container .swagger-ui .opblock-summary .opblock-summary-description {
                font-size: 13px;
                color: #6b7280;
                margin-left: auto;
                text-align: right;
                max-width: 300px;
            }
            
            /* Operation body optimization */
            .swagger-ui-container .swagger-ui .opblock-body {
                border-top: 1px solid #e2e8f0;
                background: #fff;
                padding: 0;
            }
            
            .swagger-ui-container .swagger-ui .opblock-section {
                padding: 16px 20px;
            }
            
            .swagger-ui-container .swagger-ui .opblock-section-header {
                background: #f8f9fa;
                border-bottom: 1px solid #e2e8f0;
                padding: 12px 20px;
                margin: 0 -20px 16px -20px;
            }
            
            .swagger-ui-container .swagger-ui .opblock-section-header h4 {
                font-size: 14px;
                font-weight: 600;
                color: #374151;
                margin: 0;
            }
            
            /* Parameters optimization */
            .swagger-ui-container .swagger-ui .table-container {
                overflow-x: auto;
                margin: 8px 0;
            }
            
            .swagger-ui-container .swagger-ui table {
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
            }
            
            .swagger-ui-container .swagger-ui table thead tr th {
                background: #f8f9fa;
                border-bottom: 2px solid #e2e8f0;
                padding: 12px 8px;
                font-weight: 600;
                color: #374151;
                text-align: left;
            }
            
            .swagger-ui-container .swagger-ui table tbody tr td {
                padding: 12px 8px;
                border-bottom: 1px solid #f1f5f9;
                vertical-align: top;
            }
            
            .swagger-ui-container .swagger-ui .parameter__name {
                font-weight: 600;
                color: #1a202c;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            }
            
            .swagger-ui-container .swagger-ui .parameter__type {
                color: #805ad5;
                font-size: 12px;
                font-weight: 500;
            }
            
            .swagger-ui-container .swagger-ui .parameter__deprecated {
                text-decoration: line-through;
                opacity: 0.6;
            }
            
            .swagger-ui-container .swagger-ui .parameter__in {
                font-size: 11px;
                background: #edf2f7;
                color: #4a5568;
                padding: 2px 6px;
                border-radius: 3px;
                text-transform: uppercase;
                font-weight: 600;
            }
            
            /* Response optimization */
            .swagger-ui-container .swagger-ui .responses-inner {
                padding: 0;
            }
            
            .swagger-ui-container .swagger-ui .response {
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                margin-bottom: 12px;
                overflow: hidden;
            }
            
            .swagger-ui-container .swagger-ui .response .response-col_status {
                font-weight: 700;
                padding: 12px 16px;
                border-right: 1px solid #e2e8f0;
                background: #f8f9fa;
                min-width: 80px;
            }
            
            .swagger-ui-container .swagger-ui .response .response-col_description {
                padding: 12px 16px;
                flex: 1;
            }
            
            /* Code examples optimization */
            .swagger-ui-container .swagger-ui pre {
                background: #1a202c !important;
                color: #e2e8f0 !important;
                border-radius: 6px;
                padding: 16px;
                font-size: 13px;
                line-height: 1.4;
                overflow-x: auto;
                margin: 12px 0;
                border: none;
            }
            
            .swagger-ui-container .swagger-ui code {
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                background: transparent;
                color: inherit;
                padding: 0;
            }
            
            /* Model optimization */
            .swagger-ui-container .swagger-ui .model-box {
                background: #f8f9fa;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                padding: 16px;
                margin: 12px 0;
            }
            
            .swagger-ui-container .swagger-ui .model .model-title {
                font-size: 16px;
                font-weight: 600;
                color: #1a202c;
                margin-bottom: 12px;
            }
            
            .swagger-ui-container .swagger-ui .model-toggle {
                font-size: 12px;
                padding: 4px 8px;
                border-radius: 4px;
                background: #edf2f7;
                color: #4a5568;
                border: none;
                cursor: pointer;
            }
            
            /* Try it out optimization */
            .swagger-ui-container .swagger-ui .try-out {
                margin: 16px 0;
            }
            
            .swagger-ui-container .swagger-ui .btn {
                border-radius: 6px;
                font-weight: 600;
                padding: 8px 16px;
                font-size: 13px;
                border: 1px solid transparent;
                cursor: pointer;
            }
            
            .swagger-ui-container .swagger-ui .btn.execute {
                background: #3b82f6;
                color: white;
                border-color: #3b82f6;
            }
            
            .swagger-ui-container .swagger-ui .btn.execute:hover {
                background: #2563eb;
                border-color: #2563eb;
            }
            
            .swagger-ui-container .swagger-ui .btn.cancel {
                background: #6b7280;
                color: white;
                border-color: #6b7280;
            }
            
            .swagger-ui-container .swagger-ui .btn.try-out__btn {
                background: #10b981;
                color: white;
                border-color: #10b981;
            }
            
            /* Input optimization */
            .swagger-ui-container .swagger-ui input[type=text],
            .swagger-ui-container .swagger-ui input[type=password],
            .swagger-ui-container .swagger-ui input[type=search],
            .swagger-ui-container .swagger-ui input[type=email],
            .swagger-ui-container .swagger-ui input[type=url],
            .swagger-ui-container .swagger-ui textarea,
            .swagger-ui-container .swagger-ui select {
                border: 1px solid #d1d5db;
                border-radius: 6px;
                padding: 8px 12px;
                font-size: 14px;
                background: white;
                width: 100%;
                max-width: 400px;
            }
            
            .swagger-ui-container .swagger-ui input:focus,
            .swagger-ui-container .swagger-ui textarea:focus,
            .swagger-ui-container .swagger-ui select:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            
            /* Authentication optimization */
            .swagger-ui-container .swagger-ui .auth-wrapper {
                padding: 16px 20px;
                background: #fef3cd;
                border: 1px solid #fbbf24;
                border-radius: 6px;
                margin: 16px 0;
            }
            
            /* Scrollbar optimization */
            .swagger-ui-container .swagger-ui .wrapper::-webkit-scrollbar {
                width: 8px;
            }
            
            .swagger-ui-container .swagger-ui .wrapper::-webkit-scrollbar-track {
                background: #f1f5f9;
            }
            
            .swagger-ui-container .swagger-ui .wrapper::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 4px;
            }
            
            .swagger-ui-container .swagger-ui .wrapper::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
            }
            
            /* Mobile responsiveness */
            @media (max-width: 768px) {
                .swagger-ui-container .swagger-ui .info {
                    margin: 12px 16px;
                }
                
                .swagger-ui-container .swagger-ui .opblock-tag,
                .swagger-ui-container .swagger-ui .opblock-summary,
                .swagger-ui-container .swagger-ui .opblock-section {
                    padding-left: 16px;
                    padding-right: 16px;
                }
                
                .swagger-ui-container .swagger-ui .opblock-summary .opblock-summary-description {
                    display: none;
                }
                
                .swagger-ui-container .swagger-ui table {
                    font-size: 12px;
                }
                
                .swagger-ui-container .swagger-ui table thead tr th,
                .swagger-ui-container .swagger-ui table tbody tr td {
                    padding: 8px 4px;
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
        link.download = `openapi-spec.${fileExtension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const openInSwaggerEditor = () => {
        try {
            const encoded = encodeURIComponent(spec);
            const url = `https://editor.swagger.io/?url=data:text/yaml;charset=utf-8,${encoded}`;
            window.open(url, '_blank');
        } catch (error) {
            console.error('Failed to open in Swagger Editor:', error);
        }
    };

    if (isLoading) {
        return (
            <div className={`flex items-center justify-center h-full ${className}`}>
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    <p className="text-gray-600 font-medium">Loading API Documentation...</p>
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
                        <h3 className="font-semibold text-gray-900 mb-2">Error Loading API Specification</h3>
                        <p className="text-red-600 text-sm mb-4">{error}</p>
                        <div className="flex space-x-2 justify-center">
                            <Button variant="outline" size="sm" onClick={() => loadSwaggerUI()}>
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
        <div className={`h-full bg-white ${className} swagger-ui-container`}>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Code className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">
                                {parsedSpec?.info?.title || 'REST API Documentation'}
                            </h1>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    <span>Version {parsedSpec?.info?.version || '1.0.0'}</span>
                                </span>
                                <span>•</span>
                                <span>OpenAPI {parsedSpec?.openapi || '3.0.0'}</span>
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
                            onClick={openInSwaggerEditor}
                            leftIcon={<ExternalLink className="w-4 h-4" />}
                        >
                            Open in Editor
                        </Button>
                        {isFullscreen && onClose && (
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                <Minimize2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Swagger UI Container */}
            <div
                ref={containerRef}
                className="swagger-ui-wrapper"
                style={{
                    height: 'calc(100% - 80px)',
                    width: '100%',
                    position: 'relative'
                }}
            />
        </div>
    );
};

export default SwaggerViewer;