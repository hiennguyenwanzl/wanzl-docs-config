// src/components/cards/ServiceCard.tsx
import React from 'react';
import { Edit2, Trash2, Code, Wifi } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface ServiceCardProps {
    service: {
        id: string;
        name: string;
        display_name?: string;
        short_description: string;
        category?: string;
        status?: string;
        icon?: string | null;
        protocol_type?: 'REST' | 'MQTT';
    };
    versionsCount: number;
    onClick: () => void;
    onEdit: (service: any) => void;
    onDelete: (serviceId: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
                                                     service,
                                                     versionsCount,
                                                     onClick,
                                                     onEdit,
                                                     onDelete
                                                 }) => {
    // Get protocol-specific styling and info
    const getProtocolInfo = () => {
        const protocolType = service.protocol_type || 'REST';

        if (protocolType === 'MQTT') {
            return {
                icon: <Wifi className="w-4 h-4 text-purple-600" />,
                label: 'MQTT API',
                bgColor: 'from-purple-50 to-purple-100',
                badgeColor: 'bg-purple-100 text-purple-700',
                iconBgColor: 'bg-purple-200',
                iconTextColor: 'text-purple-600'
            };
        } else {
            return {
                icon: <Code className="w-4 h-4 text-green-600" />,
                label: 'REST API',
                bgColor: 'from-green-50 to-green-100',
                badgeColor: 'bg-green-100 text-green-700',
                iconBgColor: 'bg-green-200',
                iconTextColor: 'text-green-600'
            };
        }
    };

    const protocolInfo = getProtocolInfo();

    return (
        <Card hover animate className="cursor-pointer group" onClick={onClick}>
            <div className="flex h-36">
                {/* Enhanced Icon Section with Protocol-specific Styling */}
                <div className={`w-36 h-full flex items-center justify-center bg-gradient-to-br ${protocolInfo.bgColor} rounded-l-lg border-r border-gray-200 relative overflow-hidden`}>
                    {service.icon ? (
                        <img
                            src={service.icon}
                            alt={service.name}
                            className="w-20 h-20 object-contain z-10 rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className={`w-16 h-16 rounded-lg ${protocolInfo.iconBgColor} flex items-center justify-center z-10 shadow-inner transition-transform duration-300 group-hover:scale-105`}>
                            <span className={`text-xl font-bold ${protocolInfo.iconTextColor}`}>S</span>
                        </div>
                    )}

                    {/* Background Pattern - only show if no icon */}
                    {!service.icon && (
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded"></div>
                            <div className="absolute bottom-3 left-3 w-4 h-4 bg-blue-300 rounded"></div>
                            <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-blue-400 rounded transform -translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 leading-tight truncate group-hover:text-blue-600 transition-colors duration-200">
                                    {service.display_name || service.name}
                                    {service.status && (
                                        <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                                            service.status === 'active'
                                                ? 'bg-green-100 text-green-700 group-hover:bg-green-200'
                                                : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'
                                        }`}>
                                            {service.status}
                                        </span>
                                    )}
                                </h3>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs text-gray-500 font-medium">
                                        {service.category || 'General'}
                                    </span>
                                    <span className="text-xs text-gray-400">•</span>
                                    <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${protocolInfo.badgeColor} group-hover:scale-105`}>
                                        {protocolInfo.icon}
                                        <span>{service.protocol_type || 'REST'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 flex-shrink-0">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(service);
                                    }}
                                    className="hover:bg-blue-50 hover:text-blue-600 transform hover:scale-105 transition-all duration-200"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(service.id);
                                    }}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 transform hover:scale-105 transition-all duration-200"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                            {service.short_description}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium transition-all duration-200 group-hover:bg-gray-200">
                                    {service.category || 'General'}
                                </span>
                                <span className="text-xs text-gray-500 font-medium">
                                    {versionsCount} version{versionsCount !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ServiceCard;