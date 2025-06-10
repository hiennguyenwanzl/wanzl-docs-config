import React, { useState, useRef } from 'react';
import { Upload, Edit2, Trash2, FileText, AlertCircle, Code } from 'lucide-react';
import Button from './Button.js';
import { FILE_LIMITS } from '@/constants';
import type { FileUploadProps, FileData, ValidationResult } from '@/types';

const FileUpload: React.FC<FileUploadProps> = ({
                                                   onFileUpload,
                                                   currentFile,
                                                   label = "Upload File",
                                                   accept = "*",
                                                   maxSize = FILE_LIMITS.MAX_FILE_SIZE,
                                                   className = '',
                                                   description = null,
                                                   allowedTypes = []
                                               }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string>(currentFile?.name || '');
    const [fileContent, setFileContent] = useState<string>(currentFile?.content || '');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File): ValidationResult => {
        const errors: string[] = [];

        // Check file size
        if (file.size > maxSize) {
            errors.push(`File size too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`);
        }

        // Check file type if specified
        if (allowedTypes.length > 0) {
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
            const fileType = file.type.toLowerCase();

            const isAllowed = allowedTypes.some(type =>
                fileExtension === type.toLowerCase() || fileType.includes(type.toLowerCase())
            );

            if (!isAllowed) {
                errors.push(`Unsupported file type. Allowed types: ${allowedTypes.join(', ')}`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors.reduce((acc, error, index) => ({
                ...acc,
                [index]: error
            }), {})
        };
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setIsUploading(true);

        try {
            // Validate file
            const validation = validateFile(file);
            if (!validation.isValid) {
                const firstError = Object.values(validation.errors)[0];
                setError(firstError || 'Invalid file');
                setIsUploading(false);
                return;
            }

            // Read file content
            const content = await file.text();
            const fileData: FileData = {
                name: file.name,
                content: content,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
            };

            setFileName(file.name);
            setFileContent(content);
            onFileUpload(fileData);
        } catch (err) {
            setError('Failed to read file. Please try again.');
            console.error('File upload error:', err);
        } finally {
            setIsUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = (): void => {
        setFileName('');
        setFileContent('');
        setError(null);
        onFileUpload(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClick = (): void => {
        fileInputRef.current?.click();
    };

    const getFileIcon = (): JSX.Element => {
        if (fileName.toLowerCase().includes('.yaml') || fileName.toLowerCase().includes('.yml')) {
            return <Code className="w-8 h-8 text-blue-600" />;
        }
        if (fileName.toLowerCase().includes('.json')) {
            return <Code className="w-8 h-8 text-green-600" />;
        }
        return <FileText className="w-8 h-8 text-gray-600" />;
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            {description && (
                <p className="text-sm text-gray-500">{description}</p>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                {fileName ? (
                    <div className="p-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-center">
                                {getFileIcon()}
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-900">{fileName}</p>
                                {fileContent && (
                                    <p className="text-xs text-gray-500">
                                        {fileContent.length} characters
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2 justify-center">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleClick}
                                    disabled={isUploading}
                                    leftIcon={<Edit2 className="w-4 h-4" />}
                                >
                                    Change
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRemove}
                                    disabled={isUploading}
                                    leftIcon={<Trash2 className="w-4 h-4" />}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="space-y-3">
                            {isUploading ? (
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <p className="text-sm text-gray-600 mt-2">Reading file...</p>
                                </div>
                            ) : (
                                <>
                                    <FileText className="w-12 h-12 mx-auto text-gray-400" />
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            Drag and drop a file here, or click to browse
                                        </p>
                                        {allowedTypes.length > 0 && (
                                            <p className="text-xs text-gray-500">
                                                Supported formats: {allowedTypes.join(', ')}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500">
                                            Maximum file size: {Math.round(maxSize / 1024 / 1024)}MB
                                        </p>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        onClick={handleClick}
                                        disabled={isUploading}
                                        leftIcon={<Upload className="w-4 h-4" />}
                                    >
                                        {label}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
};

export default FileUpload;