// src/components/views/InfoCardDetailView.tsx
import React from 'react';
import { Edit2, Trash2, ExternalLink, ArrowLeft } from 'lucide-react';
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
        const { display_type, image_url, headline_title, brief_description, url } = infoCard;

        const imageElement = image_url ? (
            <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden">
                <img src={image_url} alt={headline_title} className="w-full h-full object-cover" />
            </div>
        ) : (
            <div className="w-32 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                <span className="text-sm">No Image</span>
            </div>
        );

        const contentElement = (
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-2">{headline_title}</h3>
                <p className="text-sm text-gray-600 mb-2">{brief_description}</p>
                {url && (
                    <div className="flex items-center space-x-2">
                        <ExternalLink className="w-4 h-4 text-blue-600" />
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 truncate"
                        >
                            {url}
                        </a>
                    </div>
                )}
            </div>
        );

        switch (display_type) {
            case 'imageLeft':
                return <div className="flex space-x-4">{imageElement}{contentElement}</div>;
            case 'imageRight':
                return <div className="flex space-x-4">{contentElement}{imageElement}</div>;

            default:
                return <div className="flex space-x-4">{imageElement}{contentElement}</div>;
        }
    };

    return (
        <div className="p-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Preview */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Card Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border border-gray-200 rounded-lg p-6 bg-white">
                            {renderInfoCardPreview()}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default InfoCardDetailView;