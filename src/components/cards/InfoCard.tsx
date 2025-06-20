// src/components/cards/InfoCard.tsx
import React from 'react';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface InfoCardProps {
    infoCard: {
        id: string;
        headline_title: string;
        brief_description: string;
        image_url?: string | null;
        url: string;
        display_type: 'imageLeft' | 'imageRight' | 'custom1' | 'custom2';
    };
    onClick: () => void;
    onEdit: (infoCard: any) => void;
    onDelete: (infoCardId: string) => void;
}

const InfoCard: React.FC<InfoCardProps> = ({
                                               infoCard,
                                               onClick,
                                               onEdit,
                                               onDelete
                                           }) => {
    const getDisplayTypeLayout = () => {
        const { display_type, image_url, headline_title, brief_description, url } = infoCard;

        const imageElement = image_url ? (
            <div className="w-32 h-24 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                <img
                    src={image_url}
                    alt={headline_title}
                    className="w-full h-full object-cover"
                />
            </div>
        ) : (
            <div className="w-32 h-24 flex-shrink-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-200 rounded text-blue-600 flex items-center justify-center text-sm font-semibold">
                    C
                </div>
            </div>
        );

        const contentElement = (
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 mb-2">
                    {headline_title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-3">
                    {brief_description}
                </p>
                <div className="flex items-center space-x-2">
                    <ExternalLink className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium truncate">
                        {url}
                    </span>
                </div>
            </div>
        );

        switch (display_type) {
            case 'imageLeft':
                return (
                    <div className="flex space-x-4">
                        {imageElement}
                        {contentElement}
                    </div>
                );
            case 'imageRight':
                return (
                    <div className="flex space-x-4">
                        {contentElement}
                        {imageElement}
                    </div>
                );
            case 'custom1':
                return (
                    <div className="space-y-3">
                        {image_url && (
                            <div className="w-full h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                                <img
                                    src={image_url}
                                    alt={headline_title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        {contentElement}
                    </div>
                );
            case 'custom2':
                return (
                    <div className="text-center space-y-3">
                        {image_url && (
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-full border border-gray-200 overflow-hidden">
                                <img
                                    src={image_url}
                                    alt={headline_title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg mb-2">
                                {headline_title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                                {brief_description}
                            </p>
                            <div className="flex items-center justify-center space-x-2">
                                <ExternalLink className="w-4 h-4 text-blue-600" />
                                <span className="text-xs text-blue-600 font-medium">
                                    {url}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="flex space-x-4">
                        {imageElement}
                        {contentElement}
                    </div>
                );
        }
    };

    return (
        <Card hover animate className="cursor-pointer group" onClick={onClick}>
            <div className="relative">
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(infoCard);
                        }}
                        className="hover:bg-blue-50 hover:text-blue-600 bg-white/90 backdrop-blur-sm"
                    >
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(infoCard.id);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-white/90 backdrop-blur-sm"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-4">
                    {getDisplayTypeLayout()}
                </div>

            </div>
        </Card>
    );
};

export default InfoCard;