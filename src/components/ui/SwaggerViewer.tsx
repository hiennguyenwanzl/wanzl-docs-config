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

const SwaggerViewer: React.FC<SwaggerViewerProps> = ({
                                                         spec,
                                                         onClose,
                                                         isFullscreen = false,
                                                         className = ''
                                                     }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [parsedSpec, setParsedSpec] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const swaggerUIRef = useRef<any>(null);

    useEffect(() => {
        loadSwaggerUI();

        // Cleanup function to destroy SwaggerUI when component unmounts
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
                    // For YAML, we'll use js-yaml parser via CDN
                    const yamlModule = await loadYAMLParser();
                    specObject = yamlModule.load(spec);
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

    const loadSwaggerUILibrary = async () => {
        return new Promise((resolve, reject) => {
            if ((window as any).SwaggerUIBundle) {
                resolve((window as any).SwaggerUIBundle);
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
                standAloneScript.onload = () => resolve((window as any).SwaggerUIBundle);
                standAloneScript.onerror = () => reject(new Error('Failed to load Swagger UI standalone'));
                document.head.appendChild(standAloneScript);
            };
            script.onerror = () => reject(new Error('Failed to load Swagger UI bundle'));
            document.head.appendChild(script);
        });
    };

    const initializeSwaggerUI = (specObject: any) => {
        if (!containerRef.current || !(window as any).SwaggerUIBundle) return;

        try {
            // Clear previous instance
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }

            // Create container for Swagger UI
            const swaggerContainer = document.createElement('div');
            swaggerContainer.id = `swagger-ui-${Date.now()}`;
            swaggerContainer.style.height = '100%';
            containerRef.current.appendChild(swaggerContainer);

            // Initialize Swagger UI
            swaggerUIRef.current = (window as any).SwaggerUIBundle({
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
                tryItOutEnabled: false, // Disable try it out since this is for documentation purposes
                requestInterceptor: (req: any) => {
                    // Add any request modifications here
                    return req;
                },
                responseInterceptor: (res: any) => {
                    // Add any response modifications here
                    return res;
                },
                onComplete: () => {
                    console.log('Swagger UI loaded successfully');

                    // After initialization, fix scrollbars - traverse the DOM and remove any overflow styling
                    if (containerRef.current) {
                        const elements = containerRef.current.querySelectorAll('*');
                        elements.forEach(el => {
                            const element = el as HTMLElement;
                            if (element.style.overflow === 'auto') {
                                element.style.overflow = 'hidden';
                            }
                        });
                    }
                },
                presets: [
                    (window as any).SwaggerUIBundle.presets.apis,
                    (window as any).SwaggerUIStandalonePreset
                ],
                plugins: [
                    (window as any).SwaggerUIBundle.plugins.DownloadUrl
                ],
                supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'],
                validatorUrl: null // Disable validation
            });

            // Apply custom styles to fix scrollbars
            const styleEl = document.createElement('style');
            styleEl.textContent = `
                .swagger-ui .wrapper { height: 100%; }
                .swagger-ui .opblock-body { max-height: none !important; }
                .swagger-ui section.models { height: auto !important; }
                .swagger-ui .model-box { max-height: none !important; }
                .swagger-ui .opblock-body pre.microlight { max-height: none !important; }
                .swagger-ui .parameters-col_description input { display: none; }
                .swagger-ui .opblock-body .opblock-section { min-height: auto !important; }
                .swagger-ui .info .title small pre { max-height: none !important; }
                .swagger-ui .responses-inner { padding-bottom: 10px !important; }
            `;
            document.head.appendChild(styleEl);

        } catch (err) {
            console.error('Failed to initialize Swagger UI:', err);
            setError('Failed to initialize API documentation viewer');
        }
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
        link.download = 'openapi-spec.yaml';
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
                    <p className="text-gray-600">Loading Swagger UI...</p>
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
                        <p className="text-red-600 text-sm">{error}</p>
                        <div className="mt-4 space-x-2">
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
        <div className={`h-full bg-white ${className}`}>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                        <Code className="w-6 h-6 text-green-600" />
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">
                                {parsedSpec?.info?.title || 'REST API Documentation'}
                            </h1>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>Version {parsedSpec?.info?.version || '1.0.0'}</span>
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

            {/* Swagger UI Container - NO SCROLLBARS, FULL HEIGHT */}
            <div
                ref={containerRef}
                className="swagger-ui-container"
                style={{
                    height: isFullscreen ? 'calc(100vh - 80px)' : 'calc(100% - 80px)',
                    overflow: 'hidden' // Remove scrollbars as requested
                }}
            />

            {/* Custom Swagger UI Styles */}
            <style>{`
                .swagger-ui-container {
                    background: #fff;
                }
                
                .swagger-ui-container .swagger-ui .wrapper {
                    padding: 0;
                    max-width: none;
                }
                
                .swagger-ui-container .swagger-ui .info {
                    margin: 20px 0;
                    padding: 0 20px;
                }
                
                .swagger-ui-container .swagger-ui .scheme-container {
                    background: #fafafa;
                    padding: 10px 20px;
                    box-shadow: none;
                    margin: 0;
                }
                
                .swagger-ui-container .swagger-ui .opblock-tag {
                    border-bottom: 1px solid #ebebeb;
                    margin-bottom: 0;
                    padding: 10px 20px;
                }
                
                .swagger-ui-container .swagger-ui .opblock {
                    margin: 0 0 10px 0;
                    border: 1px solid #d9d9d9;
                    border-radius: 4px;
                    box-shadow: none;
                }
                
                .swagger-ui-container .swagger-ui .opblock.opblock-get .opblock-summary {
                    background: rgba(97, 175, 254, 0.1);
                    border-color: #61affe;
                }
                
                .swagger-ui-container .swagger-ui .opblock.opblock-post .opblock-summary {
                    background: rgba(73, 204, 144, 0.1);
                    border-color: #49cc90;
                }
                
                .swagger-ui-container .swagger-ui .opblock.opblock-put .opblock-summary {
                    background: rgba(252, 161, 48, 0.1);
                    border-color: #fca130;
                }
                
                .swagger-ui-container .swagger-ui .opblock.opblock-delete .opblock-summary {
                    background: rgba(249, 62, 62, 0.1);
                    border-color: #f93e3e;
                }
                
                /* Fix for overflowing content */
                .swagger-ui-container .swagger-ui pre.example {
                    max-height: none !important;
                    overflow: visible !important;
                }
                
                /* Fix for models container */
                .swagger-ui-container .swagger-ui section.models {
                    overflow: hidden !important;
                }
                
                /* Fix for try it out buttons */
                .swagger-ui-container .swagger-ui .try-out__btn {
                    display: none;
                }
                
                /* Better typography */
                .swagger-ui-container .swagger-ui,
                .swagger-ui-container .swagger-ui .opblock-summary-description {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                }
                
                /* Remove unnecessary borders */
                .swagger-ui-container .swagger-ui .opblock-body {
                    border-top: 1px solid rgba(59, 65, 81, 0.1);
                }
                
                /* Make headers more readable */
                .swagger-ui-container .swagger-ui .opblock .opblock-summary-operation-id,
                .swagger-ui-container .swagger-ui .opblock .opblock-summary-path,
                .swagger-ui-container .swagger-ui .opblock .opblock-summary-path__deprecated {
                    font-family: monospace;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    word-break: break-word;
                }
                
                /* Make sure parameter tables are readable */
                .swagger-ui-container .swagger-ui table {
                    table-layout: fixed;
                }
                
                .swagger-ui-container .swagger-ui .parameters-col_name {
                    width: 25%;
                }
                
                .swagger-ui-container .swagger-ui .parameters-col_description {
                    width: 75%;
                }
                
                /* Hide unnecessary scrollbars */
                .swagger-ui-container .swagger-ui div, 
                .swagger-ui-container .swagger-ui pre {
                    overflow: hidden !important;
                }
            `}</style>
        </div>
    );
};

export default SwaggerViewer;