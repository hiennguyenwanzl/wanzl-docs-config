import React from 'react';
import { Package, Search, FileText } from 'lucide-react';
import Button from '../ui/Button.js';
import Input from '../ui/Input.js';

interface HeaderProps {
    onSearch: (searchTerm: string) => void;
    searchTerm?: string;
    onImport: () => void;
    onExport: () => void;
    onSave: () => void;
    onOpenTemplate?: () => void;
    hasChanges?: boolean;
    hasProjects?: boolean; // New prop to determine if template button should be shown
}

const Header: React.FC<HeaderProps> = ({
                                           onSearch,
                                           searchTerm = '',
                                           onImport,
                                           onExport,
                                           onSave,
                                           onOpenTemplate,
                                           hasChanges = false,
                                           hasProjects = false
                                       }) => {
    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Logo and Title */}
                <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                        <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">API Docs CMS</h1>
                        <p className="text-sm text-gray-500">Manage your documentation content</p>
                    </div>
                </div>

                {/* Search */}
                <div className="flex-1 max-w-lg mx-8">
                    <Input
                        placeholder="Search products, services, or versions..."
                        value={searchTerm}
                        onChange={(e) => onSearch(e.target.value)}
                        leftIcon={<Search className="w-4 h-4" />}
                        className="w-full"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                    {/* Template Button - only show when no projects exist */}
                    {!hasProjects && onOpenTemplate && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onOpenTemplate}
                            leftIcon={<FileText className="w-4 h-4" />}
                        >
                            Open Template
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onImport}
                    >
                        Import Project
                    </Button>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={onExport}
                    >
                        Export Data
                    </Button>

                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onSave}
                        className={hasChanges ? 'animate-pulse' : ''}
                    >
                        {hasChanges ? 'Save Changes' : 'Save Project'}
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;