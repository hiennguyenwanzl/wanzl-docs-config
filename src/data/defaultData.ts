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
            id: 'transaction-service',
            product_id: 'fastlaner',
            name: 'Transaction Service',
            display_name: 'Transaction Processing Service',
            short_description: 'Handles payment transactions and receipt generation',
            category: 'payment',
            status: 'active',
            overview: 'The Transaction Service manages all payment transactions, receipt generation, and transaction history for FastLaner systems.',
            key_features: [
                'Real-time payment processing',
                'Digital receipt generation',
                'Transaction history tracking',
                'Multiple payment methods support'
            ],
            protocol_type: 'REST', // Single protocol
            integration_guide: 'This service integrates with POS systems and payment gateways to provide seamless transaction processing.',
            sort_order: 1,
            created_at: formatDate(),
            updated_at: formatDate()
        },
        {
            id: 'notification-service',
            product_id: 'fastlaner',
            name: 'Notification Service',
            display_name: 'Real-time Notification Service',
            short_description: 'Publish and subscribe to event notifications',
            category: 'notification',
            status: 'active',
            overview: 'Notification Service provides real-time updates for transactions, inventory changes, and system events using MQTT protocol.',
            key_features: [
                'Real-time event notifications',
                'Topic-based subscriptions',
                'Message filtering',
                'QoS level support'
            ],
            protocol_type: 'MQTT', // Single protocol
            integration_guide: 'Connect to our MQTT broker to receive real-time updates about system events and changes.',
            sort_order: 2,
            created_at: formatDate(),
            updated_at: formatDate()
        }
    ],
    smartshelf: [
        {
            id: 'inventory-api',
            product_id: 'smartshelf',
            name: 'Inventory API',
            display_name: 'Inventory REST API',
            short_description: 'Manage inventory through REST endpoints',
            category: 'inventory',
            status: 'active',
            overview: 'Comprehensive REST API for managing shelf inventory, querying product levels, and generating reports.',
            key_features: [
                'Product inventory management',
                'Stock level alerts',
                'Inventory reporting',
                'Product data management'
            ],
            protocol_type: 'REST', // Single protocol
            integration_guide: 'Integrate with our RESTful endpoints to manage your inventory data.',
            sort_order: 1,
            created_at: formatDate(),
            updated_at: formatDate()
        },
        {
            id: 'sensor-events',
            product_id: 'smartshelf',
            name: 'Sensor Events',
            display_name: 'Shelf Sensor Events Service',
            short_description: 'Real-time shelf sensor data using MQTT',
            category: 'inventory',
            status: 'active',
            overview: 'Connect to live sensor data from SmartShelves using MQTT protocol for weight changes, product placement, and environmental data.',
            key_features: [
                'Real-time weight measurements',
                'Shelf status changes',
                'Temperature monitoring',
                'Motion detection events'
            ],
            protocol_type: 'MQTT', // Single protocol
            integration_guide: 'Connect your systems to our MQTT broker to receive real-time shelf sensor data.',
            sort_order: 2,
            created_at: formatDate(),
            updated_at: formatDate()
        }
    ],
    wuca: [
        {
            id: 'analytics-api',
            product_id: 'wuca',
            name: 'Analytics API',
            display_name: 'Customer Analytics API',
            short_description: 'Access customer analytics data via REST',
            category: 'analytics',
            status: 'active',
            overview: 'RESTful API service that provides access to customer movement and behavior analytics data.',
            key_features: [
                'Customer flow analysis',
                'Dwell time reporting',
                'Heat map generation',
                'Demographic analysis'
            ],
            protocol_type: 'REST', // Single protocol
            integration_guide: 'Access our analytics data through standard REST endpoints with authentication.',
            sort_order: 1,
            created_at: formatDate(),
            updated_at: formatDate()
        },
        {
            id: 'live-tracking',
            product_id: 'wuca',
            name: 'Live Tracking',
            display_name: 'Real-time Customer Tracking',
            short_description: 'Subscribe to live customer movement data',
            category: 'analytics',
            status: 'active',
            overview: 'MQTT-based service for real-time customer movement tracking and position updates.',
            key_features: [
                'Real-time location updates',
                'Zone entry/exit events',
                'Customer journey tracking',
                'Store occupancy monitoring'
            ],
            protocol_type: 'MQTT', // Single protocol
            integration_guide: 'Subscribe to our MQTT topics to receive real-time customer movement data.',
            sort_order: 2,
            created_at: formatDate(),
            updated_at: formatDate()
        }
    ]
};

// Sample API versions for templates
export const TEMPLATE_VERSIONS: Record<string, Record<string, any[]>> = {
    fastlaner: {
        'transaction-service': [
            {
                version: '1.0.0',
                service_id: 'transaction-service',
                product_id: 'fastlaner',
                status: 'deprecated',
                release_date: '2024-10-01T00:00:00Z',
                deprecated: true,
                beta: false,
                breaking_changes: false,
                introduction: 'Initial release of the Transaction Service API for processing payments.',
                getting_started: 'To get started with Transaction Service v1.0.0:\n1. Obtain API credentials\n2. Set up authentication\n3. Make your first transaction API call',
                service_protocol_type: 'REST', // Match service protocol type
                supports_swagger: true,
                supports_mqtt: false,
                supported_apis: ['rest'],
                tutorials: [
                    {
                        title: 'Basic Integration',
                        content: 'Learn how to integrate the Transaction Service with your POS system.'
                    }
                ],
                code_examples: {
                    curl: 'curl -X POST https://api.example.com/v1.0.0/transactions -H "Authorization: Bearer YOUR_TOKEN" -d \'{"amount": 100.50, "currency": "EUR"}\'',
                    javascript: 'const response = await fetch("/api/transactions", {\n  method: "POST",\n  headers: { "Authorization": "Bearer " + token },\n  body: JSON.stringify({ amount: 100.50, currency: "EUR" })\n});'
                },
                created_at: formatDate(),
                updated_at: formatDate()
            },
            {
                version: '1.0.1',
                service_id: 'transaction-service',
                product_id: 'fastlaner',
                status: 'stable',
                release_date: '2024-12-15T00:00:00Z',
                deprecated: false,
                beta: false,
                breaking_changes: true,
                introduction: 'Transaction Service API v1.0.1 includes important bug fixes and performance improvements.',
                getting_started: 'To get started with Transaction Service v1.0.1:\n1. Update your API endpoints\n2. Review breaking changes\n3. Test your integration',
                service_protocol_type: 'REST', // Match service protocol type
                supports_swagger: true,
                supports_mqtt: false,
                supported_apis: ['rest'],
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
                    curl: 'curl -X POST https://api.example.com/v1.0.1/transactions -H "Authorization: Bearer YOUR_TOKEN" -d \'{"amount": 100.50, "currency": "EUR", "payment_method": "card"}\'',
                    javascript: 'const response = await fetch("/api/v1.0.1/transactions", {\n  method: "POST",\n  headers: { "Authorization": "Bearer " + token },\n  body: JSON.stringify({ amount: 100.50, currency: "EUR", payment_method: "card" })\n});'
                },
                created_at: formatDate(),
                updated_at: formatDate()
            }
        ],
        'notification-service': [
            {
                version: '2.1.0',
                service_id: 'notification-service',
                product_id: 'fastlaner',
                status: 'stable',
                release_date: '2024-12-20T00:00:00Z',
                deprecated: false,
                beta: false,
                breaking_changes: false,
                introduction: 'Notification Service v2.1.0 provides real-time MQTT-based notifications for transaction events.',
                getting_started: 'Quick start guide for Notification Service v2.1.0:\n1. Connect to the MQTT broker\n2. Subscribe to relevant topics\n3. Process incoming notifications',
                service_protocol_type: 'MQTT', // Match service protocol type
                supports_swagger: false,
                supports_mqtt: true,
                supported_apis: ['mqtt'],
                tutorials: [
                    {
                        title: 'Setting Up MQTT Client',
                        content: 'How to configure your MQTT client to connect to our broker'
                    },
                    {
                        title: 'Topic Structure',
                        content: 'Understanding the topic hierarchy and message formats'
                    }
                ],
                code_examples: {
                    javascript: 'const mqtt = require(\'mqtt\');\nconst client = mqtt.connect(\'mqtt://broker.example.com\', {\n  username: \'your_username\',\n  password: \'your_password\'\n});\n\nclient.on(\'connect\', () => {\n  client.subscribe(\'transactions/+/status\');\n});\n\nclient.on(\'message\', (topic, message) => {\n  console.log(message.toString());\n});'
                },
                created_at: formatDate(),
                updated_at: formatDate()
            }
        ]
    },
    smartshelf: {
        'inventory-api': [
            {
                version: '1.2.0',
                service_id: 'inventory-api',
                product_id: 'smartshelf',
                status: 'stable',
                release_date: '2024-11-01T00:00:00Z',
                deprecated: false,
                beta: false,
                breaking_changes: false,
                introduction: 'Inventory API v1.2.0 provides RESTful endpoints to manage your shelf inventory.',
                getting_started: 'Get started with Inventory API v1.2.0:\n1. Authenticate with your API key\n2. Query product inventory\n3. Set up alerts for low stock',
                service_protocol_type: 'REST', // Match service protocol type
                supports_swagger: true,
                supports_mqtt: false,
                supported_apis: ['rest'],
                tutorials: [
                    {
                        title: 'Authentication Guide',
                        content: 'How to authenticate with the Inventory API'
                    },
                    {
                        title: 'Product Inventory Management',
                        content: 'Managing products and stock levels through API calls'
                    }
                ],
                code_examples: {
                    curl: 'curl -X GET https://api.example.com/v1.2.0/inventory -H "Authorization: Bearer YOUR_TOKEN"',
                    javascript: 'const response = await fetch("/api/v1.2.0/inventory", {\n  headers: { "Authorization": "Bearer " + token }\n});\nconst inventory = await response.json();'
                },
                created_at: formatDate(),
                updated_at: formatDate()
            }
        ],
        'sensor-events': [
            {
                version: '1.0.0',
                service_id: 'sensor-events',
                product_id: 'smartshelf',
                status: 'stable',
                release_date: '2024-11-15T00:00:00Z',
                deprecated: false,
                beta: false,
                breaking_changes: false,
                introduction: 'Sensor Events Service provides real-time MQTT updates from shelf sensors.',
                getting_started: 'Connect to the Sensor Events Service:\n1. Set up your MQTT client\n2. Subscribe to sensor topics\n3. Process incoming sensor data',
                service_protocol_type: 'MQTT', // Match service protocol type
                supports_swagger: false,
                supports_mqtt: true,
                supported_apis: ['mqtt'],
                tutorials: [
                    {
                        title: 'Sensor Data Format',
                        content: 'Understanding the format of sensor data messages'
                    },
                    {
                        title: 'Event Processing',
                        content: 'Processing and responding to sensor events'
                    }
                ],
                code_examples: {
                    javascript: 'const mqtt = require(\'mqtt\');\nconst client = mqtt.connect(\'mqtt://sensors.example.com\');\n\nclient.on(\'connect\', () => {\n  client.subscribe(\'shelves/+/weight\');\n});\n\nclient.on(\'message\', (topic, message) => {\n  const data = JSON.parse(message.toString());\n  console.log(`Shelf ${data.shelfId}: ${data.weight}kg`);\n});'
                },
                created_at: formatDate(),
                updated_at: formatDate()
            }
        ]
    },
    wuca: {
        'analytics-api': [
            {
                version: '3.0.0',
                service_id: 'analytics-api',
                product_id: 'wuca',
                status: 'stable',
                release_date: '2024-12-01T00:00:00Z',
                deprecated: false,
                beta: false,
                breaking_changes: true,
                introduction: 'Analytics API v3.0.0 provides REST endpoints to access customer analytics data.',
                getting_started: 'Start with Analytics API v3.0.0:\n1. Obtain API credentials\n2. Configure authentication\n3. Query analytics endpoints',
                service_protocol_type: 'REST', // Match service protocol type
                supports_swagger: true,
                supports_mqtt: false,
                supported_apis: ['rest'],
                tutorials: [
                    {
                        title: 'Authentication',
                        content: 'How to authenticate with the Analytics API'
                    },
                    {
                        title: 'Data Retrieval',
                        content: 'Querying and filtering analytics data'
                    }
                ],
                code_examples: {
                    curl: 'curl -X GET https://api.example.com/v3.0.0/analytics/footfall -H "Authorization: Bearer YOUR_TOKEN"',
                    javascript: 'const response = await fetch("/api/v3.0.0/analytics/footfall?timeframe=1h", {\n  headers: { "Authorization": "Bearer " + token }\n});\nconst data = await response.json();'
                },
                created_at: formatDate(),
                updated_at: formatDate()
            }
        ],
        'live-tracking': [
            {
                version: '2.0.0',
                service_id: 'live-tracking',
                product_id: 'wuca',
                status: 'stable',
                release_date: '2024-12-05T00:00:00Z',
                deprecated: false,
                beta: false,
                breaking_changes: false,
                introduction: 'Live Tracking Service provides MQTT-based real-time customer position updates.',
                getting_started: 'Get started with Live Tracking v2.0.0:\n1. Connect to the MQTT broker\n2. Subscribe to tracking topics\n3. Process location updates',
                service_protocol_type: 'MQTT', // Match service protocol type
                supports_swagger: false,
                supports_mqtt: true,
                supported_apis: ['mqtt'],
                tutorials: [
                    {
                        title: 'Connecting to the Broker',
                        content: 'How to establish and maintain a connection to the MQTT broker'
                    },
                    {
                        title: 'Tracking Data Format',
                        content: 'Understanding the format of tracking data messages'
                    }
                ],
                code_examples: {
                    javascript: 'const mqtt = require(\'mqtt\');\nconst client = mqtt.connect(\'mqtt://tracking.example.com\');\n\nclient.on(\'connect\', () => {\n  client.subscribe(\'locations/+/position\');\n});\n\nclient.on(\'message\', (topic, message) => {\n  const data = JSON.parse(message.toString());\n  console.log(`Customer at (${data.x}, ${data.y}) in zone ${data.zone}`);\n});'
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