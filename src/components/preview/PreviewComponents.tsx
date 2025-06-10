import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

// Default Icon Component
const DefaultIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
    <svg className={`${className} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21,15 16,10 5,21"/>
    </svg>
);

// Products List Preview (Static Site Home Page)
interface ProductsListPreviewProps {
    products: Array<{
        id: string;
        name: string;
        display_name?: string;
        short_description: string;
        icon?: string | null;
    }>;
    onBack: () => void;
}

export const ProductsListPreview: React.FC<ProductsListPreviewProps> = ({ products, onBack }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Button variant="ghost" onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                            Back to CMS
                        </Button>
                        <div className="text-2xl font-bold text-blue-600">WANZL DOCS</div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <nav className="flex space-x-6">
                            <a href="#" className="text-gray-700 hover:text-blue-600">PRODUCTS</a>
                            <a href="#" className="text-gray-700 hover:text-blue-600">FAQ</a>
                        </nav>
                        <Button variant="outline" size="sm">Sign In</Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center">
                        <p className="text-blue-200 mb-2">SUBHEADLINE</p>
                        <h1 className="text-4xl font-bold mb-8">API Documentation Portal</h1>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="max-w-6xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <p className="text-gray-600 mb-2">SEE ALL OUR PRODUCTS</p>
                    <h2 className="text-3xl font-bold text-gray-900">Service Documentations</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {products.map(product => (
                        <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="p-6 text-center">
                                <div className="mb-4 flex justify-center">
                                    {product.icon ? (
                                        <img src={product.icon} alt={product.name} className="w-16 h-16 object-contain" />
                                    ) : (
                                        <DefaultIcon className="w-16 h-16" />
                                    )}
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{product.display_name || product.name}</h3>
                                <p className="text-sm text-gray-600 mb-4">{product.short_description}</p>
                                <p className="text-xs text-gray-500">last Update: 12.04.2025</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 mt-12">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400 mb-4">WANZL</div>
                        <p className="text-gray-400">© 2025 Wanzl. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Product Detail Preview (Product Services Page)
interface ProductDetailPreviewProps {
    product: {
        id: string;
        name: string;
        display_name?: string;
        short_description: string;
        hero_image?: string | null;
    };
    services: Array<{
        id: string;
        name: string;
        display_name?: string;
        short_description: string;
        icon?: string | null;
    }>;
    onBack: () => void;
}

export const ProductDetailPreview: React.FC<ProductDetailPreviewProps> = ({ product, services, onBack }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Button variant="ghost" onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                            Back to CMS
                        </Button>
                        <div className="text-2xl font-bold text-blue-600">WANZL DOCS</div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <nav className="flex space-x-6">
                            <a href="#" className="text-gray-700 hover:text-blue-600">PRODUCTS</a>
                            <a href="#" className="text-gray-700 hover:text-blue-600">FAQ</a>
                        </nav>
                        <Button variant="outline" size="sm">Sign In</Button>
                    </div>
                </div>
            </header>

            {/* Hero Section with Product Image */}
            <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <p className="text-blue-200 mb-2">SUBHEADLINE</p>
                            <h1 className="text-4xl font-bold mb-4">{product.display_name || product.name}</h1>
                            <p className="text-blue-100">{product.short_description}</p>
                        </div>
                        {product.hero_image && (
                            <div className="flex justify-center lg:justify-end">
                                <img
                                    src={product.hero_image}
                                    alt={product.name}
                                    className="max-w-md w-full h-auto rounded-lg shadow-lg"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="max-w-6xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <p className="text-gray-600 mb-2">ALL AVAILABLE SERVICES TO THE {(product.name || '').toUpperCase()}</p>
                    <h2 className="text-3xl font-bold text-gray-900">Service Documentation</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {services.map(service => (
                        <Card key={service.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="p-6 text-center">
                                <div className="mb-4 flex justify-center">
                                    {service.icon ? (
                                        <img src={service.icon} alt={service.name} className="w-16 h-16 object-contain" />
                                    ) : (
                                        <DefaultIcon className="w-16 h-16" />
                                    )}
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{service.display_name || service.name}</h3>
                                <p className="text-sm text-gray-600 mb-4">{service.short_description}</p>
                                <p className="text-xs text-gray-500">last Update: 12.04.2025</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 mt-12">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400 mb-4">WANZL</div>
                        <p className="text-gray-400">© 2025 Wanzl. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};