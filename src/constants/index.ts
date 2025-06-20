// src/constants/index.ts
import {ProtocolType} from "@/types";

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

// Info Card Display Types
export const INFO_CARD_DISPLAY_TYPES = [
    'imageLeft',
    'imageRight',
    'custom1',
    'custom2'
] as const;

export type InfoCardDisplayType = typeof INFO_CARD_DISPLAY_TYPES[number];

// Protocols (kept for compatibility)
export const PROTOCOLS = [
    'REST',
    'MQTT',
    'GraphQL',
    'WebSocket',
    'gRPC'
];

export type Protocol = typeof PROTOCOLS[number];

// View Modes (updated with new views)
export const VIEW_MODES = {
    PROJECTS: 'projects',
    PROJECT_DETAIL: 'project_detail',
    PRODUCT_DETAIL: 'product_detail',
    SERVICE_DETAIL: 'service_detail',
    VERSION_DETAIL: 'version_detail',
    INFO_CARD_DETAIL: 'info_card_detail'
};

export type ViewMode = typeof VIEW_MODES[keyof typeof VIEW_MODES];

// File Upload Limits
export const FILE_LIMITS = {
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'],
    SUPPORTED_SPEC_TYPES: ['.yaml', '.yml', '.json']
};

// Navigation Items (updated)
export const NAV_ITEMS = [
    { id: 'projects', label: 'Projects', icon: 'Package' },
    { id: 'export', label: 'Export', icon: 'Download' },
    { id: 'import', label: 'Import', icon: 'Upload' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
];

// Default Values (updated with new entities)
export const DEFAULTS = {
    PROJECT: {
        name: '',
        display_name: '',
        title: '',
        description: '',
        status: 'active' as EntityStatus,
        sort_order: 1
    },

    INFO_CARD: {
        headline_title: '',
        brief_description: '',
        image_url: null,
        url: '',
        display_type: 'imageLeft' as InfoCardDisplayType,
        sort_order: 1
    },

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
        protocol_type: 'REST' as ProtocolType,
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
        PROJECT: ['name', 'display_name'],
        INFO_CARD: ['headline_title', 'brief_description', 'url'],
        PRODUCT: ['name', 'display_name', 'short_description'],
        SERVICE: ['name', 'display_name', 'short_description', 'protocol_type'],
        VERSION: ['version']
    },
    MIN_LENGTHS: {
        name: 2,
        headline_title: 3,
        brief_description: 10,
        short_description: 10,
        overview: 20
    },
    MAX_LENGTHS: {
        name: 100,
        display_name: 150,
        headline_title: 200,
        brief_description: 300,
        short_description: 200,
        overview: 1000
    }
};

// Export Structure (updated)
export const EXPORT_STRUCTURE = {
    DATA_FOLDER: 'data',
    FOLDERS: {
        PROJECTS: 'projects',
        PRODUCTS: 'products',
        SERVICES: 'services',
        VERSIONS: 'versions',
        INFO_CARDS: 'info-cards',
        RELEASE_NOTES: 'release-notes',
        API_SPECS: 'api-specs',
        ASSETS: 'assets'
    },
    FILES: {
        MANIFEST: 'manifest.json',
        PROJECTS_LIST: 'projects.json',
        PRODUCTS_LIST: 'products.json',
        SEARCH_INDEX: 'search-index.json'
    }
};

// Protocol Type Options for Forms
export const PROTOCOL_TYPE_OPTIONS = [
    { value: 'REST', label: 'REST API (Swagger/OpenAPI)' },
    { value: 'MQTT', label: 'MQTT (AsyncAPI)' }
];

// Info Card Display Type Options
export const INFO_CARD_DISPLAY_TYPE_OPTIONS = [
    { value: 'imageLeft', label: 'Image Left' },
    { value: 'imageRight', label: 'Image Right' }
];

// Protocol Options for Forms (kept for compatibility)
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

// Error Messages (updated)
export const ERROR_MESSAGES = {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_URL: 'Please enter a valid URL',
    FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit',
    INVALID_FILE_TYPE: 'File type is not supported',
    NETWORK_ERROR: 'Network error occurred. Please try again.',
    SAVE_ERROR: 'Failed to save. Please try again.',
    LOAD_ERROR: 'Failed to load data. Please refresh the page.',
    DELETE_CONFIRMATION: 'Are you sure you want to delete this item?',
    PROJECT_DELETE_CONFIRMATION: 'Are you sure you want to delete this project? This will also delete all its products, services, and versions.',
    PRODUCT_DELETE_CONFIRMATION: 'Are you sure you want to delete this product? This will also delete all its services and versions.',
    SERVICE_DELETE_CONFIRMATION: 'Are you sure you want to delete this service? This will also delete all its versions.',
    VERSION_DELETE_CONFIRMATION: 'Are you sure you want to delete this version?',
    INFO_CARD_DELETE_CONFIRMATION: 'Are you sure you want to delete this info card?'
} as const;

// Success Messages (updated)
export const SUCCESS_MESSAGES = {
    PROJECT_CREATED: 'Project created successfully',
    PROJECT_UPDATED: 'Project updated successfully',
    PROJECT_DELETED: 'Project deleted successfully',
    INFO_CARD_CREATED: 'Info card created successfully',
    INFO_CARD_UPDATED: 'Info card updated successfully',
    INFO_CARD_DELETED: 'Info card deleted successfully',
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
    ANIMATION_SCALE: 1.02,
    ANIMATION_TRANSLATE: -4, // pixels
    DEBOUNCE_DELAY: 300,
    SEARCH_MIN_LENGTH: 2,
    PAGINATION_PAGE_SIZE: 20,
    TOAST_DURATION: 5000,
    MODAL_Z_INDEX: 1000,
    HEADER_HEIGHT: 70,
    SIDEBAR_WIDTH: 320,
    SIDEBAR_COLLAPSED_WIDTH: 64,
    MOBILE_BREAKPOINT: 768
} as const;

// API Endpoints (for future use)
export const API_ENDPOINTS = {
    PROJECTS: '/api/projects',
    PRODUCTS: '/api/products',
    SERVICES: '/api/services',
    VERSIONS: '/api/versions',
    INFO_CARDS: '/api/info-cards',
    UPLOAD: '/api/upload',
    EXPORT: '/api/export',
    IMPORT: '/api/import'
} as const;