import React, { useState, useEffect } from 'react';
import { Eye, Upload, Trash2, FileText, Code, Plus, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import FileUpload from '../ui/FileUpload';

interface FileData {
    name: string;
    content: string;
    size: number;
    type: string;
    lastModified: number;
}

interface Tutorial {
    title: string;
    content: string;
}

interface VersionFormProps {
    version?: any;
    productId: string;
    serviceId: string;
    onSave: (versionData: any) => Promise<void>;
    onCancel: () => void;
    onPreview?: (version: any) => void;
    isEditing?: boolean;
}

const VersionForm: React.FC<VersionFormProps> = ({
                                                     version,
                                                     productId,
                                                     serviceId,
                                                     onSave,
                                                     onCancel,
                                                     onPreview,
                                                     isEditing = false
                                                 }) => {
    const [formData, setFormData] = useState({
        version: version?.version || '1.0.0',
        status: version?.status || 'stable',
        release_date: version?.release_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        supported_until: version?.supported_until?.split('T')[0] || '',
        deprecated: version?.deprecated || false,
        beta: version?.beta || false,
        breaking_changes: version?.breaking_changes || false,
        introduction: version?.introduction || '',
        getting_started: version?.getting_started || '',
        supported_apis: version?.supported_apis || ['swagger'],
        api_specs: {
            openapi: version?.api_specs?.openapi || null,
            mqtt: version?.api_specs?.mqtt || null
        },
        tutorials: version?.tutorials || [],
        code_examples: version?.code_examples || {},
        service_id: serviceId,
        product_id: productId
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Clear form data when not editing (for Add Version)
    useEffect(() => {
        if (!isEditing && !version) {
            setFormData(prev => ({
                ...prev,
                api_specs: {
                    openapi: null,
                    mqtt: null
                },
                tutorials: [],
                introduction: '',
                getting_started: ''
            }));
        }
    }, [isEditing, version]);

    const statusOptions = [
        { value: 'stable', label: 'Stable' },
        { value: 'beta', label: 'Beta' },
        { value: 'deprecated', label: 'Deprecated' }
    ];

    const apiTypeOptions = [
        { value: 'swagger', label: 'Swagger/OpenAPI Only' },
        { value: 'mqtt', label: 'MQTT/AsyncAPI Only' },
        { value: 'both', label: 'Both Swagger and MQTT' }
    ];

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const updateApiSpec = (type: 'openapi' | 'mqtt', fileData: FileData | null) => {
        setFormData(prev => ({
            ...prev,
            api_specs: {
                ...prev.api_specs,
                [type]: fileData
            }
        }));
    };

    const addTutorial = () => {
        setFormData(prev => ({
            ...prev,
            tutorials: [...prev.tutorials, { title: '', content: '' }]
        }));
    };

    const updateTutorial = (index: number, field: keyof Tutorial, value: string) => {
        setFormData(prev => ({
            ...prev,
            tutorials: prev.tutorials.map((tutorial, i) =>
                i === index ? { ...tutorial, [field]: value } : tutorial
            )
        }));
    };

    const removeTutorial = (index: number) => {
        setFormData(prev => ({
            ...prev,
            tutorials: prev.tutorials.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        const newErrors: Record<string, string> = {};
        if (!formData.version) newErrors.version = 'Version is required';
        if (!formData.release_date) newErrors.release_date = 'Release date is required';

        if (formData.supported_apis.includes('swagger') && !formData.api_specs.openapi) {
            newErrors.openapi = 'OpenAPI specification is required for Swagger support';
        }
        if (formData.supported_apis.includes('mqtt') && !formData.api_specs.mqtt) {
            newErrors.mqtt = 'AsyncAPI specification is required for MQTT support';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            const versionData = {
                ...formData,
                tutorials: formData.tutorials.filter(t => t.title.trim() || t.content.trim()),
                supports_swagger: formData.supported_apis.includes('swagger') || formData.supported_apis.includes('both'),
                supports_mqtt: formData.supported_apis.includes('mqtt') || formData.supported_apis.includes('both'),
                supported_apis: formData.supported_apis
            };

            await onSave(versionData);
        } catch (error) {
            console.error('Failed to save version:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const shouldShowSwaggerUpload = () => {
        return formData.supported_apis.includes('swagger') || formData.supported_apis.includes('both');
    };

    const shouldShowMqttUpload = () => {
        return formData.supported_apis.includes('mqtt') || formData.supported_apis.includes('both');
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {isEditing ? 'Edit API Version' : 'Create New API Version'}
                        </h2>
                        <p className="text-gray-600 mt-1 text-sm">
                            {isEditing ? 'Update version information' : 'Add a new API version to this service'}
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        {onPreview && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onPreview(formData)}
                                leftIcon={<Eye className="w-4 h-4" />}
                            >
                                Preview
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Version' : 'Create Version')}
                        </Button>
                    </div>
                </div>

                {/* Basic Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <Input
                            label="Version Number"
                            value={formData.version}
                            onChange={(e) => updateField('version', e.target.value)}
                            error={errors.version}
                            required
                            placeholder="e.g., 1.0.0"
                            helperText="Use semantic versioning (major.minor.patch)"
                        />
                        <Select
                            label="Status"
                            value={formData.status}
                            onChange={(e) => updateField('status', e.target.value)}
                            options={statusOptions}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
                        <Input
                            label="Release Date"
                            type="date"
                            value={formData.release_date}
                            onChange={(e) => updateField('release_date', e.target.value)}
                            error={errors.release_date}
                            required
                        />
                        <Input
                            label="Supported Until"
                            type="date"
                            value={formData.supported_until}
                            onChange={(e) => updateField('supported_until', e.target.value)}
                            helperText="Leave empty if no end date"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mt-6">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.deprecated}
                                onChange={(e) => updateField('deprecated', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                            <span className="ml-2 text-sm text-gray-700">Deprecated</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.beta}
                                onChange={(e) => updateField('beta', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                            <span className="ml-2 text-sm text-gray-700">Beta Version</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.breaking_changes}
                                onChange={(e) => updateField('breaking_changes', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                            <span className="ml-2 text-sm text-gray-700">Breaking Changes</span>
                        </label>
                    </div>
                </div>

                {/* API Type Selection */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">API Type Support</h3>
                    <Select
                        label="Supported API Types"
                        value={formData.supported_apis[0] || 'swagger'}
                        onChange={(e) => {
                            const value = e.target.value;
                            updateField('supported_apis', value === 'both' ? ['swagger', 'mqtt'] : [value]);
                        }}
                        options={apiTypeOptions}
                        required
                    />
                </div>

                {/* API Specifications */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">API Specifications</h3>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {shouldShowSwaggerUpload() && (
                            <div className="space-y-4">
                                <FileUpload
                                    label="OpenAPI Specification (Swagger)"
                                    description="Upload OpenAPI/Swagger YAML or JSON file"
                                    accept=".yaml,.yml,.json"
                                    currentFile={formData.api_specs.openapi}
                                    onFileUpload={(file) => updateApiSpec('openapi', file)}
                                    allowedTypes={['.yaml', '.yml', '.json']}
                                />
                                {errors.openapi && <p className="text-sm text-red-600">{errors.openapi}</p>}
                            </div>
                        )}

                        {shouldShowMqttUpload() && (
                            <div className="space-y-4">
                                <FileUpload
                                    label="AsyncAPI Specification (MQTT)"
                                    description="Upload AsyncAPI YAML or JSON file for MQTT endpoints"
                                    accept=".yaml,.yml,.json"
                                    currentFile={formData.api_specs.mqtt}
                                    onFileUpload={(file) => updateApiSpec('mqtt', file)}
                                    allowedTypes={['.yaml', '.yml', '.json']}
                                />
                                {errors.mqtt && <p className="text-sm text-red-600">{errors.mqtt}</p>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Documentation */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentation</h3>

                    <Textarea
                        label="Introduction"
                        value={formData.introduction}
                        onChange={(e) => updateField('introduction', e.target.value)}
                        rows={3}
                        placeholder="Brief introduction to this API version..."
                        helperText="This appears at the top of the API documentation"
                    />

                    <div className="mt-6">
                        <Textarea
                            label="Getting Started"
                            value={formData.getting_started}
                            onChange={(e) => updateField('getting_started', e.target.value)}
                            rows={4}
                            placeholder="Instructions for getting started with this API..."
                            helperText="Markdown formatting supported"
                        />
                    </div>

                    {/* Tutorials */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Tutorials
                            </label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addTutorial}
                                leftIcon={<Plus className="w-4 h-4" />}
                            >
                                Add Tutorial
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {formData.tutorials.map((tutorial, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-1 space-y-3">
                                            <Input
                                                label="Tutorial Title"
                                                value={tutorial.title}
                                                onChange={(e) => updateTutorial(index, 'title', e.target.value)}
                                                placeholder="e.g., Basic Integration"
                                            />
                                            <Textarea
                                                label="Tutorial Content"
                                                value={tutorial.content}
                                                onChange={(e) => updateTutorial(index, 'content', e.target.value)}
                                                placeholder="Step-by-step tutorial content..."
                                                rows={3}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeTutorial(index)}
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

                {/* Code Examples */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Code Examples</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Add code examples to help developers understand how to use this API version
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                cURL Example
                            </label>
                            <Textarea
                                value={formData.code_examples.curl || ''}
                                onChange={(e) => updateField('code_examples', {
                                    ...formData.code_examples,
                                    curl: e.target.value
                                })}
                                placeholder="curl -X POST https://api.example.com/v1/endpoint"
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                JavaScript Example
                            </label>
                            <Textarea
                                value={formData.code_examples.javascript || ''}
                                onChange={(e) => updateField('code_examples', {
                                    ...formData.code_examples,
                                    javascript: e.target.value
                                })}
                                placeholder="const response = await fetch('/api/endpoint', { method: 'POST' });"
                                rows={4}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VersionForm;