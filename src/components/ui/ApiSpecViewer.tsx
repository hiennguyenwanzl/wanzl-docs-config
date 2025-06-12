import React, { useState } from 'react';
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

    const renderViewer = (isFullscreen: boolean = false) => {
        if (type === 'swagger') {
            return (
                <SwaggerViewer
                    spec={spec.content}
                    onClose={isFullscreen ? () => setShowModal(false) : undefined}
                    isFullscreen={isFullscreen}
                    className={isFullscreen ? 'h-full' : 'h-96'}
                />
            );
        } else {
            return (
                <MqttViewer
                    spec={spec.content}
                    onClose={isFullscreen ? () => setShowModal(false) : undefined}
                    isFullscreen={isFullscreen}
                    className={isFullscreen ? 'h-full' : 'h-96'}
                />
            );
        }
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
                            {renderViewer(false)}
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