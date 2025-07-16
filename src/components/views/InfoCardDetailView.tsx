// src/components/views/InfoCardDetailView.tsx
import React from 'react';
import { Edit2, Trash2, ExternalLink, ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import Breadcrumb from '../ui/Breadcrumb';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import type { InfoCard } from '@/types';

interface InfoCardDetailViewProps {
    infoCard: InfoCard;
    onGoBack: () => void;
    onGoToLandingPage: () => void;
    onEdit: (infoCard: InfoCard) => void;
    onDelete: (infoCardId: string) => void;
    isProductLevel?: boolean;
    productName?: string;
}

const InfoCardDetailView: React.FC<InfoCardDetailViewProps> = ({
                                                                   infoCard,
                                                                   onGoBack,
                                                                   onGoToLandingPage,
                                                                   onEdit,
                                                                   onDelete,
                                                                   isProductLevel = false,
                                                                   productName
                                                               }) => {
    const breadcrumbItems = [
        {
            key: 'home',
            label: 'Landing Page',
            onClick: onGoToLandingPage
        },
        {
            key: 'product',
            label: productName,
            onClick: onGoBack,
            visible: isProductLevel
        },
        {
            key: 'infocard',
            label: infoCard.headline_title,
            isActive: true
        }
    ];

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this info card?')) {
            onDelete(infoCard.id);
        }
    };

    const renderInfoCardPreview = () => {
        const { display_type, image_url, headline_title, brief_description, url, more_info_text } = infoCard;

        // Enhanced image element with diagonal cut styling
        const imageElement = image_url ? (
            <div
                className="flex-none w-1/3 min-h-[280px] relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 shadow-lg"
                style={{
                    clipPath: display_type === 'imageLeft'
                        ? 'polygon(0 0, 100% 0, 90% 100%, 0 100%)'
                        : 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)'
                }}
            >
                <img src={image_url} alt={headline_title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
        ) : (
            <div
                className="flex-none w-1/3 min-h-[280px] relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 flex items-center justify-center shadow-lg"
                style={{
                    clipPath: display_type === 'imageLeft'
                        ? 'polygon(0 0, 100% 0, 90% 100%, 0 100%)'
                        : 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)'
                }}
            >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white flex items-center justify-center text-3xl font-bold shadow-inner">
                    {headline_title.charAt(0).toUpperCase()}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent"></div>
            </div>
        );

        // Enhanced link button
        const linkElement = (
            <div className="inline-flex items-center group/link">
                <div className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 cursor-pointer">
                    <span className="text-base font-semibold mr-3">
                        {more_info_text || 'More Information'}
                    </span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/link:translate-x-1" />
                </div>
            </div>
        );

        const contentElement = (
            <div className="flex-1 flex items-center bg-white px-12 py-8">
                <div className="w-full">
                    <h3 className="font-bold text-gray-900 text-3xl mb-6 leading-tight line-clamp-2">
                        {headline_title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3 leading-relaxed text-lg mb-8">
                        {brief_description}
                    </p>
                    {linkElement}
                </div>
            </div>
        );

        switch (display_type) {
            case 'imageLeft':
                return (
                    <div className="flex items-stretch min-h-[280px]">
                        {imageElement}
                        {contentElement}
                    </div>
                );
            case 'imageRight':
                return (
                    <div className="flex items-stretch min-h-[280px]">
                        {contentElement}
                        {imageElement}
                    </div>
                );
            default:
                return (
                    <div className="flex items-stretch min-h-[280px]">
                        {imageElement}
                        {contentElement}
                    </div>
                );
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Breadcrumb items={breadcrumbItems} />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{infoCard.headline_title}</h1>
                    <p className="text-gray-600">
                        {isProductLevel ? `Product info card for ${productName}` : 'Landing page info card'}
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Button
                        variant="outline"
                        onClick={onGoBack}
                        leftIcon={<ArrowLeft className="w-4 h-4" />}
                    >
                        Back
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onEdit(infoCard)}
                        leftIcon={<Edit2 className="w-4 h-4" />}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        leftIcon={<Trash2 className="w-4 h-4" />}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            {/* Full-Width Preview */}
            <div className="mb-8">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Card Preview</h2>
                    <p className="text-gray-600">This is how your info card will appear to users</p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-xl">
                    {renderInfoCardPreview()}
                </div>
            </div>

            {/* Card Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Card Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Headline Title</label>
                                <p className="text-gray-900 font-medium">{infoCard.headline_title}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Description</label>
                                <p className="text-gray-900">{infoCard.brief_description}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Button Text</label>
                                <p className="text-gray-900">{infoCard.more_info_text || 'More Information'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Display Type</label>
                                <p className="text-gray-900 capitalize">{infoCard.display_type.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Link & Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Target URL</label>
                                <div className="flex items-center space-x-2 mt-1">
                                    <ExternalLink className="w-4 h-4 text-blue-600" />
                                    <a
                                        href={infoCard.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 truncate font-medium"
                                    >
                                        {infoCard.url}
                                    </a>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Image</label>
                                <p className="text-gray-900">
                                    {infoCard.image_url ? 'Custom image uploaded' : 'Using default icon'}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Sort Order</label>
                                <p className="text-gray-900">{infoCard.sort_order || 1}</p>
                            </div>
                            {isProductLevel && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Scope</label>
                                    <p className="text-gray-900">Product-level info card</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Usage Tips */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-medium text-blue-900 mb-3">Info Card Usage Tips</h3>
                <div className="text-sm text-blue-800 space-y-2">
                    <p>• <strong>Diagonal Design:</strong> The angled image cut creates a modern, dynamic appearance</p>
                    <p>• <strong>Button Customization:</strong> Use descriptive button text like "Get Started", "Learn More", or "View Documentation"</p>
                    <p>• <strong>Image Guidelines:</strong> Use high-quality images that represent your content. Square images work best for the diagonal cut</p>
                    <p>• <strong>Layout Variation:</strong> Alternate between "Image Left" and "Image Right" for visual variety in your card grid</p>
                    <p>• <strong>Content Length:</strong> Keep headlines under 60 characters and descriptions under 150 characters for best display</p>
                </div>
            </div>
        </div>
    );
};

export default InfoCardDetailView;