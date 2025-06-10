import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import ImageUpload from '../ui/ImageUpload';
import { DEFAULTS, CATEGORY_OPTIONS, STATUS_OPTIONS, VALIDATION } from '../../constants';
import { validateRequired, generateId } from '../../utils/helpers';
import type { ProductFormProps, Product, UseCase, ValidationResult } from '../../types';

const ProductForm: React.FC<ProductFormProps> = ({
                                                     product,
                                                     onSave,
                                                     onCancel,
                                                     onPreview,
                                                     isEditing = false
                                                 }) => {
    const [formData, setFormData] = useState<Partial<Product>>({
        ...DEFAULTS.PRODUCT,
        ...product
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Update form when product prop changes
    useEffect(() => {
        if (product) {
            setFormData({
                ...DEFAULTS.PRODUCT,
                ...product
            });
        }
    }, [product]);

    const updateField = (field: keyof Product, value: any): void => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const addFeature = (): void => {
        setFormData(prev => ({
            ...prev,
            key_features: [...(prev.key_features || []), '']
        }));
    };

    const updateFeature = (index: number, value: string): void => {
        setFormData(prev => ({
            ...prev,
            key_features: prev.key_features?.map((f, i) => i === index ? value : f) || []
        }));
    };

    const removeFeature = (index: number): void => {
        setFormData(prev => ({
            ...prev,
            key_features: prev.key_features?.filter((_, i) => i !== index) || []
        }));
    };

    const addUseCase = (): void => {
        setFormData(prev => ({
            ...prev,
            use_cases: [...(prev.use_cases || []), { title: '', description: '' }]
        }));
    };

    const updateUseCase = (index: number, field: keyof UseCase, value: string): void => {
        setFormData(prev => ({
            ...prev,
            use_cases: prev.use_cases?.map((uc, i) =>
                i === index ? { ...uc, [field]: value } : uc
            ) || []
        }));
    };

    const removeUseCase = (index: number): void => {
        setFormData(prev => ({
            ...prev,
            use_cases: prev.use_cases?.filter((_, i) => i !== index) || []
        }));
    };

    const validateForm = (): boolean => {
        const validation: ValidationResult = validateRequired(
            formData as Record<string, any>,
            VALIDATION.REQUIRED_FIELDS.PRODUCT
        );
        const newErrors = { ...validation.errors };

        // Additional validations
        if (formData.name && formData.name.length < VALIDATION.MIN_LENGTHS.name) {
            newErrors.name = `Name must be at least ${VALIDATION.MIN_LENGTHS.name} characters`;
        }

        if (formData.short_description && formData.short_description.length < VALIDATION.MIN_LENGTHS.short_description) {
            newErrors.short_description = `Description must be at least ${VALIDATION.MIN_LENGTHS.short_description} characters`;
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
            const productData: Product = {
                ...formData,
                id: formData.id || generateId(formData.name || ''),
                name: formData.name || '',
                short_description: formData.short_description || '',
                category: formData.category || 'other',
                status: formData.status || 'active',
                key_features: (formData.key_features || []).filter(f => f.trim()),
                use_cases: (formData.use_cases || []).filter(uc => uc.title.trim() || uc.description.trim()),
                sort_order: formData.sort_order || 1,
                // Set display_name to name if not provided
                display_name: formData.display_name || formData.name
            } as Product;

            await onSave(productData);
        } catch (error) {
            console.error('Failed to save product:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePreview = (): void => {
        if (onPreview) {
            onPreview(formData as Product);
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {isEditing ? 'Edit Product' : 'Create New Product'}
                        </h2>
                        <p className="text-gray-600 mt-1 text-sm">
                            {isEditing ? 'Update your product information' : 'Add a new product to your documentation'}
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
                            {isEditing ? 'Update Product' : 'Create Product'}
                        </Button>
                    </div>
                </div>

                {/* Basic Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <Input
                            label="Product Name"
                            value={formData.name || ''}
                            onChange={(e) => updateField('name', e.target.value)}
                            error={errors.name}
                            required
                            placeholder="e.g., FastLaner"
                        />
                        <Input
                            label="Display Name"
                            value={formData.display_name || ''}
                            onChange={(e) => updateField('display_name', e.target.value)}
                            error={errors.display_name}
                            placeholder="e.g., Fast Laner"
                            helperText="How the name appears in the UI (optional)"
                        />
                    </div>

                    <div className="mt-6">
                        <Textarea
                            label="Short Description"
                            value={formData.short_description || ''}
                            onChange={(e) => updateField('short_description', e.target.value)}
                            error={errors.short_description}
                            required
                            placeholder="Brief description of what this product does..."
                            helperText="This appears in product cards and listings"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
                        <Select
                            label="Category"
                            value={formData.category || ''}
                            onChange={(e) => updateField('category', e.target.value)}
                            options={CATEGORY_OPTIONS}
                            required
                        />
                        <Select
                            label="Status"
                            value={formData.status || ''}
                            onChange={(e) => updateField('status', e.target.value)}
                            options={STATUS_OPTIONS}
                        />
                    </div>
                </div>

                {/* Detailed Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Information</h3>

                    <Textarea
                        label="Overview"
                        value={formData.overview || ''}
                        onChange={(e) => updateField('overview', e.target.value)}
                        rows={4}
                        placeholder="Detailed description of the product, its purpose, and benefits..."
                        helperText="This appears on the product detail page"
                    />

                    {/* Key Features */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Key Features
                            </label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addFeature}
                                leftIcon={<Plus className="w-4 h-4" />}
                            >
                                Add Feature
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {(formData.key_features || ['']).map((feature, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <Input
                                        value={feature}
                                        onChange={(e) => updateFeature(index, e.target.value)}
                                        placeholder="Enter a key feature..."
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFeature(index)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Use Cases */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Use Cases
                            </label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addUseCase}
                                leftIcon={<Plus className="w-4 h-4" />}
                            >
                                Add Use Case
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {(formData.use_cases || [{ title: '', description: '' }]).map((useCase, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-1 space-y-3">
                                            <Input
                                                label="Title"
                                                value={useCase.title}
                                                onChange={(e) => updateUseCase(index, 'title', e.target.value)}
                                                placeholder="e.g., Retail Stores"
                                            />
                                            <Textarea
                                                label="Description"
                                                value={useCase.description}
                                                onChange={(e) => updateUseCase(index, 'description', e.target.value)}
                                                placeholder="Describe how this product is used in this scenario..."
                                                rows={2}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeUseCase(index)}
                                            className="text-red-600 hover:text-red-700 mt-6"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Visual Assets */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Assets</h3>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <ImageUpload
                            label="Product Icon"
                            currentImage={formData.icon}
                            onImageUpload={(image) => updateField('icon', image)}
                            maxWidth={200}
                            maxHeight={200}
                        />

                        <ImageUpload
                            label="Hero Image"
                            currentImage={formData.hero_image}
                            onImageUpload={(image) => updateField('hero_image', image)}
                            maxWidth={1200}
                            maxHeight={600}
                        />
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Gallery Images
                        </label>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {(formData.gallery_images || []).map((image, index) => (
                                <div key={index} className="relative">
                                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                            src={image}
                                            alt={`Gallery ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="danger"
                                        size="sm"
                                        onClick={() => {
                                            setFormData(prev => ({
                                                ...prev,
                                                gallery_images: prev.gallery_images?.filter((_, i) => i !== index) || []
                                            }));
                                        }}
                                        className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            ))}
                            <div className="min-h-[150px]">
                                <ImageUpload
                                    label="Add Gallery Image"
                                    onImageUpload={(image) => {
                                        if (image) {
                                            setFormData(prev => ({
                                                ...prev,
                                                gallery_images: [...(prev.gallery_images || []), image]
                                            }));
                                        }
                                    }}
                                    showPreview={false}
                                    className="h-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;