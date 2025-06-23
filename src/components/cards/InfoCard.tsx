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
            <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <img
                    src={image_url}
                    alt={headline_title}
                    className="w-full h-full object-cover"
                />
            </div>
        ) : (
            <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-gray-200 flex items-center justify-center shadow-sm">
                <div className="w-10 h-10 bg-blue-200 rounded-lg text-blue-600 flex items-center justify-center text-sm font-bold">
                    {headline_title.charAt(0).toUpperCase()}
                </div>
            </div>
        );

        const linkElement = (
            <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer">
                <ExternalLink className="w-3 h-3 mr-1.5" />
                <span className="truncate max-w-32">{url}</span>
            </div>
        );

        const contentElement = (
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 mb-3">
                    {headline_title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
                    {brief_description}
                </p>
                {linkElement}
            </div>
        );

        switch (display_type) {
            case 'imageLeft':
                return (
                    <div className="flex space-x-4 items-start">
                        {imageElement}
                        {contentElement}
                    </div>
                );
            case 'imageRight':
                return (
                    <div className="flex space-x-4 items-start">
                        {contentElement}
                        {imageElement}
                    </div>
                );
            case 'custom1':
                return (
                    <div className="space-y-4">
                        {image_url && (
                            <div className="w-full h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                <img
                                    src={image_url}
                                    alt={headline_title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 mb-3">
                                {headline_title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
                                {brief_description}
                            </p>
                            {linkElement}
                        </div>
                    </div>
                );
            case 'custom2':
                return (
                    <div className="text-center space-y-4">
                        {image_url ? (
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-full border border-gray-200 overflow-hidden shadow-sm">
                                <img
                                    src={image_url}
                                    alt={headline_title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-full border border-gray-200 flex items-center justify-center shadow-sm">
                                <div className="w-12 h-12 bg-blue-200 rounded-full text-blue-600 flex items-center justify-center text-lg font-bold">
                                    {headline_title.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        )}
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg mb-3">
                                {headline_title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                                {brief_description}
                            </p>
                            <div className="flex justify-center">
                                {linkElement}
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="flex space-x-4 items-start">
                        {imageElement}
                        {contentElement}
                    </div>
                );
        }
    };

    return (
        <Card
            hover
            animate
            className="cursor-pointer group h-full bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            onClick={onClick}
        >
            <div className="relative p-6 h-full">
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(infoCard);
                        }}
                        className="hover:bg-blue-50 hover:text-blue-600 bg-white/95 backdrop-blur-sm shadow-sm border border-gray-200"
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
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-white/95 backdrop-blur-sm shadow-sm border border-gray-200"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="h-full flex flex-col">
                    {getDisplayTypeLayout()}
                </div>
            </div>
        </Card>
    );
};

export default InfoCard;