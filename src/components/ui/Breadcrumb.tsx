import React from 'react';
import { Home } from 'lucide-react';

interface BreadcrumbItem {
    key: string;
    label: string;
    onClick?: () => void;
    isActive?: boolean;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <nav className="flex items-center text-sm mb-6">
            {items.map((item, index) => (
                <React.Fragment key={item.key}>
                    {index > 0 && (
                        <span className="text-gray-400 mx-2">›</span>
                    )}
                    {item.onClick ? (
                        <button
                            onClick={item.onClick}
                            className={`flex items-center transition-colors ${
                                item.isActive
                                    ? 'text-gray-600'
                                    : 'text-blue-600 hover:text-blue-700'
                            }`}
                        >
                            {item.key === 'home' && <Home className="w-4 h-4 mr-1" />}
                            {item.label}
                        </button>
                    ) : (
                        <span className="text-gray-600 flex items-center">
                            {item.key === 'home' && <Home className="w-4 h-4 mr-1" />}
                            {item.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumb;