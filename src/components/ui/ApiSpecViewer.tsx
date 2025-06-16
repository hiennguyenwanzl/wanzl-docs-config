import React, { useState, useEffect } from 'react';
import {
    Code,
    FileText,
    Copy,
    Download,
    Maximize2,
    X
} from 'lucide-react';
import Button from '../ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import Modal from '../ui/Modal';
import SwaggerViewer from './SwaggerViewer';
import MqttViewer from './MqttViewer';

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

const ApiSpecViewer: React.FC<ApiSpecViewerProps> = ({
                                                         spec,
                                                         type,
                                                         title,
                                                         className = ''
                                                     }) => {
    const [viewMode, setViewMode] = useState<'ui' | 'code'>('ui');
    const [showModal, setShowModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isViewerReady, setIsViewerReady] = useState(false);

    // Reset viewer ready state when switching modes
    useEffect(() => {
        setIsViewerReady(false);
        // Small delay to ensure component re-renders properly
        const timer = setTimeout(() => {
            setIsViewerReady(true);
        }, 100);

        return () => clearTimeout(timer);
    }, [viewMode, spec.content]);

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

    const getProtocolInfo = () => {
        if (type === 'swagger') {
            return {
                name: 'OpenAPI/Swagger',
                protocol: 'REST API',
                color: 'green'
            };
        } else {
            return {
                name: 'AsyncAPI',
                protocol: 'MQTT',
                color: 'purple'
            };
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

    const renderViewer = (isFullscreen: boolean = false) => {
        if (!isViewerReady) {
            return (
                <div className="h-full flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
                            type === 'swagger' ? 'border-green-600' : 'border-purple-600'
                        }`}></div>
                        <p className="text-gray-600 text-sm">Loading API documentation...</p>
                    </div>
                </div>
            );
        }

        if (type === 'swagger') {
            return (
                <SwaggerViewer
                    spec={spec.content}
                    onClose={isFullscreen ? () => setShowModal(false) : undefined}
                    isFullscreen={isFullscreen}
                    className="h-full"
                />
            );
        } else {
            return (
                <MqttViewer
                    spec={spec.content}
                    onClose={isFullscreen ? () => setShowModal(false) : undefined}
                    isFullscreen={isFullscreen}
                    className="h-full"
                />
            );
        }
    };

    const renderCodeView = () => {
        return (
            <div className="h-full overflow-hidden bg-gray-900 relative">
                <div className="absolute top-4 right-4 z-10">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                        <Copy className="w-4 h-4 mr-1" />
                        {copied ? 'Copied!' : 'Copy'}
                    </Button>
                </div>
                <div className="h-full overflow-auto">
                    <pre className="p-6 text-sm text-gray-100 font-mono leading-relaxed h-full">
                        <code className={`language-${getLanguage()}`}>
                            {spec.content}
                        </code>
                    </pre>
                </div>
            </div>
        );
    };

    const protocolInfo = getProtocolInfo();

    return (
        <>
            <Card className={`${className} overflow-hidden shadow-lg border-2`}>
                <CardHeader className={`${getHeaderColor()} border-b-2`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl ${
                                type === 'swagger' ? 'bg-green-100' : 'bg-purple-100'
                            }`}>
                                {getIcon()}
                            </div>
                            <div>
                                <CardTitle className={`text-lg font-bold ${getTitleColor()}`}>
                                    {title}
                                </CardTitle>
                                <div className="flex items-center space-x-3 mt-1">
                                    <span className="text-sm text-gray-600">{spec.name}</span>
                                    <span className="text-gray-400">•</span>
                                    <span className={`text-sm font-medium ${
                                        type === 'swagger' ? 'text-green-700' : 'text-purple-700'
                                    }`}>
                                        {protocolInfo.protocol}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            {/* View Mode Toggle */}
                            <div className="flex rounded-lg border-2 border-gray-300 overflow-hidden shadow-sm">
                                <button
                                    onClick={() => setViewMode('ui')}
                                    className={`px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                                        viewMode === 'ui'
                                            ? `${type === 'swagger' ? 'bg-green-500 text-white' : 'bg-purple-500 text-white'}`
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Interactive
                                </button>
                                <button
                                    onClick={() => setViewMode('code')}
                                    className={`px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                                        viewMode === 'code'
                                            ? `${type === 'swagger' ? 'bg-green-500 text-white' : 'bg-purple-500 text-white'}`
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Source
                                </button>
                            </div>

                            {/* Action Buttons */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopy}
                                leftIcon={<Copy className="w-4 h-4" />}
                                className="text-gray-600 hover:text-gray-900 hover:bg-white/50"
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDownload}
                                leftIcon={<Download className="w-4 h-4" />}
                                className="text-gray-600 hover:text-gray-900 hover:bg-white/50"
                            >
                                Download
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={openFullscreen}
                                leftIcon={<Maximize2 className="w-4 h-4" />}
                                className="text-gray-600 hover:text-gray-900 hover:bg-white/50"
                            >
                                Fullscreen
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0 relative">
                    <div
                        className="w-full"
                        style={{ height: '600px' }}
                    >
                        {viewMode === 'ui' ? (
                            <div className="h-full overflow-hidden">
                                {renderViewer(false)}
                            </div>
                        ) : (
                            renderCodeView()
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Fullscreen Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title=""
                size="full"
                showCloseButton={false}
            >
                <div className="h-full w-full">
                    {renderViewer(true)}
                </div>
            </Modal>
        </>
    );
};

export default ApiSpecViewer;