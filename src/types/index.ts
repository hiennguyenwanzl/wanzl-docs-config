// src/types/index.ts
import type {
    ProductCategory,
    EntityStatus,
    VersionStatus,
    Protocol,
    ApiType,
    ViewMode
} from '@/constants';

// Info Card for landing page content
export interface InfoCard {
    id: string;
    headline_title: string;
    brief_description: string;
    image_id?: string | null;
    image_url?: string | null;
    url: string;
    display_type: 'imageLeft' | 'imageRight'
    sort_order: number;
    created_at?: string;
    updated_at?: string;
}

// Core Data Types (simplified - no project_id since there's only one project)
export interface Product {
    id: string;
    name: string;
    display_name?: string;
    title?: string;
    tagline?: string;
    short_description: string;
    category: ProductCategory;
    status: EntityStatus;
    icon?: string | null;
    hero_image?: string | null;
    overview?: string;
    key_features: string[];
    use_cases: UseCase[];
    gallery_images?: string[];
    info_cards?: InfoCard[]; // Product-level info cards
    services_count?: number;
    sort_order: number;
    created_at?: string;
    updated_at?: string;
}

export interface Service {
    id: string;
    product_id: string;
    name: string;
    display_name?: string;
    title?: string;
    short_description: string;
    category: string;
    status: EntityStatus;
    icon?: string | null;
    overview?: string;
    key_features: string[];
    protocol_type: 'REST' | 'MQTT';
    integration_guide?: string;
    versions_count?: number;
    latest_version?: string;
    sort_order: number;
    created_at?: string;
    updated_at?: string;
}

export interface ApiVersion {
    version: string;
    service_id: string;
    product_id: string;
    status: VersionStatus;
    release_date: string;
    deprecated: boolean;
    beta: boolean;
    supported_until?: string;
    previous_version?: string;
    next_version?: string;
    breaking_changes: boolean;
    introduction?: string;
    getting_started?: string;
    tutorials: Tutorial[];
    code_examples: Record<string, string>;
    api_specs?: ApiSpecs;
    release_notes_url?: string;
    examples_url?: string;
    created_at?: string;
    updated_at?: string;
}

export interface UseCase {
    title: string;
    description: string;
}

export interface Tutorial {
    title: string;
    content: string;
}

export interface ApiSpecs {
    openapi?: string | FileData | null;
    mqtt?: string | FileData | null;
}

export interface ReleaseNote {
    version: string;
    service_id: string;
    product_id: string;
    release_date: string;
    status: VersionStatus;
    summary: string;
    highlights: string[];
    breaking_changes: BreakingChange[];
    new_features: Feature[];
    bug_fixes: string[];
    improvements: string[];
    known_issues: string[];
}

export interface BreakingChange {
    title: string;
    description: string;
    migration_guide: string;
}

export interface Feature {
    title: string;
    description: string;
}

export interface SearchIndexItem {
    id: string;
    display_name: string;
    type: 'product' | 'service' | 'api' | 'release_note' | 'info_card';
    link: string;
    parent_id?: string | null;
    content: string;
    fieldName: string;
    priority: number;
}

export interface Manifest {
    generated_at: string;
    version: string;
    build_id?: string;
    products_count: number;
    services_count: number;
    versions_count: number;
    info_cards_count: number;
    last_updated: {
        products: string;
        services: string;
        api_specs: string;
        info_cards: string;
    };
}

export interface ProjectAssets {
    images: Record<string, ProductImages>;
    examples: Record<string, any>;
    info_card_images: Record<string, string>; // For info card images
}

export interface ProductImages {
    icon?: string;
    hero?: string;
    gallery?: string[];
    services?: Record<string, ServiceImages>;
}

export interface ServiceImages {
    icon?: string;
}

// Simplified ProjectData structure (single project)
export interface ProjectData {
    // Project-level info (single project)
    project: {
        name: string;
        display_name?: string;
        title?: string;
        description?: string;
        status: EntityStatus;
    };
    // Content structure
    info_cards: InfoCard[]; // Landing page cards
    products: Product[];
    services: Record<string, Service[]>; // [product_id]
    versions: Record<string, Record<string, ApiVersion[]>>; // [product_id][service_id]
    releaseNotes: Record<string, Record<string, Record<string, ReleaseNote>>>; // [product_id][service_id][version]
    apiSpecs: Record<string, Record<string, Record<string, ApiSpecs>>>; // [product_id][service_id][version]
    assets: ProjectAssets;
    manifest: Manifest;
}

// Re-export types from constants
export type { ProductCategory, EntityStatus, VersionStatus, Protocol, ApiType, ViewMode };

// UI Component Props Types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost' | 'outline';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    options: (string | SelectOption)[];
    placeholder?: string;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    footer?: React.ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    hover?: boolean;
    animate?: boolean;
}

// Form Component Props
export interface InfoCardFormProps {
    infoCard?: InfoCard | null;
    onSave: (infoCard: InfoCard) => void | Promise<void>;
    onCancel: () => void;
    onPreview?: (infoCard: InfoCard) => void;
    isEditing?: boolean;
}

export interface ProductFormProps {
    product?: Product | null;
    onSave: (product: Product) => void | Promise<void>;
    onCancel: () => void;
    onPreview?: (product: Product) => void;
    isEditing?: boolean;
}

export interface ServiceFormProps {
    service?: Service | null;
    productId: string;
    onSave: (service: Service) => void | Promise<void>;
    onCancel: () => void;
    onPreview?: (service: Service) => void;
    isEditing?: boolean;
}

export interface VersionFormProps {
    version?: ApiVersion | null;
    productId: string;
    serviceId: string;
    serviceProtocolType: 'REST' | 'MQTT';
    onSave: (version: ApiVersion) => void | Promise<void>;
    onCancel: () => void;
    onPreview?: (version: ApiVersion) => void;
    isEditing?: boolean;
}

// File Upload Types
export interface FileData {
    name: string;
    content: string;
    size?: number;
    type?: string;
    lastModified?: number;
}

export interface ImageUploadProps {
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

export interface FileUploadProps {
    onFileUpload: (file: FileData | null) => void;
    currentFile?: FileData | null;
    label?: string;
    accept?: string;
    maxSize?: number;
    className?: string;
    description?: string;
    allowedTypes?: string[];
}

// Navigation Types (simplified)
export interface NavigationState {
    currentView: ViewMode;
    selectedProduct: string | null;
    selectedService: string | null;
    selectedVersion: string | null;
    selectedInfoCard: string | null;
    searchTerm: string;
    expandedProducts: string[];
}

// View Modes (updated)
export const VIEW_MODES = {
    OVERVIEW: 'overview', // Landing page with info cards
    PRODUCTS: 'products',
    PRODUCT_DETAIL: 'product_detail',
    SERVICE_DETAIL: 'service_detail',
    VERSION_DETAIL: 'version_detail',
    INFO_CARD_DETAIL: 'info_card_detail'
} as const;

// Protocol Types
export const PROTOCOL_TYPES = {
    REST: 'REST',
    MQTT: 'MQTT'
} as const;

export type ProtocolType = typeof PROTOCOL_TYPES[keyof typeof PROTOCOL_TYPES];

// Error Types
export interface AppError {
    code: string;
    message: string;
    details?: any;
}

// Validation Types
export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}