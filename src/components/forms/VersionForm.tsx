import React, { useState, useEffect } from 'react';
import { Eye, Upload, Trash2, FileText, Code, Plus, AlertCircle, Wifi } from 'lucide-react';
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
    serviceProtocolType: 'REST' | 'MQTT';
    onSave: (versionData: any) => Promise<void>;
    onCancel: () => void;
    onPreview?: (version: any) => void;
    isEditing?: boolean;
}

const VersionForm: React.FC<VersionFormProps> = ({
                                                     version,
                                                     productId,
                                                     serviceId,
                                                     serviceProtocolType,
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
        api_specs: {
            openapi: version?.api_specs?.openapi || null,
            mqtt: version?.api_specs?.mqtt || null
        },
        tutorials: version?.tutorials || [],
        code_examples: version?.code_examples || {},
        service_id: serviceId,
        product_id: productId,
        service_protocol_type: serviceProtocolType
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
                getting_started: '',
                service_protocol_type: serviceProtocolType
            }));
        }
    }, [isEditing, version, serviceProtocolType]);

    // Update protocol type when service protocol changes
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            service_protocol_type: serviceProtocolType
        }));
    }, [serviceProtocolType]);

    const statusOptions = [
        { value: 'stable', label: 'Stable' },
        { value: 'beta', label: 'Beta' },
        { value: 'deprecated', label: 'Deprecated' }
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

        // Protocol-specific validation
        if (serviceProtocolType === 'REST' && !formData.api_specs.openapi) {
            newErrors.openapi = 'OpenAPI specification is required for REST API services';
        }
        if (serviceProtocolType === 'MQTT' && !formData.api_specs.mqtt) {
            newErrors.mqtt = 'AsyncAPI specification is required for MQTT services';
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
                supports_swagger: serviceProtocolType === 'REST',
                supports_mqtt: serviceProtocolType === 'MQTT',
                supported_apis: [serviceProtocolType.toLowerCase()],
                service_protocol_type: serviceProtocolType
            };

            await onSave(versionData);
        } catch (error) {
            console.error('Failed to save version:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getProtocolInfo = () => {
        if (serviceProtocolType === 'REST') {
            return {
                icon: <Code className="w-6 h-6 text-green-600" />,
                title: 'REST API Version',
                description: 'This version requires an OpenAPI/Swagger specification file',
                fileType: 'OpenAPI Specification',
                color: 'green',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                textColor: 'text-green-900'
            };
        } else {
            return {
                icon: <Wifi className="w-6 h-6 text-purple-600" />,
                title: 'MQTT API Version',
                description: 'This version requires an AsyncAPI specification file',
                fileType: 'AsyncAPI Specification',
                color: 'purple',
                bgColor: 'bg-purple-50',
                borderColor: 'border-purple-200',
                textColor: 'text-purple-900'
            };
        }
    };

    const protocolInfo = getProtocolInfo();

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isEditing ? 'Edit API Version' : 'Create New API Version'}
                        </h2>
                        <p className="text-gray-600 mt-2">
                            {isEditing ? 'Update version information' : `Add a new ${serviceProtocolType} API version to this service`}
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
                            className={`${
                                serviceProtocolType === 'REST'
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-purple-600 hover:bg-purple-700'
                            } text-white`}
                        >
                            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Version' : 'Create Version')}
                        </Button>
                    </div>
                </div>

                {/* API Specification Upload */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        {protocolInfo.fileType}
                        <span className="text-red-500 ml-1">*</span>
                    </h3>

                    {serviceProtocolType === 'REST' && (
                        <div className="space-y-6">
                            <div className={`p-6 rounded-xl border-l-4 ${protocolInfo.borderColor} ${protocolInfo.bgColor}`}>
                                <div className="flex items-start space-x-4">
                                    <Code className={`w-6 h-6 mt-1 ${protocolInfo.color === 'green' ? 'text-green-600' : 'text-purple-600'}`} />
                                    <div>
                                        <h4 className={`font-bold ${protocolInfo.textColor} text-lg`}>OpenAPI/Swagger Specification</h4>
                                        <p className={`${protocolInfo.textColor} opacity-80 mt-2`}>
                                            Upload your OpenAPI 3.0+ or Swagger 2.0 specification file (YAML or JSON format)
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <FileUpload
                                accept=".yaml,.yml,.json"
                                currentFile={formData.api_specs.openapi}
                                onFileUpload={(file) => updateApiSpec('openapi', file)}
                                allowedTypes={['.yaml', '.yml', '.json']}
                            />
                            {errors.openapi && (
                                <p className="text-sm text-red-600 flex items-center mt-2">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.openapi}
                                </p>
                            )}
                        </div>
                    )}

                    {serviceProtocolType === 'MQTT' && (
                        <div className="space-y-6">
                            <div className={`p-6 rounded-xl border-l-4 ${protocolInfo.borderColor} ${protocolInfo.bgColor}`}>
                                <div className="flex items-start space-x-4">
                                    <Wifi className={`w-6 h-6 mt-1 ${protocolInfo.color === 'green' ? 'text-green-600' : 'text-purple-600'}`} />
                                    <div>
                                        <h4 className={`font-bold ${protocolInfo.textColor} text-lg`}>AsyncAPI Specification</h4>
                                        <p className={`${protocolInfo.textColor} opacity-80 mt-2`}>
                                            Upload your AsyncAPI 2.0+ specification file for MQTT message definitions (YAML or JSON format)
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <FileUpload
                                accept=".yaml,.yml,.json"
                                currentFile={formData.api_specs.mqtt}
                                onFileUpload={(file) => updateApiSpec('mqtt', file)}
                                allowedTypes={['.yaml', '.yml', '.json']}
                            />
                            {errors.mqtt && (
                                <p className="text-sm text-red-600 flex items-center mt-2">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.mqtt}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Basic Information */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Basic Information</h3>
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
                        <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                            <input
                                type="checkbox"
                                checked={formData.deprecated}
                                onChange={(e) => updateField('deprecated', e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Deprecated</span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                            <input
                                type="checkbox"
                                checked={formData.beta}
                                onChange={(e) => updateField('beta', e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Beta Version</span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                            <input
                                type="checkbox"
                                checked={formData.breaking_changes}
                                onChange={(e) => updateField('breaking_changes', e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Breaking Changes</span>
                        </label>
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
                        placeholder={`Brief introduction to this ${serviceProtocolType} API version...`}
                        helperText="This appears at the top of the API documentation"
                    />

                    <div className="mt-6">
                        <Textarea
                            label="Getting Started"
                            value={formData.getting_started}
                            onChange={(e) => updateField('getting_started', e.target.value)}
                            rows={4}
                            placeholder={`Instructions for getting started with this ${serviceProtocolType} API...`}
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
                                                placeholder={`e.g., ${serviceProtocolType === 'REST' ? 'Basic REST API Integration' : 'MQTT Message Publishing'}`}
                                            />
                                            <Textarea
                                                label="Tutorial Content"
                                                value={tutorial.content}
                                                onChange={(e) => updateTutorial(index, 'content', e.target.value)}
                                                placeholder={`Step-by-step ${serviceProtocolType} tutorial content...`}
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

                {/* Code Examples - Protocol specific */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Code Examples</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Add {serviceProtocolType} code examples to help developers understand how to use this API version
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {serviceProtocolType === 'REST' ? 'cURL Example' : 'MQTT Client Example'}
                            </label>
                            <Textarea
                                value={formData.code_examples.curl || ''}
                                onChange={(e) => updateField('code_examples', {
                                    ...formData.code_examples,
                                    curl: e.target.value
                                })}
                                placeholder={serviceProtocolType === 'REST'
                                    ? "curl -X POST https://api.example.com/v1/endpoint -H 'Authorization: Bearer TOKEN'"
                                    : "mosquitto_pub -h broker.example.com -t topic/name -m 'message' -u username -P password"}
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
                                placeholder={serviceProtocolType === 'REST'
                                    ? "const response = await fetch('/api/endpoint', { method: 'POST', headers: { 'Authorization': 'Bearer ' + token } });"
                                    : "const mqtt = require('mqtt'); const client = mqtt.connect('mqtt://broker.example.com', { username: 'user', password: 'pass' });"}
                                rows={4}
                            />
                        </div>

                        {serviceProtocolType === 'REST' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Python Example
                                </label>
                                <Textarea
                                    value={formData.code_examples.python || ''}
                                    onChange={(e) => updateField('code_examples', {
                                        ...formData.code_examples,
                                        python: e.target.value
                                    })}
                                    placeholder="import requests&#10;response = requests.post('https://api.example.com/v1/endpoint', headers={'Authorization': 'Bearer ' + token})"
                                    rows={4}
                                />
                            </div>
                        )}

                        {serviceProtocolType === 'MQTT' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Python MQTT Example
                                </label>
                                <Textarea
                                    value={formData.code_examples.python || ''}
                                    onChange={(e) => updateField('code_examples', {
                                        ...formData.code_examples,
                                        python: e.target.value
                                    })}
                                    placeholder="import paho.mqtt.client as mqtt&#10;client = mqtt.Client()&#10;client.username_pw_set('username', 'password')&#10;client.connect('broker.example.com', 1883)"
                                    rows={4}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VersionForm;