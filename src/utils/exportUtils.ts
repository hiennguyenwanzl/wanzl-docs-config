import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { EXPORT_STRUCTURE } from '../constants';
import { formatDate, generateId, getLatestVersion, compareVersions } from './helpers';
import { base64ToBlob, optimizeImageToDataUrl, getImageFormatFromDataUrl } from './imageUtils';
import { DEFAULT_SERVICE_ICON_SVG } from '../components/ui/DefaultServiceIcon';
import type {
    ProjectData,
    StaticSiteData,
    Product,
    Service,
    ApiVersion,
    SearchIndexItem,
    Manifest,
    FileData
} from '../types';

/**
 * Check if string is a base64 image
 */
const isBase64Image = (str: string): boolean => {
    return str.startsWith('data:image/');
};

/**
 * Get file extension from image format
 */
const getFileExtensionFromFormat = (format: string): string => {
    switch (format) {
        case 'image/jpeg':
        case 'image/jpg':
            return 'jpg';
        case 'image/png':
            return 'png';
        case 'image/svg+xml':
            return 'svg';
        case 'image/webp':
            return 'webp';
        case 'image/gif':
            return 'gif';
        default:
            return 'jpg';
    }
};

/**
 * Save project data as JSON file with optimized images
 */
export const saveProjectData = async (projectData: ProjectData, filename?: string): Promise<void> => {
    try {
        console.log('Starting project data save with image optimization...');

        // Count original images
        let originalImageCount = 0;
        let originalTotalSize = 0;

        console.log('Counting original images...');

        // Count product images
        projectData.products.forEach(product => {
            if (product.icon) {
                originalImageCount++;
                const size = getBase64Size(product.icon);
                originalTotalSize += size;
                console.log(`Product ${product.id} icon: ${(size / 1024).toFixed(1)}KB`);
            }
            if (product.hero_image) {
                originalImageCount++;
                const size = getBase64Size(product.hero_image);
                originalTotalSize += size;
                console.log(`Product ${product.id} hero: ${(size / 1024).toFixed(1)}KB`);
            }
            if (product.gallery_images) {
                originalImageCount += product.gallery_images.length;
                product.gallery_images.forEach((img, index) => {
                    const size = getBase64Size(img);
                    originalTotalSize += size;
                    console.log(`Product ${product.id} gallery ${index + 1}: ${(size / 1024).toFixed(1)}KB`);
                });
            }
        });

        // Count service images
        let serviceIconCount = 0;
        Object.keys(projectData.services).forEach(productId => {
            const services = projectData.services[productId] || [];
            services.forEach(service => {
                if (service.icon) {
                    originalImageCount++;
                    serviceIconCount++;
                    const size = getBase64Size(service.icon);
                    originalTotalSize += size;
                    console.log(`Service ${service.id} icon: ${(size / 1024).toFixed(1)}KB`);
                }
            });
        });

        console.log(`Found ${originalImageCount} total images (${serviceIconCount} service icons) with total size: ${(originalTotalSize / 1024 / 1024).toFixed(2)}MB`);

        // Optimize images before saving
        const optimizedData = await optimizeProjectImages(projectData);

        // Count optimized images
        let optimizedTotalSize = 0;
        let optimizedServiceIconCount = 0;

        console.log('Counting optimized images...');

        optimizedData.products.forEach(product => {
            if (product.icon) {
                const size = getBase64Size(product.icon);
                optimizedTotalSize += size;
                console.log(`Optimized product ${product.id} icon: ${(size / 1024).toFixed(1)}KB`);
            }
            if (product.hero_image) {
                const size = getBase64Size(product.hero_image);
                optimizedTotalSize += size;
                console.log(`Optimized product ${product.id} hero: ${(size / 1024).toFixed(1)}KB`);
            }
            if (product.gallery_images) {
                product.gallery_images.forEach((img, index) => {
                    const size = getBase64Size(img);
                    optimizedTotalSize += size;
                    console.log(`Optimized product ${product.id} gallery ${index + 1}: ${(size / 1024).toFixed(1)}KB`);
                });
            }
        });

        Object.keys(optimizedData.services).forEach(productId => {
            const services = optimizedData.services[productId] || [];
            services.forEach(service => {
                if (service.icon) {
                    optimizedServiceIconCount++;
                    const size = getBase64Size(service.icon);
                    optimizedTotalSize += size;
                    console.log(`Optimized service ${service.id} icon: ${(size / 1024).toFixed(1)}KB`);
                }
            });
        });

        const totalReduction = ((originalTotalSize - optimizedTotalSize) / originalTotalSize * 100).toFixed(1);
        console.log(`Optimized total size: ${(optimizedTotalSize / 1024 / 1024).toFixed(2)}MB (${totalReduction}% reduction)`);
        console.log(`Service icons processed: ${optimizedServiceIconCount}`);

        const dataStr = JSON.stringify(optimizedData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const defaultFilename = `api-docs-project-${new Date().toISOString().split('T')[0]}.json`;
        saveAs(dataBlob, filename || defaultFilename);

        console.log('Project data saved successfully');
    } catch (error) {
        console.error('Failed to save project data:', error);
        throw new Error('Failed to save project data');
    }
};

/**
 * Load project data from JSON file
 */
export const loadProjectData = (file: FileData): Promise<Partial<ProjectData>> => {
    return new Promise((resolve, reject) => {
        try {
            const data = JSON.parse(file.content);
            resolve(data);
        } catch (error) {
            reject(new Error('Invalid JSON file'));
        }
    });
};

/**
 * Generate static site data structure
 */
export const generateStaticSiteData = (projectData: ProjectData): StaticSiteData => {
    const { products, services, versions, releaseNotes, apiSpecs, assets } = projectData;

    // Generate manifest
    const manifest: Manifest = {
        generated_at: formatDate(),
        version: projectData.manifest?.version || '1.0.0',
        build_id: `build-${Date.now()}`,
        products_count: products.length,
        services_count: Object.keys(services).reduce((total, productId) =>
            total + (services[productId]?.length || 0), 0),
        versions_count: Object.keys(versions).reduce((total, productId) =>
            total + Object.keys(versions[productId] || {}).reduce((serviceTotal, serviceId) =>
                serviceTotal + (versions[productId][serviceId]?.length || 0), 0), 0),
        last_updated: {
            products: formatDate(),
            services: formatDate(),
            api_specs: formatDate()
        }
    };

    // Generate products list
    const productsList: Product[] = products.map(product => ({
        ...product,
        icon: product.icon ? `/assets/images/products/${product.id}/product-icon.${getFileExtensionFromFormat(getImageFormatFromDataUrl(product.icon))}` : undefined,
        hero_image: product.hero_image ? `/assets/images/products/${product.id}/hero-image.${getFileExtensionFromFormat(getImageFormatFromDataUrl(product.hero_image))}` : undefined,
        services_count: services[product.id]?.length || 0
    }));

    // Generate search index
    const searchIndex = generateSearchIndex(products, services, versions, releaseNotes);

    // Generate product details
    const productDetails: Record<string, any> = {};
    products.forEach(product => {
        productDetails[product.id] = {
            ...product,
            icon: product.icon ? `/assets/images/products/${product.id}/product-icon.${getFileExtensionFromFormat(getImageFormatFromDataUrl(product.icon))}` : undefined,
            hero_image: product.hero_image ? `/assets/images/products/${product.id}/hero-image.${getFileExtensionFromFormat(getImageFormatFromDataUrl(product.hero_image))}` : undefined,
            gallery_images: product.gallery_images?.map((image, index) => {
                const ext = getFileExtensionFromFormat(getImageFormatFromDataUrl(image));
                return `/assets/images/products/${product.id}/gallery/image${index + 1}.${ext}`;
            }) || [],
            services: services[product.id]?.map(service => ({
                id: service.id,
                name: service.name,
                display_name: service.display_name,
                short_description: service.short_description,
                versions_count: versions[product.id]?.[service.id]?.length || 0,
                latest_version: getLatestVersionFromArray(versions[product.id]?.[service.id] || [])
            })) || [],
            services_count: services[product.id]?.length || 0
        };
    });

    // Generate service details
    const serviceDetails: Record<string, Record<string, any>> = {};
    Object.keys(services).forEach(productId => {
        serviceDetails[productId] = {};
        services[productId]?.forEach(service => {
            serviceDetails[productId][service.id] = {
                ...service,
                icon: service.icon ?
                    `/assets/images/services/${productId}/${service.id}/service-icon.${getFileExtensionFromFormat(getImageFormatFromDataUrl(service.icon))}` :
                    '/assets/images/global/default-service-icon.svg',
                versions: versions[productId]?.[service.id]?.map(version => ({
                    version: version.version,
                    status: version.status,
                    release_date: version.release_date,
                    supported_until: version.supported_until
                })) || [],
                versions_count: versions[productId]?.[service.id]?.length || 0,
                latest_version: getLatestVersionFromArray(versions[productId]?.[service.id] || [])
            };
        });
    });

    // Generate version details
    const versionDetails: Record<string, Record<string, Record<string, ApiVersion>>> = {};
    Object.keys(versions).forEach(productId => {
        versionDetails[productId] = {};
        Object.keys(versions[productId] || {}).forEach(serviceId => {
            versionDetails[productId][serviceId] = {};
            versions[productId][serviceId]?.forEach(version => {
                versionDetails[productId][serviceId][version.version] = {
                    ...version,
                    api_specs: {
                        openapi: apiSpecs[productId]?.[serviceId]?.[version.version]?.openapi ?
                            `/api-specs/${productId}/${serviceId}/${version.version}/openapi.yaml` : undefined,
                        mqtt: apiSpecs[productId]?.[serviceId]?.[version.version]?.mqtt ?
                            `/api-specs/${productId}/${serviceId}/${version.version}/asyncapi.yaml` : undefined
                    },
                    release_notes_url: `/release-notes/${productId}/${serviceId}/${version.version}.json`,
                    examples_url: `/assets/examples/${productId}/${serviceId}/${version.version}/`
                };
            });
        });
    });

    return {
        manifest,
        productsList,
        searchIndex,
        productDetails,
        serviceDetails,
        versionDetails,
        releaseNotes: releaseNotes || {},
        apiSpecs: apiSpecs || {},
        assets: assets || { images: {}, examples: {} }
    };
};

/**
 * Export project as ZIP file with static site structure
 */
export const exportStaticSiteData = async (projectData: ProjectData, filename?: string): Promise<void> => {
    const zip = new JSZip();

    // Optimize images before export if they're not already compressed
    const dataToExport = await optimizeProjectImages(projectData);
    const staticData = generateStaticSiteData(dataToExport);

    // Create data folder
    const dataFolder = zip.folder(EXPORT_STRUCTURE.DATA_FOLDER);
    if (!dataFolder) throw new Error('Failed to create data folder');

    // Add root files
    dataFolder.file(EXPORT_STRUCTURE.FILES.MANIFEST, JSON.stringify(staticData.manifest, null, 2));
    dataFolder.file(EXPORT_STRUCTURE.FILES.PRODUCTS_LIST, JSON.stringify(staticData.productsList, null, 2));
    dataFolder.file(EXPORT_STRUCTURE.FILES.SEARCH_INDEX, JSON.stringify(staticData.searchIndex, null, 2));

    // Add product files
    const productsFolder = dataFolder.folder(EXPORT_STRUCTURE.FOLDERS.PRODUCTS);
    Object.keys(staticData.productDetails).forEach(productId => {
        productsFolder?.file(`${productId}.json`,
            JSON.stringify(staticData.productDetails[productId], null, 2));
    });

    // Add service files
    const servicesFolder = dataFolder.folder(EXPORT_STRUCTURE.FOLDERS.SERVICES);
    Object.keys(staticData.serviceDetails).forEach(productId => {
        const productServicesFolder = servicesFolder?.folder(productId);
        Object.keys(staticData.serviceDetails[productId]).forEach(serviceId => {
            productServicesFolder?.file(`${serviceId}.json`,
                JSON.stringify(staticData.serviceDetails[productId][serviceId], null, 2));
        });
    });

    // Add version files
    const versionsFolder = dataFolder.folder(EXPORT_STRUCTURE.FOLDERS.VERSIONS);
    Object.keys(staticData.versionDetails).forEach(productId => {
        const productVersionsFolder = versionsFolder?.folder(productId);
        Object.keys(staticData.versionDetails[productId]).forEach(serviceId => {
            const serviceVersionsFolder = productVersionsFolder?.folder(serviceId);
            Object.keys(staticData.versionDetails[productId][serviceId]).forEach(versionId => {
                serviceVersionsFolder?.file(`${versionId}.json`,
                    JSON.stringify(staticData.versionDetails[productId][serviceId][versionId], null, 2));
            });
        });
    });

    // Add release notes
    const releaseNotesFolder = dataFolder.folder(EXPORT_STRUCTURE.FOLDERS.RELEASE_NOTES);
    Object.keys(staticData.releaseNotes).forEach(productId => {
        const productReleaseNotesFolder = releaseNotesFolder?.folder(productId);
        Object.keys(staticData.releaseNotes[productId] || {}).forEach(serviceId => {
            const serviceReleaseNotesFolder = productReleaseNotesFolder?.folder(serviceId);
            Object.keys(staticData.releaseNotes[productId][serviceId] || {}).forEach(versionId => {
                serviceReleaseNotesFolder?.file(`${versionId}.json`,
                    JSON.stringify(staticData.releaseNotes[productId][serviceId][versionId], null, 2));
            });
        });
    });

    // Add API specs with proper content extraction
    const apiSpecsFolder = dataFolder.folder(EXPORT_STRUCTURE.FOLDERS.API_SPECS);
    Object.keys(staticData.apiSpecs).forEach(productId => {
        const productApiSpecsFolder = apiSpecsFolder?.folder(productId);
        Object.keys(staticData.apiSpecs[productId] || {}).forEach(serviceId => {
            const serviceApiSpecsFolder = productApiSpecsFolder?.folder(serviceId);
            Object.keys(staticData.apiSpecs[productId][serviceId] || {}).forEach(versionId => {
                const versionApiSpecsFolder = serviceApiSpecsFolder?.folder(versionId);
                const specs = staticData.apiSpecs[productId][serviceId][versionId];

                if (specs.openapi) {
                    const openApiContent = extractApiSpecContent(specs.openapi);
                    if (openApiContent) {
                        versionApiSpecsFolder?.file('openapi.yaml', openApiContent);
                    }
                }
                if (specs.mqtt) {
                    const mqttContent = extractApiSpecContent(specs.mqtt);
                    if (mqttContent) {
                        versionApiSpecsFolder?.file('asyncapi.yaml', mqttContent);
                    }
                }
            });
        });
    });

    // Add assets
    const assetsFolder = dataFolder.folder(EXPORT_STRUCTURE.FOLDERS.ASSETS);
    const imagesFolder = assetsFolder?.folder('images');

    // Add product images with correct file extensions
    const productImagesFolder = imagesFolder?.folder('products');
    dataToExport.products.forEach(product => {
        if (product.icon || product.hero_image || (product.gallery_images && product.gallery_images.length > 0)) {
            const productImageFolder = productImagesFolder?.folder(product.id);

            // Add product icon with correct extension
            if (product.icon) {
                try {
                    const format = getImageFormatFromDataUrl(product.icon);
                    const extension = getFileExtensionFromFormat(format);
                    const iconBlob = base64ToBlob(product.icon, format);
                    productImageFolder?.file(`product-icon.${extension}`, iconBlob);
                } catch (error) {
                    console.warn(`Failed to process icon for product ${product.id}:`, error);
                }
            }

            // Add hero image with correct extension
            if (product.hero_image) {
                try {
                    const format = getImageFormatFromDataUrl(product.hero_image);
                    const extension = getFileExtensionFromFormat(format);
                    const heroBlob = base64ToBlob(product.hero_image, format);
                    productImageFolder?.file(`hero-image.${extension}`, heroBlob);
                } catch (error) {
                    console.warn(`Failed to process hero image for product ${product.id}:`, error);
                }
            }

            // Add gallery images with correct extensions
            if (product.gallery_images && product.gallery_images.length > 0) {
                const galleryFolder = productImageFolder?.folder('gallery');
                product.gallery_images.forEach((image, index) => {
                    try {
                        const format = getImageFormatFromDataUrl(image);
                        const extension = getFileExtensionFromFormat(format);
                        const imageBlob = base64ToBlob(image, format);
                        galleryFolder?.file(`image${index + 1}.${extension}`, imageBlob);
                    } catch (error) {
                        console.warn(`Failed to process gallery image ${index + 1} for product ${product.id}:`, error);
                    }
                });
            }
        }
    });

    // Add service images with correct file extensions
    const serviceImagesFolder = imagesFolder?.folder('services');
    Object.keys(dataToExport.services).forEach(productId => {
        const services = dataToExport.services[productId] || [];
        services.forEach(service => {
            if (service.icon) {
                const productServiceImagesFolder = serviceImagesFolder?.folder(productId);
                const serviceImageFolder = productServiceImagesFolder?.folder(service.id);
                try {
                    const format = getImageFormatFromDataUrl(service.icon);
                    const extension = getFileExtensionFromFormat(format);
                    const iconBlob = base64ToBlob(service.icon, format);
                    serviceImageFolder?.file(`service-icon.${extension}`, iconBlob);
                } catch (error) {
                    console.warn(`Failed to process icon for service ${service.id} in product ${productId}:`, error);
                }
            }
        });
    });

    // Add global default images folder with default service icon
    const globalImagesFolder = imagesFolder?.folder('global');
    globalImagesFolder?.file('default-service-icon.svg', DEFAULT_SERVICE_ICON_SVG);

    // Add examples folder if there are any examples in the assets
    if (staticData.assets.examples && Object.keys(staticData.assets.examples).length > 0) {
        const examplesFolder = assetsFolder?.folder('examples');
        Object.keys(staticData.assets.examples).forEach(productId => {
            const productExamplesFolder = examplesFolder?.folder(productId);
            Object.keys(staticData.assets.examples[productId] || {}).forEach(serviceId => {
                const serviceExamplesFolder = productExamplesFolder?.folder(serviceId);
                Object.keys(staticData.assets.examples[productId][serviceId] || {}).forEach(versionId => {
                    const versionExamplesFolder = serviceExamplesFolder?.folder(versionId);
                    const examples = staticData.assets.examples[productId][serviceId][versionId];

                    if (examples?.requests) {
                        versionExamplesFolder?.file('requests.json', JSON.stringify(examples.requests, null, 2));
                    }
                    if (examples?.responses) {
                        versionExamplesFolder?.file('responses.json', JSON.stringify(examples.responses, null, 2));
                    }
                });
            });
        });
    }

    // Generate and download ZIP
    const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
            level: 6
        }
    });

    const defaultFilename = `api-docs-static-${new Date().toISOString().split('T')[0]}.zip`;
    saveAs(zipBlob, filename || defaultFilename);
};

/**
 * Generate search index for full-text search
 */
const generateSearchIndex = (
    products: Product[],
    services: Record<string, Service[]>,
    versions: Record<string, Record<string, ApiVersion[]>>,
    releaseNotes: Record<string, any>
): { indexItems: SearchIndexItem[] } => {
    const indexItems: SearchIndexItem[] = [];

    // Index products
    products.forEach(product => {
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

    // Index services
    Object.keys(services).forEach(productId => {
        services[productId]?.forEach(service => {
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

    // Index API versions
    Object.keys(versions).forEach(productId => {
        Object.keys(versions[productId] || {}).forEach(serviceId => {
            versions[productId][serviceId]?.forEach(version => {
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
 * Get latest version from versions array
 */
const getLatestVersionFromArray = (versions: ApiVersion[]): string => {
    if (!versions || versions.length === 0) return '1.0.0';

    const versionStrings = versions.map(v => v.version);
    return getLatestVersion(versionStrings);
};

const extractApiSpecContent = (spec: any): string => {
    if (!spec) return '';

    // If it's already a string, return it
    if (typeof spec === 'string') {
        return spec;
    }

    // If it's a FileData object with content property
    if (spec && typeof spec === 'object' && spec.content) {
        return spec.content;
    }

    // If it's a FileData object with other properties, try to extract content
    if (spec && typeof spec === 'object') {
        // Try common property names
        if (spec.data) return spec.data;
        if (spec.text) return spec.text;
        if (spec.yaml) return spec.yaml;
        if (spec.json) return JSON.stringify(spec.json, null, 2);
    }

    // Last resort: stringify the object
    try {
        return JSON.stringify(spec, null, 2);
    } catch {
        return '';
    }
};

/**
 * Optimize all images in project data for storage
 */
const optimizeProjectImages = async (projectData: ProjectData): Promise<ProjectData> => {
    const optimizedData = { ...projectData };

    console.log('Starting image optimization process...');

    // Optimize product images
    const optimizedProducts = await Promise.all(
        projectData.products.map(async (product) => {
            const optimizedProduct = { ...product };

            // Optimize product icon
            if (product.icon && isBase64Image(product.icon)) {
                try {
                    const originalSize = getBase64Size(product.icon);
                    console.log(`Product ${product.id} icon original size: ${(originalSize / 1024).toFixed(1)}KB`);

                    if (!isImageCompressed(product.icon)) {
                        console.log(`Compressing product ${product.id} icon...`);
                        const blob = base64ToBlob(product.icon);
                        const file = new File([blob], 'icon', { type: blob.type });

                        const quality = blob.type === 'image/png' ? 0.6 : 0.5;
                        optimizedProduct.icon = await optimizeImageToDataUrl(file, {
                            quality,
                            format: 'auto'
                        });

                        const newSize = getBase64Size(optimizedProduct.icon);
                        const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
                        console.log(`Product ${product.id} icon compressed: ${(newSize / 1024).toFixed(1)}KB (-${reduction}%)`);
                    } else {
                        console.log(`Product ${product.id} icon already compressed, skipping`);
                    }
                } catch (error) {
                    console.warn(`Failed to optimize icon for product ${product.id}:`, error);
                }
            }

            // Optimize hero image
            if (product.hero_image && isBase64Image(product.hero_image)) {
                try {
                    const originalSize = getBase64Size(product.hero_image);
                    console.log(`Product ${product.id} hero image original size: ${(originalSize / 1024).toFixed(1)}KB`);

                    if (!isImageCompressed(product.hero_image)) {
                        console.log(`Compressing product ${product.id} hero image...`);
                        const blob = base64ToBlob(product.hero_image);
                        const file = new File([blob], 'hero', { type: blob.type });
                        optimizedProduct.hero_image = await optimizeImageToDataUrl(file, {
                            quality: 0.7,
                            format: 'auto'
                        });

                        const newSize = getBase64Size(optimizedProduct.hero_image);
                        const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
                        console.log(`Product ${product.id} hero image compressed: ${(newSize / 1024).toFixed(1)}KB (-${reduction}%)`);
                    } else {
                        console.log(`Product ${product.id} hero image already compressed, skipping`);
                    }
                } catch (error) {
                    console.warn(`Failed to optimize hero image for product ${product.id}:`, error);
                }
            }

            // Optimize gallery images
            if (product.gallery_images && product.gallery_images.length > 0) {
                console.log(`Processing ${product.gallery_images.length} gallery images for product ${product.id}...`);
                optimizedProduct.gallery_images = await Promise.all(
                    product.gallery_images.map(async (image, index) => {
                        if (isBase64Image(image)) {
                            try {
                                const originalSize = getBase64Size(image);
                                console.log(`Gallery image ${index + 1} original size: ${(originalSize / 1024).toFixed(1)}KB`);

                                if (!isImageCompressed(image)) {
                                    console.log(`Compressing gallery image ${index + 1}...`);
                                    const blob = base64ToBlob(image);
                                    const file = new File([blob], `gallery_${index}`, { type: blob.type });
                                    const optimized = await optimizeImageToDataUrl(file, {
                                        quality: 0.6,
                                        format: 'auto'
                                    });

                                    const newSize = getBase64Size(optimized);
                                    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
                                    console.log(`Gallery image ${index + 1} compressed: ${(newSize / 1024).toFixed(1)}KB (-${reduction}%)`);
                                    return optimized;
                                } else {
                                    console.log(`Gallery image ${index + 1} already compressed, skipping`);
                                    return image;
                                }
                            } catch (error) {
                                console.warn(`Failed to optimize gallery image ${index} for product ${product.id}:`, error);
                                return image;
                            }
                        }
                        return image;
                    })
                );
            }

            return optimizedProduct;
        })
    );

    optimizedData.products = optimizedProducts;

    // Optimize service images
    console.log('Starting service icon optimization...');
    const optimizedServices: Record<string, Service[]> = {};

    for (const productId of Object.keys(projectData.services)) {
        const services = projectData.services[productId] || [];
        console.log(`Processing ${services.length} services for product ${productId}...`);

        optimizedServices[productId] = await Promise.all(
            services.map(async (service, serviceIndex) => {
                const optimizedService = { ...service };

                if (service.icon && isBase64Image(service.icon)) {
                    try {
                        const originalSize = getBase64Size(service.icon);
                        console.log(`Service ${service.id} (${serviceIndex + 1}/${services.length}) icon original size: ${(originalSize / 1024).toFixed(1)}KB`);

                        if (!isImageCompressed(service.icon)) {
                            console.log(`Compressing service ${service.id} icon...`);
                            const blob = base64ToBlob(service.icon);
                            const file = new File([blob], 'service_icon', { type: blob.type });

                            const quality = blob.type === 'image/png' ? 0.6 : 0.5;
                            console.log(`Using quality ${quality} for ${blob.type}`);

                            optimizedService.icon = await optimizeImageToDataUrl(file, {
                                quality,
                                format: 'auto'
                            });

                            const newSize = getBase64Size(optimizedService.icon);
                            const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
                            console.log(`✅ Service ${service.id} icon compressed: ${(newSize / 1024).toFixed(1)}KB (-${reduction}%)`);
                        } else {
                            console.log(`⏭️ Service ${service.id} icon already compressed (${(originalSize / 1024).toFixed(1)}KB), skipping`);
                        }
                    } catch (error) {
                        console.error(`❌ Failed to optimize icon for service ${service.id}:`, error);
                    }
                } else if (service.icon) {
                    console.log(`⚠️ Service ${service.id} icon is not a base64 image: ${service.icon?.substring(0, 50)}...`);
                } else {
                    console.log(`ℹ️ Service ${service.id} has no icon`);
                }

                return optimizedService;
            })
        );
    }

    optimizedData.services = optimizedServices;
    console.log('Service icon optimization completed');

    console.log('Image optimization process completed');
    return optimizedData;
};

/**
 * Check if image is already compressed
 */
const isImageCompressed = (dataUrl: string): boolean => {
    try {
        const base64 = dataUrl.split(',')[1];
        const sizeInBytes = (base64.length * 3) / 4;

        const format = getImageFormatFromDataUrl(dataUrl);

        if (format === 'image/svg+xml') {
            return true;
        }

        if (format === 'image/png') {
            return sizeInBytes < 150 * 1024; // 150KB
        }

        return sizeInBytes < 80 * 1024; // 80KB
    } catch {
        return false;
    }
};

/**
 * Get base64 image size in bytes
 */
const getBase64Size = (dataUrl: string): number => {
    try {
        const base64 = dataUrl.split(',')[1];
        return (base64.length * 3) / 4;
    } catch {
        return 0;
    }
};
