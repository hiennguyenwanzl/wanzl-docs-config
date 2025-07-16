// src/components/cards/InfoCard.tsx
import React from 'react';
import { Edit2, Trash2, ArrowRight, ExternalLink } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface InfoCardProps {
    infoCard: {
        id: string;
        headline_title: string;
        brief_description: string;
        image_url?: string | null;
        url: string;
        display_type: 'imageLeft' | 'imageRight';
        more_info_text?: string;
    };
    onClick: () => void;
    onEdit: (infoCard: any) => void;
    onDelete: (infoCardId: string) => void;
    fullWidth?: boolean; // New prop for full-width display
}

const InfoCard: React.FC<InfoCardProps> = ({
                                               infoCard,
                                               onClick,
                                               onEdit,
                                               onDelete,
                                               fullWidth = false
                                           }) => {
    const getDisplayTypeLayout = () => {
        const { display_type, image_url, headline_title, brief_description, url, more_info_text } = infoCard;

        // Enhanced image element with diagonal cut styling
        const imageElement = image_url ? (
            <div className={`relative overflow-hidden ${
                fullWidth
                    ? 'flex-none w-1/3 min-h-[280px]'
                    : 'w-32 h-24'
            } bg-gradient-to-br from-gray-50 to-gray-100 ${
                fullWidth ? '' : 'rounded-2xl'
            } border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105`}
                 style={fullWidth ? {
                     clipPath: display_type === 'imageLeft'
                         ? 'polygon(0 0, 100% 0, 90% 100%, 0 100%)'
                         : 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)'
                 } : {}}
            >
                <img
                    src={image_url}
                    alt={headline_title}
                    className="w-full h-full object-cover"
                />
                {fullWidth && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                )}
            </div>
        ) : (
            <div className={`relative overflow-hidden ${
                fullWidth
                    ? 'flex-none w-1/3 min-h-[280px]'
                    : 'w-32 h-24'
            } bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ${
                fullWidth ? '' : 'rounded-2xl'
            } border-2 border-blue-200 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105`}
                 style={fullWidth ? {
                     clipPath: display_type === 'imageLeft'
                         ? 'polygon(0 0, 100% 0, 90% 100%, 0 100%)'
                         : 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)'
                 } : {}}
            >
                <div className={`${
                    fullWidth ? 'w-24 h-24' : 'w-12 h-12'
                } bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white flex items-center justify-center ${
                    fullWidth ? 'text-3xl' : 'text-lg'
                } font-bold shadow-inner`}>
                    {headline_title.charAt(0).toUpperCase()}
                </div>
                {fullWidth && (
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent"></div>
                )}
            </div>
        );

        // Enhanced link button with arrow and custom text
        const linkElement = (
            <div className="inline-flex items-center group/link">
                <div className={`flex items-center ${
                    fullWidth ? 'px-6 py-3' : 'px-4 py-2.5'
                } bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white ${
                    fullWidth ? 'rounded-xl' : 'rounded-xl'
                } shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 cursor-pointer`}>
                    <span className={`${
                        fullWidth ? 'text-base' : 'text-sm'
                    } font-semibold mr-3`}>
                        {more_info_text || 'More Information'}
                    </span>
                    <ArrowRight className={`${
                        fullWidth ? 'w-5 h-5' : 'w-4 h-4'
                    } transition-transform duration-300 group-hover/link:translate-x-1`} />
                </div>
            </div>
        );

        // Enhanced content element
        const contentElement = (
            <div className={`flex-1 min-w-0 ${fullWidth ? 'px-12 py-8' : ''}`}>
                <h3 className={`font-bold text-gray-900 ${
                    fullWidth ? 'text-3xl mb-6' : 'text-xl mb-4'
                } leading-tight line-clamp-2 group-hover:text-blue-700 transition-colors duration-300`}>
                    {headline_title}
                </h3>
                <p className={`text-gray-600 line-clamp-3 leading-relaxed ${
                    fullWidth ? 'text-lg mb-8' : 'text-base mb-6'
                }`}>
                    {brief_description}
                </p>
                {linkElement}
            </div>
        );

        if (fullWidth) {
            // Full-width card layout with diagonal cuts
            switch (display_type) {
                case 'imageLeft':
                    return (
                        <div className="flex items-stretch min-h-[280px]">
                            {imageElement}
                            <div className="flex-1 flex items-center bg-white">
                                {contentElement}
                            </div>
                        </div>
                    );
                case 'imageRight':
                    return (
                        <div className="flex items-stretch min-h-[280px]">
                            <div className="flex-1 flex items-center bg-white">
                                {contentElement}
                            </div>
                            {imageElement}
                        </div>
                    );
                default:
                    return (
                        <div className="flex items-stretch min-h-[280px]">
                            {imageElement}
                            <div className="flex-1 flex items-center bg-white">
                                {contentElement}
                            </div>
                        </div>
                    );
            }
        } else {
            // Regular card layout
            switch (display_type) {
                case 'imageLeft':
                    return (
                        <div className="flex space-x-6 items-start h-full">
                            {imageElement}
                            {contentElement}
                        </div>
                    );
                case 'imageRight':
                    return (
                        <div className="flex space-x-6 items-start h-full">
                            {contentElement}
                            {imageElement}
                        </div>
                    );
                default:
                    return (
                        <div className="flex space-x-6 items-start h-full">
                            {imageElement}
                            {contentElement}
                        </div>
                    );
            }
        }
    };

    if (fullWidth) {
        return (
            <div
                className="cursor-pointer group bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.01] hover:-translate-y-1 rounded-xl overflow-hidden shadow-xl mb-6"
                onClick={onClick}
            >
                <div className="relative">
                    {/* Enhanced Action Buttons for full-width */}
                    <div className="absolute top-6 right-6 flex space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(infoCard);
                            }}
                            className="hover:bg-blue-50 hover:text-blue-600 bg-white/95 backdrop-blur-sm shadow-lg border-2 border-blue-200 hover:border-blue-300 transform hover:scale-110 transition-all duration-200"
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
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-white/95 backdrop-blur-sm shadow-lg border-2 border-red-200 hover:border-red-300 transform hover:scale-110 transition-all duration-200"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Enhanced Content with gradient overlay effect */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-indigo-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                        {getDisplayTypeLayout()}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Card
            hover
            animate
            className="cursor-pointer group h-full bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2"
            onClick={onClick}
        >
            <div className="relative p-8 h-full">
                {/* Enhanced Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(infoCard);
                        }}
                        className="hover:bg-blue-50 hover:text-blue-600 bg-white/95 backdrop-blur-sm shadow-lg border-2 border-blue-200 hover:border-blue-300 transform hover:scale-110 transition-all duration-200"
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
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-white/95 backdrop-blur-sm shadow-lg border-2 border-red-200 hover:border-red-300 transform hover:scale-110 transition-all duration-200"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>

                {/* Enhanced Content with gradient overlay effect */}
                <div className="h-full flex flex-col relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-indigo-50/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                    {getDisplayTypeLayout()}
                </div>
            </div>
        </Card>
    );
};

export default InfoCard;