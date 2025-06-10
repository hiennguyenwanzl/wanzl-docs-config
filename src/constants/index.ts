// API Types
export const API_TYPES = {
    SWAGGER: 'swagger',
    MQTT: 'mqtt'
} as const;

export type ApiType = typeof API_TYPES[keyof typeof API_TYPES];

// Version Status
export const VERSION_STATUS = {
    ACTIVE: 'active',
    DEPRECATED: 'deprecated',
    BETA: 'beta',
    STABLE: 'stable'
} as const;

export type VersionStatus = typeof VERSION_STATUS[keyof typeof VERSION_STATUS];

// Entity Status
export const ENTITY_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    DEPRECATED: 'deprecated'
} as const;

export type EntityStatus = typeof ENTITY_STATUS[keyof typeof ENTITY_STATUS];

// Product Categories
export const PRODUCT_CATEGORIES = [
    'retail-solutions',
    'inventory-management',
    'payment-systems',
    'security-systems',
    'analytics-tools',
    'other'
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

// Protocols
export const PROTOCOLS = [
    'REST',
    'MQTT',
    'GraphQL',
    'WebSocket',
    'gRPC'
] as const;

export type Protocol = typeof PROTOCOLS[number];

// View Modes
export const VIEW_MODES = {
    PRODUCTS: 'products',
    PRODUCT_DETAIL: 'product_detail',
    SERVICE_DETAIL: 'service_detail',
    VERSION_DETAIL: 'version_detail'
} as const;

export type ViewMode = typeof VIEW_MODES[keyof typeof VIEW_MODES];

// File Upload Limits
export const FILE_LIMITS = {
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'],
    SUPPORTED_SPEC_TYPES: ['.yaml', '.yml', '.json']
} as const;

// Navigation Items
export const NAV_ITEMS = [
    { id: 'products', label: 'Products', icon: 'Package' },
    { id: 'export', label: 'Export', icon: 'Download' },
    { id: 'import', label: 'Import', icon: 'Upload' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
] as const;

// Default Values
export const DEFAULTS = {
    PRODUCT: {
        name: '',
        display_name: '',
        short_description: '',
        category: 'other' as ProductCategory,
        overview: '',
        key_features: [''],
        use_cases: [{ title: '', description: '' }],
        status: 'active' as EntityStatus,
        sort_order: 1,
        gallery_images: []
    },

    SERVICE: {
        name: '',
        display_name: '',
        short_description: '',
        category: 'general',
        overview: '',
        key_features: [''],
        supported_protocols: ['REST'] as Protocol[],
        integration_guide: '',
        status: 'active' as EntityStatus,
        sort_order: 1
    },

    VERSION: {
        version: '1.0.0',
        status: 'stable' as VersionStatus,
        beta: false,
        deprecated: false,
        breaking_changes: false,
        introduction: '',
        getting_started: '',
        tutorials: [],
        code_examples: {}
    }
};

// Validation Rules
export const VALIDATION = {
    REQUIRED_FIELDS: {
        PRODUCT: ['name', 'display_name', 'short_description'],
        SERVICE: ['name', 'display_name', 'short_description'],
        VERSION: ['version']
    },
    MIN_LENGTHS: {
        name: 2,
        short_description: 10,
        overview: 20
    },
    MAX_LENGTHS: {
        name: 100,
        display_name: 150,
        short_description: 200,
        overview: 1000
    }
} as const;

// Export Structure
export const EXPORT_STRUCTURE = {
    DATA_FOLDER: 'data',
    FOLDERS: {
        PRODUCTS: 'products',
        SERVICES: 'services',
        VERSIONS: 'versions',
        RELEASE_NOTES: 'release-notes',
        API_SPECS: 'api-specs',
        ASSETS: 'assets'
    },
    FILES: {
        MANIFEST: 'manifest.json',
        PRODUCTS_LIST: 'products.json',
        SEARCH_INDEX: 'search-index.json'
    }
} as const;

// Protocol Options for Forms
export const PROTOCOL_OPTIONS = PROTOCOLS.map(protocol => ({
    value: protocol,
    label: protocol === 'REST' ? 'REST API' : protocol
}));

// Category Options for Forms
export const CATEGORY_OPTIONS = PRODUCT_CATEGORIES.map(category => ({
    value: category,
    label: category.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
}));

// Status Options for Forms
export const STATUS_OPTIONS = Object.values(ENTITY_STATUS).map(status => ({
    value: status,
    label: status.charAt(0).toUpperCase() + status.slice(1)
}));

// Version Status Options for Forms
export const VERSION_STATUS_OPTIONS = Object.values(VERSION_STATUS).map(status => ({
    value: status,
    label: status.charAt(0).toUpperCase() + status.slice(1)
}));

// Service Category Options
export const SERVICE_CATEGORY_OPTIONS = [
    { value: 'general', label: 'General' },
    { value: 'payment', label: 'Payment' },
    { value: 'authentication', label: 'Authentication' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'notification', label: 'Notification' },
    { value: 'integration', label: 'Integration' }
];

// Error Messages
export const ERROR_MESSAGES = {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit',
    INVALID_FILE_TYPE: 'File type is not supported',
    NETWORK_ERROR: 'Network error occurred. Please try again.',
    SAVE_ERROR: 'Failed to save. Please try again.',
    LOAD_ERROR: 'Failed to load data. Please refresh the page.',
    DELETE_CONFIRMATION: 'Are you sure you want to delete this item?'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
    PRODUCT_CREATED: 'Product created successfully',
    PRODUCT_UPDATED: 'Product updated successfully',
    PRODUCT_DELETED: 'Product deleted successfully',
    SERVICE_CREATED: 'Service created successfully',
    SERVICE_UPDATED: 'Service updated successfully',
    SERVICE_DELETED: 'Service deleted successfully',
    VERSION_CREATED: 'Version created successfully',
    VERSION_UPDATED: 'Version updated successfully',
    VERSION_DELETED: 'Version deleted successfully',
    PROJECT_SAVED: 'Project saved successfully',
    PROJECT_LOADED: 'Project loaded successfully',
    DATA_EXPORTED: 'Data exported successfully'
} as const;

// UI Constants
export const UI_CONSTANTS = {
    ANIMATION_DURATION: 200,
    DEBOUNCE_DELAY: 300,
    SEARCH_MIN_LENGTH: 2,
    PAGINATION_PAGE_SIZE: 20,
    TOAST_DURATION: 5000,
    MODAL_Z_INDEX: 1000,
    HEADER_HEIGHT: 70,
    SIDEBAR_WIDTH: 320,
    MOBILE_BREAKPOINT: 768
} as const;

// API Endpoints (for future use)
export const API_ENDPOINTS = {
    PRODUCTS: '/api/products',
    SERVICES: '/api/services',
    VERSIONS: '/api/versions',
    UPLOAD: '/api/upload',
    EXPORT: '/api/export',
    IMPORT: '/api/import'
} as const;