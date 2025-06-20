// src/components/ui/ImageUpload.tsx
import React, { useState, useRef } from 'react';
import { Upload, Edit2, Trash2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import Button from './Button';

interface ImageUploadProps {
    onImageUpload: (image: string | null) => void;
    currentImage?: string | null;
    label?: string;
    optional?: boolean;
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    showPreview?: boolean;
    className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
                                                     onImageUpload,
                                                     currentImage,
                                                     label = "Upload Image",
                                                     optional = true,
                                                     maxWidth = 1920,
                                                     maxHeight = 1080,
                                                     quality = 0.8,
                                                     showPreview = true,
                                                     className = ''
                                                 }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const validateImageFile = (file: File) => {
        const supportedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!supportedTypes.includes(file.type)) {
            return { isValid: false, error: 'Unsupported file type. Please use JPEG, PNG, SVG, WebP, or GIF.' };
        }

        if (file.size > maxSize) {
            return { isValid: false, error: 'File size too large. Maximum size is 5MB.' };
        }

        return { isValid: true, error: null };
    };

    const optimizeImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            // For SVG files, just convert to data URL without processing
            if (file.type === 'image/svg+xml') {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(new Error('Failed to read SVG file'));
                reader.readAsDataURL(file);
                return;
            }

            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Canvas context not available'));
                return;
            }

            img.onload = () => {
                try {
                    // Calculate new dimensions while maintaining aspect ratio
                    let { width, height } = img;

                    if (width > maxWidth || height > maxHeight) {
                        const aspectRatio = width / height;

                        if (width > height) {
                            width = Math.min(maxWidth, width);
                            height = width / aspectRatio;
                        } else {
                            height = Math.min(maxHeight, height);
                            width = height * aspectRatio;
                        }

                        if (width > maxWidth) {
                            width = maxWidth;
                            height = width / aspectRatio;
                        }
                        if (height > maxHeight) {
                            height = maxHeight;
                            width = height * aspectRatio;
                        }
                    }

                    canvas.width = Math.round(width);
                    canvas.height = Math.round(height);

                    // Draw image on canvas
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // Convert to data URL with compression
                    const outputFormat = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                    const dataUrl = canvas.toDataURL(outputFormat, quality);
                    resolve(dataUrl);
                } catch (error) {
                    reject(new Error('Failed to process image'));
                }
            };

            img.onerror = () => reject(new Error('Failed to load image'));

            // Load the image
            const reader = new FileReader();
            reader.onload = () => {
                img.src = reader.result as string;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setIsUploading(true);

        try {
            // Validate file
            const validation = validateImageFile(file);
            if (!validation.isValid) {
                setError(validation.error || 'Invalid file');
                setIsUploading(false);
                return;
            }

            // Optimize image
            const optimizedDataUrl = await optimizeImage(file);

            setPreview(optimizedDataUrl);
            onImageUpload(optimizedDataUrl);
        } catch (err) {
            setError('Failed to process image. Please try again.');
            console.error('Image upload error:', err);
        } finally {
            setIsUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = (): void => {
        setPreview(null);
        setError(null);
        onImageUpload(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClick = (e?: React.MouseEvent): void => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        fileInputRef.current?.click();
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-sm font-medium text-gray-700">
                {label} {optional && <span className="text-gray-500">(optional)</span>}
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors min-h-[150px]">
                {showPreview && preview ? (
                    <div className="p-4">
                        <div className="space-y-3">
                            <img
                                src={preview}
                                alt="Preview"
                                className="max-h-40 mx-auto rounded-lg object-cover"
                            />
                            <div className="flex gap-2 justify-center">
                                <Button
                                    variant="secondary"
                                    type="button"
                                    size="sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleClick(e);
                                    }}
                                    disabled={isUploading}
                                    leftIcon={<Edit2 className="w-4 h-4" />}
                                >
                                    Change
                                </Button>
                                <Button
                                    variant="ghost"
                                    type="button"
                                    size="sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleRemove();
                                    }}
                                    disabled={isUploading}
                                    leftIcon={<Trash2 className="w-4 h-4" />}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        className="p-6 text-center flex flex-col items-center justify-center min-h-[150px] cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleClick(e);
                        }}
                    >
                        <div className="space-y-3">
                            {isUploading ? (
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <p className="text-sm text-gray-600 mt-2">Processing image...</p>
                                </div>
                            ) : (
                                <>
                                    <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-600">
                                            Drag and drop an image here, or click to browse
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Supports: JPEG, PNG, SVG, WebP, GIF (max 5MB)
                                        </p>
                                    </div>
                                    {showPreview && (
                                        <Button
                                            variant="secondary"
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleClick(e);
                                            }}
                                            disabled={isUploading}
                                            leftIcon={<Upload className="w-4 h-4" />}
                                        >
                                            {label}
                                        </Button>
                                    )}
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
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
};

export default ImageUpload;