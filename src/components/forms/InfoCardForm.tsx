// src/components/forms/InfoCardForm.tsx
import React, { useState, useEffect } from 'react';
import { Eye, ExternalLink, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import ImageUpload from '../ui/ImageUpload';
import { validateRequired, generateId } from '@/utils/helpers.ts';
import type { InfoCard, ValidationResult } from '@/types';

const DISPLAY_TYPE_OPTIONS = [
    { value: 'imageLeft', label: 'Image Left' },
    { value: 'imageRight', label: 'Image Right' }
];

interface InfoCardFormProps {
    infoCard?: InfoCard | null;
    productId?: string;
    onSave: (infoCard: InfoCard) => void | Promise<void>;
    onCancel: () => void;
    isEditing?: boolean;
}

const InfoCardForm: React.FC<InfoCardFormProps> = ({
                                                       infoCard,
                                                       productId,
                                                       onSave,
                                                       onCancel,
                                                       isEditing = false
                                                   }) => {
    const [formData, setFormData] = useState<Partial<InfoCard>>({
        headline_title: '',
        brief_description: '',
        image_url: null,
        url: '',
        more_info_text: 'More Information', // Default value
        display_type: 'imageLeft',
        sort_order: 1,
        ...infoCard
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (infoCard) {
            setFormData({
                headline_title: '',
                brief_description: '',
                image_url: null,
                url: '',
                more_info_text: 'More Information',
                display_type: 'imageLeft',
                sort_order: 1,
                ...infoCard
            });
        }
    }, [infoCard]);

    const updateField = (field: keyof InfoCard, value: any): void => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.headline_title?.trim()) {
            newErrors.headline_title = 'Headline title is required';
        }
        if (!formData.brief_description?.trim()) {
            newErrors.brief_description = 'Brief description is required';
        }
        if (!formData.url?.trim()) {
            newErrors.url = 'URL is required';
        }

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
                more_info_text: formData.more_info_text || 'More Information',
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

    const renderPreview = () => {
        if (!formData.headline_title && !formData.brief_description) {
            return (
                <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Eye className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium mb-2">Live Preview</p>
                    <p className="text-sm">Fill in the form to see a preview of your info card</p>
                </div>
            );
        }

        const getPreviewLayout = () => {
            const { display_type, image_url, headline_title, brief_description, url, more_info_text } = formData;

            // Enhanced image element matching the card component
            const imageElement = image_url ? (
                <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg">
                    <img src={image_url} alt={headline_title} className="w-full h-full object-cover" />
                </div>
            ) : (
                <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border-2 border-blue-200 flex items-center justify-center shadow-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white flex items-center justify-center text-lg font-bold shadow-inner">
                        {headline_title ? headline_title.charAt(0).toUpperCase() : 'C'}
                    </div>
                </div>
            );

            // Enhanced link element matching the card component
            const linkElement = (
                <div className="inline-flex items-center group/link">
                    <div className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg cursor-pointer">
                        <span className="text-sm font-semibold mr-2">
                            {more_info_text || 'More Information'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            );

            const contentElement = (
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-xl leading-tight line-clamp-2 mb-4">
                        {headline_title || 'Your headline title'}
                    </h3>
                    <p className="text-gray-600 line-clamp-3 leading-relaxed mb-6 text-base">
                        {brief_description || 'Your brief description will appear here'}
                    </p>
                    {linkElement}
                </div>
            );

            switch (display_type) {
                case 'imageLeft':
                    return (
                        <div className="flex space-x-6 items-start">
                            {imageElement}
                            {contentElement}
                        </div>
                    );
                case 'imageRight':
                    return (
                        <div className="flex space-x-6 items-start">
                            {contentElement}
                            {imageElement}
                        </div>
                    );

                default:
                    return (
                        <div className="flex space-x-6 items-start">
                            {imageElement}
                            {contentElement}
                        </div>
                    );
            }
        };

        return (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
                {getPreviewLayout()}
            </div>
        );
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isEditing ? 'Edit Info Card' : 'Create New Info Card'}
                        </h2>
                        <p className="text-gray-600 mt-1">
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

                {/* Preview Section - Full Width at Top */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Eye className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-blue-900">Live Preview</h3>
                        <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            {formData.display_type?.replace(/([A-Z])/g, ' $1').toLowerCase() || 'image left'}
                        </span>
                    </div>
                    {renderPreview()}
                </div>

                {/* Form Fields - Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Basic Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Basic Information</span>
                        </h3>

                        <div className="space-y-6">
                            <Input
                                label="Headline Title"
                                value={formData.headline_title || ''}
                                onChange={(e) => updateField('headline_title', e.target.value)}
                                error={errors.headline_title}
                                required
                                placeholder="e.g., Revolutionary Self-Checkout Solution"
                                className="focus:ring-blue-500 focus:border-blue-500"
                            />

                            <Textarea
                                label="Brief Description"
                                value={formData.brief_description || ''}
                                onChange={(e) => updateField('brief_description', e.target.value)}
                                error={errors.brief_description}
                                required
                                rows={4}
                                placeholder="Brief description of the card content that will engage your users..."
                                helperText="This appears as the main content of the card"
                                className="focus:ring-blue-500 focus:border-blue-500"
                            />

                            <Input
                                label="Target URL"
                                type="text"
                                value={formData.url || ''}
                                onChange={(e) => updateField('url', e.target.value)}
                                error={errors.url}
                                required
                                placeholder="https://example.com/getting-started"
                                helperText="Where users will go when they click this card"
                                className="focus:ring-blue-500 focus:border-blue-500"
                            />

                            <Input
                                label="Link Button Text"
                                value={formData.more_info_text || ''}
                                onChange={(e) => updateField('more_info_text', e.target.value)}
                                placeholder="More Information"
                                helperText="Custom text for the call-to-action button (defaults to 'More Information')"
                                className="focus:ring-blue-500 focus:border-blue-500"
                            />

                            <Select
                                label="Display Layout"
                                value={formData.display_type || 'imageLeft'}
                                onChange={(e) => updateField('display_type', e.target.value)}
                                options={DISPLAY_TYPE_OPTIONS}
                                required
                                helperText="Choose how the card content should be arranged"
                                className="focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Visual Assets */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Visual Assets</span>
                        </h3>

                        <div className="space-y-6">
                            <ImageUpload
                                label="Card Image"
                                currentImage={formData.image_url}
                                onImageUpload={(image) => updateField('image_url', image)}
                                maxWidth={800}
                                maxHeight={600}
                                optional
                            />

                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-3">Image Guidelines by Layout</h4>
                                <div className="text-sm text-gray-600 space-y-2">
                                    <p>• <strong>Image Left/Right:</strong> Square images (1:1) work best for side positioning</p>
                                    <p>• <strong>Image Top (Card Style):</strong> Landscape images (16:9) are recommended</p>
                                    <p>• <strong>Centered Layout:</strong> Square images for profile-style circular display</p>
                                    <p>• Keep file size under 2MB for optimal loading performance</p>
                                    <p>• High resolution images will be automatically optimized</p>
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <h4 className="font-medium text-blue-900 mb-3">Link Button Design</h4>
                                <div className="text-sm text-blue-800 space-y-2">
                                    <p>• The button uses a modern gradient design with hover effects</p>
                                    <p>• Custom text allows you to match your brand voice</p>
                                    <p>• Arrow icon automatically animates on hover</p>
                                    <p>• Button scales and lifts on hover for better interaction feedback</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default InfoCardForm;