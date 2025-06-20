// src/hooks/useProjectData.ts
import { useState, useCallback } from 'react';
import { generateId, formatDate } from '../utils/helpers.js';
import { DEFAULTS } from '@/constants';
import type {
    ProjectData,
    Product,
    Service,
    ApiVersion,
    UseProjectDataReturn
} from '@/types';

const initialState: ProjectData = {
    products: [],
    services: {},
    versions: {},
    releaseNotes: {},
    apiSpecs: {},
    assets: {
        images: {},
        examples: {}
    },
    manifest: {
        version: '1.0.0',
        generated_at: formatDate(),
        products_count: 0,
        services_count: 0,
        versions_count: 0,
        last_updated: {
            products: formatDate(),
            services: formatDate(),
            api_specs: formatDate()
        }
    }
};

/**
 * Custom hook for managing project data
 */
const useProjectData = (initialData: ProjectData = initialState): UseProjectDataReturn => {
    const [projectData, setProjectData] = useState<ProjectData>(initialData);

    // Product management
    const addProduct = useCallback((productData: Partial<Product>): Product => {
        const product: Product = {
            ...DEFAULTS.PRODUCT,
            ...productData,
            id: productData.id || generateId(productData.name || ''),
            name: productData.name || '',
            short_description: productData.short_description || '',
            category: productData.category || 'other',
            status: productData.status || 'active',
            key_features: productData.key_features || [''],
            use_cases: productData.use_cases || [{ title: '', description: '' }],
            sort_order: productData.sort_order || 1,
            created_at: formatDate(),
            updated_at: formatDate()
        } as Product;

        setProjectData(prev => ({
            ...prev,
            products: [...prev.products, product],
            services: {
                ...prev.services,
                [product.id]: []
            },
            versions: {
                ...prev.versions,
                [product.id]: {}
            },
            assets: {
                ...prev.assets,
                images: {
                    ...prev.assets.images,
                    [product.id]: {}
                }
            }
        }));

        return product;
    }, []);

    const updateProduct = useCallback((productId: string, updates: Partial<Product>): void => {
        setProjectData(prev => ({
            ...prev,
            products: prev.products.map(product =>
                product.id === productId
                    ? { ...product, ...updates, updated_at: formatDate() }
                    : product
            )
        }));
    }, []);

    const deleteProduct = useCallback((productId: string): void => {
        setProjectData(prev => {
            const newServices = { ...prev.services };
            const newVersions = { ...prev.versions };
            const newAssets = { ...prev.assets };

            delete newServices[productId];
            delete newVersions[productId];
            if (newAssets.images) {
                delete newAssets.images[productId];
            }

            return {
                ...prev,
                products: prev.products.filter(product => product.id !== productId),
                services: newServices,
                versions: newVersions,
                assets: newAssets
            };
        });
    }, []);

    // Service management
    const addService = useCallback((productId: string, serviceData: Partial<Service>): Service => {
        const service: Service = {
            ...DEFAULTS.SERVICE,
            ...serviceData,
            id: serviceData.id || generateId(serviceData.name || ''),
            product_id: productId,
            name: serviceData.name || '',
            short_description: serviceData.short_description || '',
            category: serviceData.category || 'general',
            status: serviceData.status || 'active',
            key_features: serviceData.key_features || [''],
            supported_protocols: serviceData.protocol_type || ['REST'],
            sort_order: serviceData.sort_order || 1,
            created_at: formatDate(),
            updated_at: formatDate()
        } as Service;

        setProjectData(prev => ({
            ...prev,
            services: {
                ...prev.services,
                [productId]: [...(prev.services[productId] || []), service]
            },
            versions: {
                ...prev.versions,
                [productId]: {
                    ...prev.versions[productId],
                    [service.id]: []
                }
            }
        }));

        return service;
    }, []);

    const updateService = useCallback((productId: string, serviceId: string, updates: Partial<Service>): void => {
        setProjectData(prev => ({
            ...prev,
            services: {
                ...prev.services,
                [productId]: prev.services[productId]?.map(service =>
                    service.id === serviceId
                        ? { ...service, ...updates, updated_at: formatDate() }
                        : service
                ) || []
            }
        }));
    }, []);

    const deleteService = useCallback((productId: string, serviceId: string): void => {
        setProjectData(prev => {
            const newVersions = { ...prev.versions };
            if (newVersions[productId]) {
                delete newVersions[productId][serviceId];
            }

            return {
                ...prev,
                services: {
                    ...prev.services,
                    [productId]: prev.services[productId]?.filter(service => service.id !== serviceId) || []
                },
                versions: newVersions
            };
        });
    }, []);

    // Version management
    const addVersion = useCallback((productId: string, serviceId: string, versionData: Partial<ApiVersion>): ApiVersion => {
        const version: ApiVersion = {
            ...DEFAULTS.VERSION,
            ...versionData,
            version: versionData.version || '1.0.0',
            service_id: serviceId,
            product_id: productId,
            status: versionData.status || 'stable',
            release_date: versionData.release_date || formatDate(),
            deprecated: versionData.deprecated || false,
            beta: versionData.beta || false,
            breaking_changes: versionData.breaking_changes || false,
            tutorials: versionData.tutorials || [],
            code_examples: versionData.code_examples || {},
            created_at: formatDate(),
            updated_at: formatDate()
        } as ApiVersion;

        setProjectData(prev => ({
            ...prev,
            versions: {
                ...prev.versions,
                [productId]: {
                    ...prev.versions[productId],
                    [serviceId]: [...(prev.versions[productId]?.[serviceId] || []), version]
                }
            }
        }));

        return version;
    }, []);

    const updateVersion = useCallback((productId: string, serviceId: string, versionId: string, updates: Partial<ApiVersion>): void => {
        setProjectData(prev => ({
            ...prev,
            versions: {
                ...prev.versions,
                [productId]: {
                    ...prev.versions[productId],
                    [serviceId]: prev.versions[productId]?.[serviceId]?.map(version =>
                        version.version === versionId
                            ? { ...version, ...updates, updated_at: formatDate() }
                            : version
                    ) || []
                }
            }
        }));
    }, []);

    const deleteVersion = useCallback((productId: string, serviceId: string, versionId: string): void => {
        setProjectData(prev => ({
            ...prev,
            versions: {
                ...prev.versions,
                [productId]: {
                    ...prev.versions[productId],
                    [serviceId]: prev.versions[productId]?.[serviceId]?.filter(version =>
                        version.version !== versionId
                    ) || []
                }
            }
        }));
    }, []);

    // Asset management
    const updateAsset = useCallback((path: string, data: any): void => {
        setProjectData(prev => {
            const newAssets = { ...prev.assets };
            const pathParts = path.split('.');

            let current: any = newAssets;
            for (let i = 0; i < pathParts.length - 1; i++) {
                if (!current[pathParts[i]]) {
                    current[pathParts[i]] = {};
                }
                current = current[pathParts[i]];
            }

            current[pathParts[pathParts.length - 1]] = data;

            return {
                ...prev,
                assets: newAssets
            };
        });
    }, []);

    // Bulk operations
    const loadProjectData = useCallback((data: Partial<ProjectData>): void => {
        setProjectData({
            ...initialState,
            ...data,
            manifest: {
                ...initialState.manifest,
                ...data.manifest
            }
        });
    }, []);

    const resetProjectData = useCallback((): void => {
        setProjectData(initialState);
    }, []);

    // Getters
    const getProduct = useCallback((productId: string): Product | undefined => {
        return projectData.products.find(product => product.id === productId);
    }, [projectData.products]);

    const getService = useCallback((productId: string, serviceId: string): Service | undefined => {
        return projectData.services[productId]?.find(service => service.id === serviceId);
    }, [projectData.services]);

    const getVersion = useCallback((productId: string, serviceId: string, versionId: string): ApiVersion | undefined => {
        return projectData.versions[productId]?.[serviceId]?.find(version => version.version === versionId);
    }, [projectData.versions]);

    return {
        projectData,

        // Product operations
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,

        // Service operations
        addService,
        updateService,
        deleteService,
        getService,

        // Version operations
        addVersion,
        updateVersion,
        deleteVersion,
        getVersion,

        // Asset operations
        updateAsset,

        // Bulk operations
        loadProjectData,
        resetProjectData
    };
};

export default useProjectData;