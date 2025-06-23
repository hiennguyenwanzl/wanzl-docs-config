// src/components/forms/ServiceForm.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye } from 'lucide-react';
import Button from '../ui/Button.js';
import Input from '../ui/Input.js';
import Textarea from '../ui/Textarea.js';
import Select from '../ui/Select.js';
import ImageUpload from '../ui/ImageUpload.js';
import { DEFAULTS, SERVICE_CATEGORY_OPTIONS, STATUS_OPTIONS, VALIDATION } from '@/constants';
import { validateRequired, generateId } from '@/utils/helpers.ts';
import type { ServiceFormProps, Service, ProtocolType, ValidationResult } from '@/types/index.ts';

// Fixed protocol type options - only one protocol per service
const PROTOCOL_TYPE_OPTIONS = [
    { value: 'REST', label: 'REST API (Swagger/OpenAPI)' },
    { value: 'MQTT', label: 'MQTT (AsyncAPI)' }
];

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

    const validateForm = (): boolean => {
        const validation: ValidationResult = validateRequired(
            formData as Record<string, any>,
            VALIDATION.REQUIRED_FIELDS.SERVICE
        );
        const newErrors = { ...validation.errors };

        // Additional validations
        if (formData.name && formData.name.length < VALIDATION.MIN_LENGTHS.name) {
            newErrors.name = `Name must be at least ${VALIDATION.MIN_LENGTHS.name} characters`;
        }

        if (formData.short_description && formData.short_description.length < VALIDATION.MIN_LENGTHS.short_description) {
            newErrors.short_description = `Description must be at least ${VALIDATION.MIN_LENGTHS.short_description} characters`;
        }

        if (!formData.protocol_type) {
            newErrors.protocol_type = 'Protocol type is required';
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
                protocol_type: formData.protocol_type || 'REST',
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
                            required
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

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mt-6">
                        <Select
                            label="Category"
                            value={formData.category || ''}
                            onChange={(e) => updateField('category', e.target.value)}
                            options={SERVICE_CATEGORY_OPTIONS}
                            required
                        />
                        <Select
                            label="Protocol Type"
                            value={formData.protocol_type || ''}
                            onChange={(e) => updateField('protocol_type', e.target.value as ProtocolType)}
                            options={PROTOCOL_TYPE_OPTIONS}
                            error={errors.protocol_type}
                            required
                            helperText="Choose the API protocol this service supports"
                        />
                        <Select
                            label="Status"
                            value={formData.status || ''}
                            required
                            onChange={(e) => updateField('status', e.target.value)}
                            options={STATUS_OPTIONS}
                        />
                    </div>

                    {/* Service Icon */}
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