import type { ProjectData, Product, Service } from '@/types';
import { formatDate } from '../utils/helpers';

// Empty project data structure
export const EMPTY_PROJECT_DATA: ProjectData = {
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

// Template products for quick start
export const TEMPLATE_PRODUCTS: Product[] = [
    {
        id: 'fastlaner',
        name: 'FastLaner',
        display_name: 'Fast Laner',
        short_description: 'Self-checkout solution for retail',
        category: 'retail-solutions',
        status: 'active',
        overview: 'FastLaner is a comprehensive self-checkout solution that enables customers to scan, pay, and leave quickly while maintaining security and inventory control.',
        key_features: [
            'Intuitive touch interface',
            'Multiple payment options',
            'Real-time inventory sync',
            'Advanced security features'
        ],
        use_cases: [
            {
                title: 'Retail Stores',
                description: 'Perfect for grocery and convenience stores'
            },
            {
                title: 'Quick Service',
                description: 'Ideal for fast-food and quick service restaurants'
            }
        ],
        sort_order: 1,
        created_at: formatDate(),
        updated_at: formatDate()
    },
    {
        id: 'smartshelf',
        name: 'SmartShelf',
        display_name: 'Smart Shelf',
        short_description: 'Intelligent shelf management system',
        category: 'inventory-management',
        status: 'active',
        overview: 'SmartShelf provides real-time inventory tracking and automated restocking alerts for retail environments.',
        key_features: [
            'Real-time inventory tracking',
            'Automated alerts',
            'Weight sensors',
            'Integration with POS systems'
        ],
        use_cases: [
            {
                title: 'Grocery Stores',
                description: 'Monitor product levels and prevent stockouts'
            }
        ],
        sort_order: 2,
        created_at: formatDate(),
        updated_at: formatDate()
    },
    {
        id: 'wuca',
        name: 'WUCA',
        display_name: 'WUCA',
        short_description: 'Wireless customer analytics platform',
        category: 'analytics-tools',
        status: 'active',
        overview: 'WUCA analyzes customer behavior and movement patterns using wireless signals to provide valuable insights.',
        key_features: [
            'Customer flow analysis',
            'Dwell time tracking',
            'Heat map generation',
            'Privacy-compliant tracking'
        ],
        use_cases: [
            {
                title: 'Shopping Centers',
                description: 'Analyze customer flow and optimize layout'
            }
        ],
        sort_order: 3,
        created_at: formatDate(),
        updated_at: formatDate()
    }
];

// Template services for quick start
export const TEMPLATE_SERVICES: Record<string, Service[]> = {
    fastlaner: [
        {
            id: 'xy-service',
            product_id: 'fastlaner',
            name: 'XY Service',
            display_name: 'Transaction Processing Service',
            short_description: 'Handles payment transactions and receipt generation',
            category: 'payment',
            status: 'active',
            overview: 'The XY Service manages all payment transactions, receipt generation, and transaction history for FastLaner systems.',
            key_features: [
                'Real-time payment processing',
                'Digital receipt generation',
                'Transaction history tracking',
                'Multiple payment methods support'
            ],
            supported_protocols: ['REST', 'MQTT'],
            integration_guide: 'This service integrates with POS systems and payment gateways to provide seamless transaction processing.',
            sort_order: 1,
            created_at: formatDate(),
            updated_at: formatDate()
        },
        {
            id: 'payment-service',
            product_id: 'fastlaner',
            name: 'Payment Service',
            display_name: 'Payment Gateway Service',
            short_description: 'Payment gateway integration and processing',
            category: 'payment',
            status: 'active',
            overview: 'Secure payment processing service that handles various payment methods and ensures PCI compliance.',
            key_features: [
                'Multiple payment methods',
                'PCI compliance',
                'Fraud detection',
                'Real-time authorization'
            ],
            supported_protocols: ['REST'],
            integration_guide: 'Integrate with various payment providers through our unified API interface.',
            sort_order: 2,
            created_at: formatDate(),
            updated_at: formatDate()
        }
    ],
    smartshelf: [
        {
            id: 'shelf-management-service',
            product_id: 'smartshelf',
            name: 'Shelf Management Service',
            display_name: 'Shelf Management API',
            short_description: 'Inventory tracking and shelf management',
            category: 'inventory',
            status: 'active',
            overview: 'Comprehensive service for managing shelf inventory, tracking product levels, and generating alerts.',
            key_features: [
                'Real-time inventory updates',
                'Low stock alerts',
                'Product placement optimization',
                'Restocking recommendations'
            ],
            supported_protocols: ['REST', 'MQTT'],
            integration_guide: 'Connect your shelf sensors and POS systems to get real-time inventory insights.',
            sort_order: 1,
            created_at: formatDate(),
            updated_at: formatDate()
        }
    ],
    wuca: [
        {
            id: 'location-service',
            product_id: 'wuca',
            name: 'Location Service',
            display_name: 'Customer Location Analytics',
            short_description: 'Customer location and movement tracking',
            category: 'analytics',
            status: 'active',
            overview: 'Advanced analytics service that tracks customer movement patterns and provides actionable insights.',
            key_features: [
                'Real-time location tracking',
                'Movement pattern analysis',
                'Dwell time calculation',
                'Privacy-compliant data processing'
            ],
            supported_protocols: ['REST', 'WebSocket'],
            integration_guide: 'Deploy wireless sensors and integrate with our analytics platform for comprehensive customer insights.',
            sort_order: 1,
            created_at: formatDate(),
            updated_at: formatDate()
        }
    ]
};

// Sample API versions for templates
export const TEMPLATE_VERSIONS: Record<string, Record<string, any[]>> = {
    fastlaner: {
        'xy-service': [
            {
                version: '1.0.0',
                service_id: 'xy-service',
                product_id: 'fastlaner',
                status: 'deprecated',
                release_date: '2024-10-01T00:00:00Z',
                deprecated: true,
                beta: false,
                breaking_changes: false,
                introduction: 'Initial release of the XY Service API for transaction processing.',
                getting_started: 'To get started with XY Service v1.0.0:\n1. Obtain API credentials\n2. Set up authentication\n3. Make your first transaction API call',
                tutorials: [
                    {
                        title: 'Basic Integration',
                        content: 'Learn how to integrate the XY Service with your POS system.'
                    }
                ],
                code_examples: {
                    curl: 'curl -X POST https://api.wanzl.com/xy-service/v1.0.0/transactions -H "Authorization: Bearer YOUR_TOKEN" -d \'{"amount": 100.50, "currency": "EUR"}\'',
                    javascript: 'const response = await fetch("/api/transactions", {\n  method: "POST",\n  headers: { "Authorization": "Bearer " + token },\n  body: JSON.stringify({ amount: 100.50, currency: "EUR" })\n});'
                },
                created_at: formatDate(),
                updated_at: formatDate()
            },
            {
                version: '1.0.1',
                service_id: 'xy-service',
                product_id: 'fastlaner',
                status: 'stable',
                release_date: '2024-12-15T00:00:00Z',
                deprecated: false,
                beta: false,
                breaking_changes: true,
                introduction: 'XY Service API v1.0.1 includes important bug fixes and performance improvements.',
                getting_started: 'To get started with XY Service v1.0.1:\n1. Update your API endpoints\n2. Review breaking changes\n3. Test your integration',
                tutorials: [
                    {
                        title: 'Migration from v1.0.0',
                        content: 'Step-by-step guide to migrate from v1.0.0 to v1.0.1'
                    },
                    {
                        title: 'Advanced Features',
                        content: 'Learn about new features in v1.0.1'
                    }
                ],
                code_examples: {
                    curl: 'curl -X POST https://api.wanzl.com/xy-service/v1.0.1/transactions -H "Authorization: Bearer YOUR_TOKEN" -d \'{"amount": 100.50, "currency": "EUR", "payment_method": "card"}\'',
                    javascript: 'const response = await fetch("/api/v1.0.1/transactions", {\n  method: "POST",\n  headers: { "Authorization": "Bearer " + token },\n  body: JSON.stringify({ amount: 100.50, currency: "EUR", payment_method: "card" })\n});'
                },
                created_at: formatDate(),
                updated_at: formatDate()
            }
        ],
        'payment-service': [
            {
                version: '2.1.0',
                service_id: 'payment-service',
                product_id: 'fastlaner',
                status: 'stable',
                release_date: '2024-12-20T00:00:00Z',
                deprecated: false,
                beta: false,
                breaking_changes: false,
                introduction: 'Payment Service v2.1.0 adds support for new payment methods and enhanced security.',
                getting_started: 'Quick start guide for Payment Service v2.1.0:\n1. Configure payment providers\n2. Set up webhooks\n3. Process your first payment',
                tutorials: [
                    {
                        title: 'Payment Provider Setup',
                        content: 'Configure different payment providers with the Payment Service'
                    }
                ],
                code_examples: {
                    curl: 'curl -X POST https://api.wanzl.com/payment-service/v2.1.0/payments -H "Authorization: Bearer YOUR_TOKEN"',
                    javascript: 'const payment = await paymentService.processPayment({\n  amount: 100.50,\n  currency: "EUR",\n  method: "card"\n});'
                },
                created_at: formatDate(),
                updated_at: formatDate()
            }
        ]
    },
    smartshelf: {
        'shelf-management-service': [
            {
                version: '1.2.0',
                service_id: 'shelf-management-service',
                product_id: 'smartshelf',
                status: 'stable',
                release_date: '2024-11-01T00:00:00Z',
                deprecated: false,
                beta: false,
                breaking_changes: false,
                introduction: 'Shelf Management Service v1.2.0 introduces advanced analytics and real-time notifications.',
                getting_started: 'Get started with Shelf Management v1.2.0:\n1. Connect your sensors\n2. Configure product catalog\n3. Set up alert thresholds',
                tutorials: [
                    {
                        title: 'Sensor Integration',
                        content: 'How to connect and configure shelf sensors'
                    }
                ],
                code_examples: {
                    curl: 'curl -X GET https://api.wanzl.com/shelf-management/v1.2.0/shelves -H "Authorization: Bearer YOUR_TOKEN"',
                    javascript: 'const shelves = await shelfService.getShelves();'
                },
                created_at: formatDate(),
                updated_at: formatDate()
            }
        ]
    },
    wuca: {
        'location-service': [
            {
                version: '3.0.0',
                service_id: 'location-service',
                product_id: 'wuca',
                status: 'stable',
                release_date: '2024-12-01T00:00:00Z',
                deprecated: false,
                beta: false,
                breaking_changes: true,
                introduction: 'Location Service v3.0.0 brings major improvements in accuracy and privacy compliance.',
                getting_started: 'Start with Location Service v3.0.0:\n1. Deploy wireless beacons\n2. Configure tracking zones\n3. Access analytics dashboard',
                tutorials: [
                    {
                        title: 'Zone Configuration',
                        content: 'Set up tracking zones for customer analytics'
                    }
                ],
                code_examples: {
                    curl: 'curl -X GET https://api.wanzl.com/location-service/v3.0.0/analytics -H "Authorization: Bearer YOUR_TOKEN"',
                    javascript: 'const analytics = await locationService.getAnalytics({ zone: "entrance", timeframe: "1h" });'
                },
                created_at: formatDate(),
                updated_at: formatDate()
            }
        ]
    }
};

// Helper function to initialize project with templates
export const initializeProjectWithTemplates = (): ProjectData => {
    const projectData: ProjectData = {
        ...EMPTY_PROJECT_DATA,
        products: [...TEMPLATE_PRODUCTS],
        services: { ...TEMPLATE_SERVICES },
        versions: { ...TEMPLATE_VERSIONS },
        releaseNotes: {},
        apiSpecs: {},
        assets: {
            images: {},
            examples: {}
        }
    };

    // Update manifest counts
    projectData.manifest.products_count = projectData.products.length;
    projectData.manifest.services_count = Object.values(projectData.services).reduce(
        (total, services) => total + services.length,
        0
    );
    projectData.manifest.versions_count = Object.values(projectData.versions).reduce(
        (total, productVersions) => total + Object.values(productVersions).reduce(
            (serviceTotal, versions) => serviceTotal + versions.length,
            0
        ),
        0
    );

    return projectData;
};

// Quick start templates for new users
export const QUICK_START_OPTIONS = [
    {
        id: 'empty',
        name: 'Start Empty',
        description: 'Start with a blank project',
        data: EMPTY_PROJECT_DATA
    },
    {
        id: 'templates',
        name: 'Use Templates',
        description: 'Start with sample products and services',
        data: initializeProjectWithTemplates()
    }
];