import React from 'react';
import { Edit2, Trash2, Code, FileText, Wifi } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface VersionCardProps {
    version: {
        version: string;
        status: string;
        release_date: string;
        deprecated?: boolean;
        beta?: boolean;
        breaking_changes?: boolean;
        introduction?: string;
        supported_apis?: string[];
        api_specs?: {
            openapi?: any;
            mqtt?: any;
        };
    };
    onClick: () => void;
    onEdit: (version: any) => void;
    onDelete: (versionId: string) => void;
}

const VersionCard: React.FC<VersionCardProps> = ({
                                                     version,
                                                     onClick,
                                                     onEdit,
                                                     onDelete
                                                 }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'stable': return 'bg-green-100 text-green-700';
            case 'beta': return 'bg-yellow-100 text-yellow-700';
            case 'deprecated': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getApiTypeIcon = () => {
        const hasSwagger = version.api_specs?.openapi || version.supported_apis?.includes('swagger');
        const hasMqtt = version.api_specs?.mqtt || version.supported_apis?.includes('mqtt');

        if (hasSwagger && hasMqtt) {
            return (
                <div className="flex items-center space-x-1">
                    <Code className="w-4 h-4 text-green-600" />
                    <Wifi className="w-4 h-4 text-purple-600" />
                </div>
            );
        } else if (hasMqtt) {
            return <Wifi className="w-8 h-8 text-purple-600" />;
        } else {
            return <Code className="w-8 h-8 text-green-600" />;
        }
    };

    const getApiTypeLabel = () => {
        const hasSwagger = version.api_specs?.openapi || version.supported_apis?.includes('swagger');
        const hasMqtt = version.api_specs?.mqtt || version.supported_apis?.includes('mqtt');

        if (hasSwagger && hasMqtt) {
            return 'REST + MQTT';
        } else if (hasMqtt) {
            return 'MQTT API';
        } else {
            return 'REST API';
        }
    };

    return (
        <Card hover className="cursor-pointer group" onClick={onClick}>
            <div className="flex h-28">
                {/* Icon Section */}
                <div className="w-28 h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-l-lg border-r border-gray-200 relative overflow-hidden">
                    <div className="z-10 flex flex-col items-center">
                        {getApiTypeIcon()}
                        <span className="text-xs text-indigo-600 mt-1 font-medium">
                            {getApiTypeLabel()}
                        </span>
                    </div>

                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded"></div>
                        <div className="absolute bottom-2 left-2 w-3 h-3 bg-indigo-300 rounded"></div>
                        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-indigo-400 rounded transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg">
                                    Version {version.version}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Released {new Date(version.release_date).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(version.status)}`}>
                                    {version.status}
                                </span>
                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(version);
                                        }}
                                        className="hover:bg-indigo-50 hover:text-indigo-600"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(version.version);
                                        }}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {version.introduction && (
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                {version.introduction}
                            </p>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="flex items-center space-x-2 mt-3">
                        {version.breaking_changes && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-medium">
                                Breaking Changes
                            </span>
                        )}
                        {version.deprecated && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-medium">
                                Deprecated
                            </span>
                        )}
                        {version.beta && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-medium">
                                Beta
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default VersionCard;