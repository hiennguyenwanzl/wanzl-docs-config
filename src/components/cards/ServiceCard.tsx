import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import DefaultServiceIcon from '../ui/DefaultServiceIcon';

interface ServiceCardProps {
    service: {
        id: string;
        name: string;
        display_name?: string;
        short_description: string;
        category?: string;
        icon?: string | null;
        supported_protocols?: string[];
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
    return (
        <Card hover className="cursor-pointer group" onClick={onClick}>
            <div className="flex h-32">
                {/* Large Icon Section - Full Height */}
                <div className="w-32 h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-l-lg border-r border-gray-200 relative overflow-hidden">
                    {service.icon ? (
                        <img
                            src={service.icon}
                            alt={service.name}
                            className="w-28 h-28 object-contain z-10 rounded-lg"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-lg bg-blue-200 flex items-center justify-center z-10 shadow-inner">
                            <DefaultServiceIcon className="w-12 h-12 text-blue-600" size={48} />
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
                            <h3 className="font-semibold text-gray-900 leading-tight">
                                {service.display_name || service.name}
                            </h3>
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(service);
                                    }}
                                    className="hover:bg-blue-50 hover:text-blue-600"
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
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2 leading-relaxed">
                            {service.short_description}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
                                {service.category || 'General'}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                                {versionsCount} version{versionsCount !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {/* Protocol Tags */}
                        {service.supported_protocols && service.supported_protocols.length > 0 && (
                            <div className="flex items-center space-x-1">
                                {service.supported_protocols.map(protocol => (
                                    <span key={protocol} className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
                                        {protocol}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ServiceCard;