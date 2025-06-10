import { FILE_LIMITS } from '@/constants';

export interface ImageProcessingOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
}

export interface ImageValidationResult {
    isValid: boolean;
    error?: string;
    errors?: Record<string, string>;
}

export interface OptimizeImageOptions {
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp' | 'auto';
    preserveMetadata?: boolean;
}

/**
 * Extract image format from data URL
 * Used by: Export functions to determine correct file extension
 */
export function getImageFormatFromDataUrl(dataUrl: string): string {
    try {
        const match = dataUrl.match(/^data:([^;]+);base64,/);
        if (match && match[1]) {
            return match[1];
        }
        return 'image/jpeg'; // Default fallback
    } catch {
        return 'image/jpeg';
    }
}

/**
 * Validates an image file against size and type constraints
 * Used by: ImageUpload component
 */
export function validateImageFile(file: File): ImageValidationResult {
    const errors: Record<string, string> = {};

    if (!(FILE_LIMITS.SUPPORTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
        errors.fileType = `Unsupported file type. Please use ${FILE_LIMITS.SUPPORTED_IMAGE_TYPES.join(', ')}`;
    }

    // Check file size
    if (file.size > FILE_LIMITS.MAX_IMAGE_SIZE) {
        const maxSizeMB = FILE_LIMITS.MAX_IMAGE_SIZE / (1024 * 1024);
        errors.fileSize = `File size exceeds ${maxSizeMB}MB limit`;
    }

    // Check if file is empty
    if (file.size === 0) {
        errors.fileEmpty = 'File appears to be empty';
    }

    const hasErrors = Object.keys(errors).length > 0;
    const firstError = hasErrors ? Object.values(errors)[0] : undefined;

    return {
        isValid: !hasErrors,
        error: firstError,
        errors: hasErrors ? errors : undefined
    };
}

/**
 * Converts a file to a data URL
 * Used by: ImageUpload, optimizeImage, processImage
 */
export function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Converts a file to base64 string (alias for fileToDataUrl for compatibility)
 * Used by: ImageUpload component, exportUtils
 */
export function fileToBase64(file: File): Promise<string> {
    return fileToDataUrl(file);
}

/**
 * Resizes an image while maintaining aspect ratio
 * Used by: processImage function
 */
export function resizeImage(
    imageElement: HTMLImageElement,
    maxWidth: number,
    maxHeight: number
): { width: number; height: number } {
    let { width, height } = imageElement;

    if (width <= maxWidth && height <= maxHeight) {
        return { width, height };
    }

    const aspectRatio = width / height;

    if (width > height) {
        width = Math.min(maxWidth, width);
        height = width / aspectRatio;
    } else {
        height = Math.min(maxHeight, height);
        width = height * aspectRatio;
    }

    // Ensure we don't exceed either dimension
    if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
    }
    if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
    }

    return { width: Math.round(width), height: Math.round(height) };
}

/**
 * Processes an image file with resizing and compression
 * Used by: optimizeImage function
 */
export function processImage(
    file: File,
    options: ImageProcessingOptions = {}
): Promise<string> {
    const {
        maxWidth = 800,
        maxHeight = 600,
        quality = 0.8,
        format = 'jpeg'
    } = options;

    return new Promise((resolve, reject) => {
        // Validate file first
        const validation = validateImageFile(file);
        if (!validation.isValid) {
            reject(new Error(validation.error));
            return;
        }

        // For SVG files, just convert to data URL without processing
        if (file.type === 'image/svg+xml') {
            fileToDataUrl(file)
                .then(resolve)
                .catch(reject);
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
                const { width, height } = resizeImage(img, maxWidth, maxHeight);

                canvas.width = width;
                canvas.height = height;

                // Draw image on canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to data URL with compression
                const outputFormat = format === 'png' ? 'image/png' :
                    format === 'webp' ? 'image/webp' : 'image/jpeg';

                const dataUrl = canvas.toDataURL(outputFormat, quality);
                resolve(dataUrl);
            } catch (error) {
                reject(new Error('Failed to process image'));
            }
        };

        img.onerror = () => reject(new Error('Failed to load image'));

        // Load the image
        fileToDataUrl(file)
            .then(dataUrl => {
                img.src = dataUrl;
            })
            .catch(reject);
    });
}

/**
 * Converts a base64 data URL to a Blob object
 * Used by: exportUtils for generating ZIP files
 */
export function base64ToBlob(dataUrl: string, mimeType?: string): Blob {
    try {
        // Split the data URL
        const parts = dataUrl.split(',');
        if (parts.length !== 2) {
            throw new Error('Invalid data URL format');
        }

        const [header, base64Data] = parts;

        // Use provided MIME type or extract from header
        let finalMimeType: string;
        if (mimeType) {
            finalMimeType = mimeType;
        } else {
            const mimeMatch = header.match(/data:([^;]+)/);
            finalMimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        }

        // Decode base64
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        return new Blob([byteArray], { type: finalMimeType });
    } catch (error) {
        throw new Error('Failed to convert base64 to blob');
    }
}

/**
 * Generates a placeholder image data URL
 * Used by: ImageUpload component when no image is provided
 */
export function generatePlaceholder(
    width: number = 400,
    height: number = 300,
    backgroundColor: string = '#f3f4f6',
    textColor: string = '#9ca3af',
    text?: string
): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Canvas context not available');
    }

    canvas.width = width;
    canvas.height = height;

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Add text
    const displayText = text || `${width} × ${height}`;
    ctx.fillStyle = textColor;
    ctx.font = `${Math.min(width, height) / 10}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayText, width / 2, height / 2);

    return canvas.toDataURL('image/png');
}

/**
 * Optimizes image file size without changing dimensions
 * Used by: ImageUpload component to reduce file size before upload
 */
export function optimizeImage(
    file: File,
    options: OptimizeImageOptions = {}
): Promise<File> {
    const {
        quality = 0.6,
        format = 'auto',
        preserveMetadata = false
    } = options;

    return new Promise((resolve, reject) => {
        // Validate file first
        const validation = validateImageFile(file);
        if (!validation.isValid) {
            reject(new Error(validation.error));
            return;
        }

        // For SVG files, return original file (already optimized)
        if (file.type === 'image/svg+xml') {
            resolve(file);
            return;
        }

        // Use canvas-based compression
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
        }

        img.onload = () => {
            try {
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;

                // Draw image on canvas
                ctx.drawImage(img, 0, 0);

                // Determine output format
                let outputFormat = 'image/jpeg';
                if (format === 'png') outputFormat = 'image/png';
                else if (format === 'webp') outputFormat = 'image/webp';
                else if (format === 'auto') {
                    // Auto-select: use JPEG for photos, PNG for graphics
                    outputFormat = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                }

                // Convert to blob with compression
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const optimizedFile = new File([blob], file.name, {
                                type: blob.type,
                                lastModified: Date.now()
                            });
                            resolve(optimizedFile);
                        } else {
                            reject(new Error('Failed to create optimized blob'));
                        }
                    },
                    outputFormat,
                    quality
                );
            } catch (error) {
                reject(new Error('Image optimization failed'));
            }
        };

        img.onerror = () => reject(new Error('Failed to load image'));

        // Load the image
        fileToDataUrl(file)
            .then(dataUrl => {
                img.src = dataUrl;
            })
            .catch(reject);
    });
}

/**
 * Optimizes image and returns as data URL
 * Used by: Alternative method for getting optimized image as base64
 */
export function optimizeImageToDataUrl(
    file: File,
    options: OptimizeImageOptions = {}
): Promise<string> {
    const {
        quality = 0.6,
        format = 'auto',
        preserveMetadata = false
    } = options;

    return new Promise((resolve, reject) => {
        // Validate file first
        const validation = validateImageFile(file);
        if (!validation.isValid) {
            reject(new Error(validation.error));
            return;
        }

        // For SVG files, return original as data URL (already optimized)
        if (file.type === 'image/svg+xml') {
            fileToDataUrl(file).then(resolve).catch(reject);
            return;
        }

        // Use canvas-based compression
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
        }

        img.onload = () => {
            try {
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;

                // Draw image on canvas
                ctx.drawImage(img, 0, 0);

                // Determine output format
                let outputFormat = 'image/jpeg';
                if (format === 'png') {
                    outputFormat = 'image/png';
                } else if (format === 'webp') {
                    outputFormat = 'image/webp';
                } else if (format === 'auto') {
                    // Auto-select: use original format but prefer JPEG for compression
                    if (file.type === 'image/png') {
                        // For PNG, try JPEG compression first, then fall back to PNG if needed
                        outputFormat = 'image/jpeg';
                    } else {
                        outputFormat = file.type;
                    }
                }

                // Convert to data URL with compression
                const dataUrl = canvas.toDataURL(outputFormat, quality);

                // If we tried JPEG compression on a PNG but it resulted in larger file, use PNG
                if (format === 'auto' && file.type === 'image/png' && outputFormat === 'image/jpeg') {
                    const jpegSize = getBase64SizeFromDataUrl(dataUrl);
                    const pngDataUrl = canvas.toDataURL('image/png', quality);
                    const pngSize = getBase64SizeFromDataUrl(pngDataUrl);

                    if (pngSize < jpegSize) {
                        resolve(pngDataUrl);
                        return;
                    }
                }

                resolve(dataUrl);
            } catch (error) {
                reject(new Error('Image optimization failed'));
            }
        };

        img.onerror = () => reject(new Error('Failed to load image'));

        // Load the image
        fileToDataUrl(file)
            .then(dataUrl => {
                img.src = dataUrl;
            })
            .catch(reject);
    });
}

/**
 * Helper function to get size from data URL
 */
function getBase64SizeFromDataUrl(dataUrl: string): number {
    try {
        const base64 = dataUrl.split(',')[1];
        return (base64.length * 3) / 4;
    } catch {
        return 0;
    }
}

/**
 * Creates an image element from a data URL
 * Used by: Internal helper functions
 */
export function createImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = dataUrl;
    });
}

/**
 * Gets image dimensions from a file
 * Used by: Image processing and validation
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            reject(new Error('File is not an image'));
            return;
        }

        const img = new Image();
        img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = () => reject(new Error('Failed to load image'));

        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Creates a thumbnail from an image file
 * Used by: Gallery and preview components
 */
export function createThumbnail(
    file: File,
    maxSize: number = 150,
    quality: number = 0.7
): Promise<string> {
    return processImage(file, {
        maxWidth: maxSize,
        maxHeight: maxSize,
        quality,
        format: 'jpeg'
    });
}

/**
 * Checks if the browser supports a specific image format
 * Used by: Format detection and optimization
 */
export function supportsImageFormat(format: string): boolean {
    const supportedFormats = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/svg+xml'
    ];

    if (supportedFormats.includes(format)) {
        if (format === 'image/webp') {
            // Test WebP support
            const testCanvas = document.createElement('canvas');
            testCanvas.width = 1;
            testCanvas.height = 1;
            return testCanvas.toDataURL('image/webp').indexOf('image/webp') === 5;
        }
        return true;
    }

    return false;
}

/**
 * Gets the optimal image format for the browser
 * Used by: Auto-format selection
 */
export function getOptimalImageFormat(): 'webp' | 'jpeg' {
    return supportsImageFormat('image/webp') ? 'webp' : 'jpeg';
}

/**
 * Calculates the file size reduction percentage
 * Used by: Compression reporting
 */
export function calculateCompressionRatio(originalSize: number, compressedSize: number): number {
    if (originalSize === 0) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}

/**
 * Gets comprehensive image information
 * Used by: File analysis and metadata display
 */
export function getBasicImageInfo(file: File): Promise<{
    name: string;
    size: number;
    type: string;
    lastModified: number;
    dimensions?: { width: number; height: number };
}> {
    return new Promise((resolve, reject) => {
        const basicInfo = {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
        };

        if (file.type.startsWith('image/')) {
            getImageDimensions(file)
                .then(dimensions => {
                    resolve({ ...basicInfo, dimensions });
                })
                .catch(() => {
                    // If we can't get dimensions, still return basic info
                    resolve(basicInfo);
                });
        } else {
            resolve(basicInfo);
        }
    });
}