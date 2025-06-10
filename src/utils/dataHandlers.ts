// Data handling utilities for saving and loading project data with API specifications

export interface FileData {
    name: string;
    content: string;
    size: number;
    type: string;
    lastModified: number;
}

export interface ApiSpecs {
    openapi?: FileData | null;
    mqtt?: FileData | null;
}

export interface ProjectData {
    products: any[];
    services: Record<string, any[]>;
    versions: Record<string, Record<string, any[]>>;
    apiSpecs: Record<string, Record<string, Record<string, ApiSpecs>>>;
    assets: {
        images: Record<string, any>;
        examples: Record<string, any>;
    };
    manifest: {
        version: string;
        generated_at: string;
        products_count: number;
        services_count: number;
        versions_count: number;
        last_updated: {
            products: string;
            services: string;
            api_specs: string;
        };
    };
}

/**
 * Serialize project data for saving to JSON
 */
export const serializeProjectData = (projectData: ProjectData): string => {
    console.log('Serializing project data...');

    const serializedData = JSON.parse(JSON.stringify(projectData));

    serializedData.manifest = {
        ...serializedData.manifest,
        generated_at: new Date().toISOString(),
        last_updated: {
            products: new Date().toISOString(),
            services: new Date().toISOString(),
            api_specs: new Date().toISOString()
        }
    };

    console.log('Project data serialized successfully');
    return JSON.stringify(serializedData, null, 2);
};

/**
 * Deserialize project data from JSON
 */
export const deserializeProjectData = (jsonString: string): ProjectData => {
    console.log('Deserializing project data...');

    try {
        const data = JSON.parse(jsonString);

        if (!data.products || !data.services || !data.versions) {
            throw new Error('Invalid project data structure');
        }

        if (!data.apiSpecs) {
            data.apiSpecs = {};
        }

        if (!data.assets) {
            data.assets = { images: {}, examples: {} };
        }

        if (!data.manifest) {
            data.manifest = {
                version: '1.0.0',
                generated_at: new Date().toISOString(),
                products_count: data.products.length,
                services_count: Object.values(data.services).reduce((total: number, services: any) => total + services.length, 0),
                versions_count: 0,
                last_updated: {
                    products: new Date().toISOString(),
                    services: new Date().toISOString(),
                    api_specs: new Date().toISOString()
                }
            };
        }

        console.log('Project data deserialized successfully');
        return data as ProjectData;
    } catch (error) {
        console.error('Failed to deserialize project data:', error);
        throw new Error('Invalid JSON file format');
    }
};

/**
 * Save project data to local file
 */
export const saveProjectToFile = async (projectData: ProjectData, filename?: string): Promise<void> => {
    try {
        const serializedData = serializeProjectData(projectData);
        const blob = new Blob([serializedData], { type: 'application/json' });

        const defaultFilename = `api-docs-project-${new Date().toISOString().split('T')[0]}.json`;
        const finalFilename = filename || defaultFilename;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = finalFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('Project saved successfully:', finalFilename);
    } catch (error) {
        console.error('Failed to save project:', error);
        throw new Error('Failed to save project data');
    }
};

/**
 * Load project data from file
 */
export const loadProjectFromFile = (file: File): Promise<ProjectData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const projectData = deserializeProjectData(content);
                resolve(projectData);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsText(file);
    });
};

/**
 * Export static site data structure
 * Note: This is a simplified version for demo purposes
 * In real implementation, you would use JSZip library
 */
export const exportStaticSiteData = async (projectData: ProjectData): Promise<void> => {
    console.log('Generating static site data...');

    try {
        // Create a simplified export structure
        const exportData = {
            manifest: {
                generated_at: new Date().toISOString(),
                version: projectData.manifest?.version || '1.0.0',
                build_id: `build-${Date.now()}`,
                products_count: projectData.products.length,
                services_count: Object.values(projectData.services).reduce((total: number, services: any) => total + services.length, 0),
                versions_count: Object.values(projectData.versions).reduce(
                    (total: number, productVersions: Record<string, any[]>) =>
                        total +
                        Object.values(productVersions).reduce(
                            (serviceTotal: number, versions: any[]) => serviceTotal + versions.length,
                            0
                        ),
                    0
                ),
                last_updated: {
                    products: new Date().toISOString(),
                    services: new Date().toISOString(),
                    api_specs: new Date().toISOString()
                }
            },
            products: projectData.products,
            services: projectData.services,
            versions: projectData.versions,
            apiSpecs: projectData.apiSpecs,
            searchIndex: generateSearchIndex(projectData)
        };

        // For demo purposes, download as JSON file
        // In real implementation, this would create a ZIP with proper folder structure
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `api-docs-static-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('Static site data exported successfully');
    } catch (error) {
        console.error('Failed to export static site data:', error);
        throw new Error('Failed to export static site data');
    }
};

/**
 * Generate search index for full-text search
 */
const generateSearchIndex = (projectData: ProjectData) => {
    const indexItems: any[] = [];

    projectData.products.forEach(product => {
        indexItems.push({
            id: `product_${product.id}`,
            display_name: `${product.display_name || product.name} - ${product.short_description}`,
            type: 'product',
            link: `/${product.id}`,
            parent_id: null,
            content: `${product.overview || ''} ${product.key_features?.join(' ') || ''}`,
            fieldName: 'overview',
            priority: 1
        });
    });

    Object.keys(projectData.services).forEach(productId => {
        projectData.services[productId]?.forEach(service => {
            indexItems.push({
                id: `service_${productId}_${service.id}`,
                display_name: `${service.display_name || service.name} - ${service.short_description}`,
                type: 'service',
                link: `/${productId}/${service.id}`,
                parent_id: `product_${productId}`,
                content: `${service.overview || ''} ${service.integration_guide || ''}`,
                fieldName: 'overview',
                priority: 2
            });
        });
    });

    Object.keys(projectData.versions).forEach(productId => {
        Object.keys(projectData.versions[productId] || {}).forEach(serviceId => {
            projectData.versions[productId][serviceId]?.forEach(version => {
                indexItems.push({
                    id: `api_${productId}_${serviceId}_${version.version}`,
                    display_name: `${serviceId} API ${version.version}`,
                    type: 'api',
                    link: `/${productId}/${serviceId}/${version.version}`,
                    parent_id: `service_${productId}_${serviceId}`,
                    content: `${version.introduction || ''} ${version.getting_started || ''}`,
                    fieldName: 'introduction',
                    priority: 3
                });
            });
        });
    });

    return { indexItems };
};

/**
 * Update project data with new version including API specs
 */
export const updateProjectDataWithVersion = (
    projectData: ProjectData,
    productId: string,
    serviceId: string,
    versionData: any
): ProjectData => {
    const updatedData = JSON.parse(JSON.stringify(projectData));

    if (!updatedData.versions[productId]) {
        updatedData.versions[productId] = {};
    }
    if (!updatedData.versions[productId][serviceId]) {
        updatedData.versions[productId][serviceId] = [];
    }
    if (!updatedData.apiSpecs) {
        updatedData.apiSpecs = {};
    }
    if (!updatedData.apiSpecs[productId]) {
        updatedData.apiSpecs[productId] = {};
    }
    if (!updatedData.apiSpecs[productId][serviceId]) {
        updatedData.apiSpecs[productId][serviceId] = {};
    }

    const existingIndex = updatedData.versions[productId][serviceId].findIndex(
        (v: any) => v.version === versionData.version
    );

    if (existingIndex >= 0) {
        updatedData.versions[productId][serviceId][existingIndex] = versionData;
    } else {
        updatedData.versions[productId][serviceId].push(versionData);
    }

    updatedData.apiSpecs[productId][serviceId][versionData.version] = {
        openapi: versionData.api_specs?.openapi || null,
        mqtt: versionData.api_specs?.mqtt || null
    };

    return updatedData;
};