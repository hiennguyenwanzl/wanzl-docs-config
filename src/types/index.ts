// Import types from constants to avoid circular dependency
import type {
    ProductCategory,
    EntityStatus,
    VersionStatus,
    Protocol,
    ApiType,
    ViewMode
} from '@/constants';

// Core Data Types
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
    protocol_type: 'REST' | 'MQTT'; // Single protocol per service
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

// Fixed ApiSpecs interface - unified type for both cases
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
    type: 'product' | 'service' | 'api' | 'release_note';
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
    last_updated: {
        products: string;
        services: string;
        api_specs: string;
    };
}

export interface ProjectAssets {
    images: Record<string, ProductImages>;
    examples: Record<string, any>;
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

export interface ProjectData {
    products: Product[];
    services: Record<string, Service[]>;
    versions: Record<string, Record<string, ApiVersion[]>>;
    releaseNotes: Record<string, Record<string, Record<string, ReleaseNote>>>;
    apiSpecs: Record<string, Record<string, Record<string, ApiSpecs>>>;
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
}

// Form Component Props
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

// File Upload Types
export interface FileData {
    name: string;
    content: string;
    size?: number;
    type?: string;
    lastModified?: number;
}

export interface VersionFormProps {
    version?: ApiVersion | null;
    productId: string;
    serviceId: string;
    onSave: (version: ApiVersion) => void | Promise<void>;
    onCancel: () => void;
    onPreview?: (version: ApiVersion) => void;
    isEditing?: boolean;
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

// Hook Types
export interface UseProjectDataReturn {
    projectData: ProjectData;
    addProduct: (productData: Partial<Product>) => Product;
    updateProduct: (productId: string, updates: Partial<Product>) => void;
    deleteProduct: (productId: string) => void;
    getProduct: (productId: string) => Product | undefined;
    addService: (productId: string, serviceData: Partial<Service>) => Service;
    updateService: (productId: string, serviceId: string, updates: Partial<Service>) => void;
    deleteService: (productId: string, serviceId: string) => void;
    getService: (productId: string, serviceId: string) => Service | undefined;
    addVersion: (productId: string, serviceId: string, versionData: Partial<ApiVersion>) => ApiVersion;
    updateVersion: (productId: string, serviceId: string, versionId: string, updates: Partial<ApiVersion>) => void;
    deleteVersion: (productId: string, serviceId: string, versionId: string) => void;
    getVersion: (productId: string, serviceId: string, versionId: string) => ApiVersion | undefined;
    updateAsset: (path: string, data: any) => void;
    loadProjectData: (data: Partial<ProjectData>) => void;
    resetProjectData: () => void;
}

// Validation Types
export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

export interface ValidationRules {
    REQUIRED_FIELDS: {
        PRODUCT: (keyof Product)[];
        SERVICE: (keyof Service)[];
        VERSION: (keyof ApiVersion)[];
    };
    MIN_LENGTHS: Record<string, number>;
    MAX_LENGTHS: Record<string, number>;
}

// Export/Import Types
export interface ExportOptions {
    filename?: string;
    includeAssets?: boolean;
    compressed?: boolean;
}

export interface StaticSiteData {
    manifest: Manifest;
    productsList: Product[];
    searchIndex: { indexItems: SearchIndexItem[] };
    productDetails: Record<string, Product>;
    serviceDetails: Record<string, Record<string, Service>>;
    versionDetails: Record<string, Record<string, Record<string, ApiVersion>>>;
    releaseNotes: Record<string, Record<string, Record<string, ReleaseNote>>>;
    apiSpecs: Record<string, Record<string, Record<string, ApiSpecs>>>;
    assets: ProjectAssets;
}

// Navigation Types
export interface NavigationState {
    currentView: ViewMode;
    selectedProduct: string | null;
    selectedService: string | null;
    selectedVersion: string | null;
    searchTerm: string;
    expandedProducts: string[];
}

// Error Types
export interface AppError {
    code: string;
    message: string;
    details?: any;
}

// Constants Types
export interface FileLimit {
    MAX_IMAGE_SIZE: number;
    MAX_FILE_SIZE: number;
    SUPPORTED_IMAGE_TYPES: string[];
    SUPPORTED_SPEC_TYPES: string[];
}

export interface NavItem {
    id: string;
    label: string;
    icon: string;
}

export interface ExportStructure {
    DATA_FOLDER: string;
    FOLDERS: {
        PRODUCTS: string;
        SERVICES: string;
        VERSIONS: string;
        RELEASE_NOTES: string;
        API_SPECS: string;
        ASSETS: string;
    };
    FILES: {
        MANIFEST: string;
        PRODUCTS_LIST: string;
        SEARCH_INDEX: string;
    };
}


// Protocol Types - Single protocol per service
export const PROTOCOL_TYPES = {
    REST: 'REST',
    MQTT: 'MQTT'
} as const;

export type ProtocolType = typeof PROTOCOL_TYPES[keyof typeof PROTOCOL_TYPES];
