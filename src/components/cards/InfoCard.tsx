// src/components/cards/InfoCard.tsx - Updated with better UI and link design
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
        more_info_text?: string; // New field for custom link text
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
        const { display_type, image_url, headline_title, brief_description, url, more_info_text } = infoCard;

        // Enhanced image element with better styling
        const imageElement = image_url ? (
            <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <img
                    src={image_url}
                    alt={headline_title}
                    className="w-full h-full object-cover"
                />
            </div>
        ) : (
            <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border-2 border-gradient-to-r from-blue-200 to-indigo-200 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white flex items-center justify-center text-lg font-bold shadow-inner">
                    {headline_title.charAt(0).toUpperCase()}
                </div>
            </div>
        );

        // Enhanced link button with arrow and custom text
        const linkElement = (
            <div className="inline-flex items-center group/link">
                <div className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 cursor-pointer">
                    <span className="text-sm font-semibold mr-2">
                        {more_info_text || 'More Information'}
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                </div>
            </div>
        );

        // Enhanced content element
        const contentElement = (
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-xl leading-tight line-clamp-2 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                    {headline_title}
                </h3>
                <p className="text-gray-600 line-clamp-3 leading-relaxed mb-6 text-base">
                    {brief_description}
                </p>
                {linkElement}
            </div>
        );

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
    };

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