// src/components/forms/InfoCardForm.tsx - Fixed version
import React, { useState, useEffect } from 'react';
import { Eye, ExternalLink } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import ImageUpload from '../ui/ImageUpload';
import { validateRequired, generateId } from '@/utils/helpers.ts';
import type { InfoCard, ValidationResult } from '@/types';

const DISPLAY_TYPE_OPTIONS = [
    { value: 'imageLeft', label: 'Image Left' },
    { value: 'imageRight', label: 'Image Right' },
    { value: 'custom1', label: 'Custom Layout 1' },
    { value: 'custom2', label: 'Custom Layout 2' }
];

interface InfoCardFormProps {
    infoCard?: InfoCard | null;
    productId?: string; // Optional - for product-level info cards
    onSave: (infoCard: InfoCard) => void | Promise<void>;
    onCancel: () => void;
    onPreview?: (infoCard: InfoCard) => void;
    isEditing?: boolean;
}

const InfoCardForm: React.FC<InfoCardFormProps> = ({
                                                       infoCard,
                                                       productId, // Optional - used for product-specific cards
                                                       onSave,
                                                       onCancel,
                                                       onPreview,
                                                       isEditing = false
                                                   }) => {
    const [formData, setFormData] = useState<Partial<InfoCard>>({
        headline_title: '',
        brief_description: '',
        image_url: null,
        url: '',
        display_type: 'imageLeft',
        sort_order: 1,
        ...infoCard
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Update form when infoCard prop changes
    useEffect(() => {
        if (infoCard) {
            setFormData({
                headline_title: '',
                brief_description: '',
                image_url: null,
                url: '',
                display_type: 'imageLeft',
                sort_order: 1,
                ...infoCard
            });
        }
    }, [infoCard]);

    const updateField = (field: keyof InfoCard, value: any): void => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Required field validation
        if (!formData.headline_title?.trim()) {
            newErrors.headline_title = 'Headline title is required';
        }
        if (!formData.brief_description?.trim()) {
            newErrors.brief_description = 'Brief description is required';
        }
        if (!formData.url?.trim()) {
            newErrors.url = 'URL is required';
        } else {
            // URL format validation
            try {
                new URL(formData.url);
            } catch {
                newErrors.url = 'Please enter a valid URL';
            }
        }

        // Length validations
        if (formData.headline_title && formData.headline_title.length < 3) {
            newErrors.headline_title = 'Headline title must be at least 3 characters';
        }
        if (formData.brief_description && formData.brief_description.length < 10) {
            newErrors.brief_description = 'Brief description must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const infoCardData: InfoCard = {
                ...formData,
                id: formData.id || generateId(formData.headline_title || ''),
                headline_title: formData.headline_title || '',
                brief_description: formData.brief_description || '',
                url: formData.url || '',
                display_type: formData.display_type || 'imageLeft',
                sort_order: formData.sort_order || 1
            } as InfoCard;

            await onSave(infoCardData);
        } catch (error) {
            console.error('Failed to save info card:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePreview = (): void => {
        if (onPreview) {
            onPreview(formData as InfoCard);
        }
    };

    const renderPreview = () => {
        if (!formData.headline_title && !formData.brief_description) {
            return (
                <div className="text-center py-8 text-gray-500">
                    <p>Fill in the form to see a preview</p>
                </div>
            );
        }

        const getPreviewLayout = () => {
            const { display_type, image_url, headline_title, brief_description, url } = formData;

            const imageElement = image_url ? (
                <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden">
                    <img src={image_url} alt={headline_title} className="w-full h-full object-cover" />
                </div>
            ) : (
                <div className="w-32 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    No Image
                </div>
            );

            const contentElement = (
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-2">{headline_title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{brief_description}</p>
                    {url && (
                        <div className="flex items-center space-x-2">
                            <ExternalLink className="w-4 h-4 text-blue-600" />
                            <span className="text-xs text-blue-600 truncate">{url}</span>
                        </div>
                    )}
                </div>
            );

            switch (display_type) {
                case 'imageLeft':
                    return <div className="flex space-x-4">{imageElement}{contentElement}</div>;
                case 'imageRight':
                    return <div className="flex space-x-4">{contentElement}{imageElement}</div>;
                case 'custom1':
                    return (
                        <div className="space-y-3">
                            {image_url && <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                                <img src={image_url} alt={headline_title} className="w-full h-full object-cover" />
                            </div>}
                            {contentElement}
                        </div>
                    );
                case 'custom2':
                    return (
                        <div className="text-center space-y-3">
                            {image_url && <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full overflow-hidden">
                                <img src={image_url} alt={headline_title} className="w-full h-full object-cover" />
                            </div>}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">{headline_title}</h3>
                                <p className="text-sm text-gray-600 mb-2">{brief_description}</p>
                                {url && (
                                    <div className="flex items-center justify-center space-x-2">
                                        <ExternalLink className="w-4 h-4 text-blue-600" />
                                        <span className="text-xs text-blue-600">{url}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                default:
                    return <div className="flex space-x-4">{imageElement}{contentElement}</div>;
            }
        };

        return (
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
                {getPreviewLayout()}
            </div>
        );
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {isEditing ? 'Edit Info Card' : 'Create New Info Card'}
                        </h2>
                        <p className="text-gray-600 mt-1 text-sm">
                            {isEditing
                                ? 'Update your info card information'
                                : productId
                                    ? 'Add a new info card for this product'
                                    : 'Add a new info card for the landing page'
                            }
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handlePreview}
                            leftIcon={<Eye className="w-4 h-4" />}
                        >
                            Preview
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={isSubmitting}
                        >
                            {isEditing ? 'Update Info Card' : 'Create Info Card'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Fields */}
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

                            <div className="space-y-4">
                                <Input
                                    label="Headline Title"
                                    value={formData.headline_title || ''}
                                    onChange={(e) => updateField('headline_title', e.target.value)}
                                    error={errors.headline_title}
                                    required
                                    placeholder="e.g., Revolutionary Self-Checkout Solution"
                                />

                                <Textarea
                                    label="Brief Description"
                                    value={formData.brief_description || ''}
                                    onChange={(e) => updateField('brief_description', e.target.value)}
                                    error={errors.brief_description}
                                    required
                                    rows={3}
                                    placeholder="Brief description of the card content..."
                                    helperText="This appears as the main content of the card"
                                />

                                <Input
                                    label="URL"
                                    type="url"
                                    value={formData.url || ''}
                                    onChange={(e) => updateField('url', e.target.value)}
                                    error={errors.url}
                                    required
                                    placeholder="https://example.com"
                                    helperText="Link where users will be redirected when clicking the card"
                                />

                                <Select
                                    label="Display Type"
                                    value={formData.display_type || 'imageLeft'}
                                    onChange={(e) => updateField('display_type', e.target.value)}
                                    options={DISPLAY_TYPE_OPTIONS}
                                    required
                                    helperText="Choose how the card should be displayed"
                                />
                            </div>
                        </div>

                        {/* Visual Assets */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Assets</h3>

                            <ImageUpload
                                label="Card Image"
                                currentImage={formData.image_url}
                                onImageUpload={(image) => updateField('image_url', image)}
                                maxWidth={800}
                                maxHeight={600}
                                optional
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                            {renderPreview()}
                        </div>

                        {/* Display Type Examples */}
                        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                            <h4 className="font-medium text-blue-900 mb-2">Display Types</h4>
                            <div className="text-sm text-blue-800 space-y-1">
                                <p>• <strong>Image Left:</strong> Image on the left, content on the right</p>
                                <p>• <strong>Image Right:</strong> Content on the left, image on the right</p>
                                <p>• <strong>Custom Layout 1:</strong> Image on top, content below</p>
                                <p>• <strong>Custom Layout 2:</strong> Centered layout with circular image</p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default InfoCardForm;