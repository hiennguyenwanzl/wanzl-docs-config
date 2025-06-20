// src/components/views/InfoCardsGridView.tsx
import React from 'react';
import { Plus, Eye } from 'lucide-react';
import Button from '../ui/Button';
import InfoCard from '../cards/InfoCard';
import EmptyState from '../ui/EmptyState';
import type { InfoCard as InfoCardType } from '@/types';

interface InfoCardsGridViewProps {
    infoCards: InfoCardType[];
    title: string;
    description: string;
    onAddInfoCard: () => void;
    onEditInfoCard: (infoCard: InfoCardType) => void;
    onDeleteInfoCard: (infoCardId: string) => void;
    onSelectInfoCard: (infoCardId: string) => void;
    onPreview?: () => void;
    isProductLevel?: boolean;
    productName?: string;
}

const InfoCardsGridView: React.FC<InfoCardsGridViewProps> = ({
                                                                 infoCards,
                                                                 title,
                                                                 description,
                                                                 onAddInfoCard,
                                                                 onEditInfoCard,
                                                                 onDeleteInfoCard,
                                                                 onSelectInfoCard,
                                                                 onPreview,
                                                                 isProductLevel = false,
                                                                 productName
                                                             }) => {
    const handleDeleteInfoCard = (infoCardId: string) => {
        if (confirm('Are you sure you want to delete this info card?')) {
            onDeleteInfoCard(infoCardId);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    <p className="text-gray-600">{description}</p>
                    {isProductLevel && productName && (
                        <p className="text-sm text-gray-500 mt-1">Product: {productName}</p>
                    )}
                </div>
                <div className="flex space-x-3">
                    {onPreview && (
                        <Button
                            variant="outline"
                            onClick={onPreview}
                            leftIcon={<Eye className="w-4 h-4" />}
                        >
                            Preview
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        onClick={onAddInfoCard}
                        leftIcon={<Plus className="w-4 h-4" />}
                    >
                        Add Info Card
                    </Button>
                </div>
            </div>

            {infoCards.length === 0 ? (
                <EmptyState
                    title="No info cards yet"
                    description={
                        isProductLevel
                            ? "Add info cards to showcase this product's features and benefits"
                            : "Create info cards to populate your landing page with engaging content"
                    }
                    actionLabel="Add Info Card"
                    onAction={onAddInfoCard}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {infoCards
                        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                        .map(infoCard => (
                            <InfoCard
                                key={infoCard.id}
                                infoCard={infoCard}
                                onClick={() => onSelectInfoCard(infoCard.id)}
                                onEdit={onEditInfoCard}
                                onDelete={handleDeleteInfoCard}
                            />
                        ))
                    }
                </div>
            )}

            {/* Info Cards Usage Tips */}
            {infoCards.length > 0 && (
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">
                        {isProductLevel ? 'Product Info Cards Tips' : 'Landing Page Info Cards Tips'}
                    </h3>
                    <div className="text-sm text-blue-800 space-y-1">
                        {isProductLevel ? (
                            <>
                                <p>• Use product info cards to highlight key features and benefits</p>
                                <p>• Link to detailed documentation or product demos</p>
                                <p>• Keep descriptions concise but informative</p>
                                <p>• Use high-quality images that represent your product</p>
                            </>
                        ) : (
                            <>
                                <p>• Landing page cards appear on your documentation homepage</p>
                                <p>• Use them to guide users to important sections</p>
                                <p>• Mix different display types for visual variety</p>
                                <p>• Order them by importance using sort order</p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfoCardsGridView;