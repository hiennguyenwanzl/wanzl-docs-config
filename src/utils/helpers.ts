// src/utils/helpers.ts
import type { ValidationResult } from '@/types';

/**
 * Generate a unique ID based on a name and timestamp
 */
export const generateId = (name: string = ''): string => {
    const cleanName = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    const timestamp = Date.now().toString(36);
    const randomSuffix = Math.random().toString(36).substr(2, 5);

    return cleanName ? `${cleanName}-${timestamp}${randomSuffix}` : `item-${timestamp}${randomSuffix}`;
};

/**
 * Format current date as ISO string
 */
export const formatDate = (date?: Date): string => {
    return (date || new Date()).toISOString();
};

/**
 * Validate required fields in an object
 */
export const validateRequired = (
    data: Record<string, any>,
    requiredFields: string[]
): ValidationResult => {
    const errors: Record<string, string> = {};
    let isValid = true;

    requiredFields.forEach(field => {
        const value = data[field];
        if (!value || (typeof value === 'string' && !value.trim())) {
            errors[field] = `${field.replace('_', ' ')} is required`;
            isValid = false;
        }
    });

    return { isValid, errors };
};

/**
 * Debounce function to limit the rate of function calls
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

/**
 * Deep clone an object
 */
export const deepClone = <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
    if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
    if (typeof obj === 'object') {
        const clonedObj: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
    return obj;
};

/**
 * Check if a string is a valid URL
 */
export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Sanitize a string for use as a filename
 */
export const sanitizeFilename = (filename: string): string => {
    return filename
        .replace(/[^a-z0-9.-]/gi, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
};

/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Truncate text to a specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
};

/**
 * Capitalize the first letter of a string
 */
export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert a string to title case
 */
export const toTitleCase = (str: string): string => {
    return str.replace(/\w\S*/g, txt =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
};

/**
 * Generate a slug from a string
 */
export const generateSlug = (str: string): string => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

/**
 * Sort array of objects by a specific property
 */
export const sortByProperty = <T>(
    array: T[],
    property: keyof T,
    direction: 'asc' | 'desc' = 'asc'
): T[] => {
    return [...array].sort((a, b) => {
        const aVal = a[property];
        const bVal = b[property];

        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
    });
};

/**
 * Group array of objects by a specific property
 */
export const groupBy = <T, K extends keyof T>(
    array: T[],
    property: K
): Record<string, T[]> => {
    return array.reduce((groups, item) => {
        const key = String(item[property]);
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(item);
        return groups;
    }, {} as Record<string, T[]>);
};

/**
 * Check if two objects are deeply equal
 */
export const deepEqual = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;

    if (obj1 == null || obj2 == null) return false;

    if (typeof obj1 !== typeof obj2) return false;

    if (typeof obj1 !== 'object') return obj1 === obj2;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
        if (!keys2.includes(key)) return false;
        if (!deepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
};

/**
 * Remove undefined and null values from an object
 */
export const cleanObject = (obj: Record<string, any>): Record<string, any> => {
    const cleaned: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
        if (value !== null && value !== undefined) {
            if (typeof value === 'object' && !Array.isArray(value)) {
                cleaned[key] = cleanObject(value);
            } else {
                cleaned[key] = value;
            }
        }
    }

    return cleaned;
};

/**
 * Parse version string and return comparable version object
 */
export const parseVersion = (version: string): { major: number; minor: number; patch: number } => {
    const parts = version.split('.').map(Number);
    return {
        major: parts[0] || 0,
        minor: parts[1] || 0,
        patch: parts[2] || 0
    };
};

/**
 * Compare two version strings
 */
export const compareVersions = (version1: string, version2: string): number => {
    const v1 = parseVersion(version1);
    const v2 = parseVersion(version2);

    if (v1.major !== v2.major) return v1.major - v2.major;
    if (v1.minor !== v2.minor) return v1.minor - v2.minor;
    return v1.patch - v2.patch;
};

/**
 * Convert bytes to base64 string
 */
export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Check if file type is supported
 */
export const isSupportedFileType = (filename: string, supportedTypes: string[]): boolean => {
    const extension = getFileExtension(filename).toLowerCase();
    return supportedTypes.some(type =>
        type.toLowerCase().replace('.', '') === extension
    );
};

/**
 * Get the latest version from an array of version strings
 */
export const getLatestVersion = (versions: string[]): string | null => {
    if (!versions || versions.length === 0) return null;

    return versions.sort((a, b) => compareVersions(b, a))[0];
};

/**
 * Get latest version from version objects with version property
 */
export const getLatestVersionFromObjects = (versions: { version: string }[]): { version: string } | null => {
    if (!versions || versions.length === 0) return null;

    return versions.sort((a, b) => compareVersions(b.version, a.version))[0];
};

/**
 * Check if a version is newer than another
 */
export const isNewerVersion = (version1: string, version2: string): boolean => {
    return compareVersions(version1, version2) > 0;
};

/**
 * Sort versions in descending order (newest first)
 */
export const sortVersionsDesc = (versions: string[]): string[] => {
    return [...versions].sort((a, b) => compareVersions(b, a));
};

/**
 * Sort version objects in descending order (newest first)
 */
export const sortVersionObjectsDesc = <T extends { version: string }>(versions: T[]): T[] => {
    return [...versions].sort((a, b) => compareVersions(b.version, a.version));
};