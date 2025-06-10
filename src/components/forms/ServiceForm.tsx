import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye } from 'lucide-react';
import Button from '../ui/Button.js';
import Input from '../ui/Input.js';
import Textarea from '../ui/Textarea.js';
import Select from '../ui/Select.js';
import ImageUpload from '../ui/ImageUpload.js';
import { DEFAULTS, PROTOCOL_OPTIONS, SERVICE_CATEGORY_OPTIONS, STATUS_OPTIONS, VALIDATION } from '../../constants';
import { validateRequired, generateId } from '../../utils/helpers.js';
import type { ServiceFormProps, Service, Protocol, ValidationResult } from '../../types';

const ServiceForm: React.FC<ServiceFormProps> = ({
                                                     service,
                                                     productId,
                                                     onSave,
                                                     onCancel,
                                                     onPreview,
                                                     isEditing = false
                                                 }) => {
    const [formData, setFormData] = useState<Partial<Service>>({
        ...DEFAULTS.SERVICE,
        ...service,
        product_id: productId
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (service) {
            setFormData({
                ...DEFAULTS.SERVICE,
                ...service,
                product_id: productId
            });
        }
    }, [service, productId]);

    const updateField = (field: keyof Service, value: any): void => {
        setFormData(prev => ({ ...prev, [field]: value }));
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

    const addProtocol = (): void => {
        const availableProtocols = PROTOCOL_OPTIONS.map(p => p.value).filter(
            p => !(formData.supported_protocols || []).includes(p as Protocol)
        );
        if (availableProtocols.length > 0) {
            setFormData(prev => ({
                ...prev,
                supported_protocols: [...(prev.supported_protocols || []), availableProtocols[0] as Protocol]
            }));
        }
    };

    const updateProtocol = (index: number, value: string): void => {
        setFormData(prev => ({
            ...prev,
            supported_protocols: prev.supported_protocols?.map((p, i) => i === index ? value as Protocol : p) || []
        }));
    };

    const removeProtocol = (index: number): void => {
        setFormData(prev => ({
            ...prev,
            supported_protocols: prev.supported_protocols?.filter((_, i) => i !== index) || []
        }));
    };

    const validateForm = (): boolean => {
        const validation: ValidationResult = validateRequired(
            formData as Record<string, any>,
            VALIDATION.REQUIRED_FIELDS.SERVICE
        );
        const newErrors = { ...validation.errors };

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
            const serviceData: Service = {
                ...formData,
                id: formData.id || generateId(formData.name || ''),
                product_id: productId,
                name: formData.name || '',
                short_description: formData.short_description || '',
                category: formData.category || 'general',
                status: formData.status || 'active',
                key_features: (formData.key_features || []).filter(f => f.trim()),
                supported_protocols: formData.supported_protocols || ['REST'],
                sort_order: formData.sort_order || 1,
                display_name: formData.display_name || formData.name
            } as Service;

            await onSave(serviceData);
        } catch (error) {
            console.error('Failed to save service:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePreview = (): void => {
        if (onPreview) {
            onPreview(formData as Service);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isEditing ? 'Edit Service' : 'Create New Service'}
                        </h2>
                        <p className="text-gray-600 mt-1">
                            {isEditing ? 'Update your service information' : 'Add a new service to this product'}
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
                            {isEditing ? 'Update Service' : 'Create Service'}
                        </Button>
                    </div>
                </div>

                {/* Basic Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <Input
                            label="Service Name"
                            value={formData.name || ''}
                            onChange={(e) => updateField('name', e.target.value)}
                            error={errors.name}
                            required
                            placeholder="e.g., XY Service"
                        />
                        <Input
                            label="Display Name"
                            value={formData.display_name || ''}
                            onChange={(e) => updateField('display_name', e.target.value)}
                            error={errors.display_name}
                            placeholder="e.g., Transaction Processing Service"
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
                            placeholder="Brief description of what this service does..."
                            helperText="This appears in service cards and listings"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
                        <Select
                            label="Category"
                            value={formData.category || ''}
                            onChange={(e) => updateField('category', e.target.value)}
                            options={SERVICE_CATEGORY_OPTIONS}
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
                        placeholder="Detailed description of the service, its purpose, and functionality..."
                        helperText="This appears on the service detail page"
                    />

                    <div className="mt-6">
                        <Textarea
                            label="Integration Guide"
                            value={formData.integration_guide || ''}
                            onChange={(e) => updateField('integration_guide', e.target.value)}
                            rows={4}
                            placeholder="Instructions on how to integrate this service..."
                            helperText="Helpful information for developers implementing this service"
                        />
                    </div>

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

                    {/* Supported Protocols */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Supported Protocols
                            </label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addProtocol}
                                leftIcon={<Plus className="w-4 h-4" />}
                                disabled={(formData.supported_protocols || []).length >= PROTOCOL_OPTIONS.length}
                            >
                                Add Protocol
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {(formData.supported_protocols || ['REST']).map((protocol, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <Select
                                        value={protocol}
                                        onChange={(e) => updateProtocol(index, e.target.value)}
                                        options={PROTOCOL_OPTIONS}
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeProtocol(index)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Visual Assets */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Assets</h3>

                    <div className="max-w-md">
                        <ImageUpload
                            label="Service Icon"
                            currentImage={formData.icon}
                            onImageUpload={(image) => updateField('icon', image)}
                            maxWidth={200}
                            maxHeight={200}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ServiceForm;