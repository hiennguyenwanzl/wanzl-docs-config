// src/components/layout/Header.tsx
import React from 'react';
import { Package, Search, FileText, Upload, Download, Save } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import logoUrl from '@/assests/logo.svg';

interface HeaderProps {
    onSearch: (searchTerm: string) => void;
    searchTerm?: string;
    onImport: () => void;
    onExport: () => void;
    onSave: () => void;
    onOpenTemplate?: () => void;
    onLogoClick?: () => void;
    hasChanges?: boolean;
    hasProjects?: boolean;
}

const Header: React.FC<HeaderProps> = ({
                                           onSearch,
                                           searchTerm = '',
                                           onImport,
                                           onExport,
                                           onSave,
                                           onOpenTemplate,
                                           onLogoClick,
                                           hasChanges = false,
                                           hasProjects = false
                                       }) => {
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
            <div className="flex items-end justify-between h-16">
                {/* Logo and Title */}
                <div
                    className="flex items-end space-x-4 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={onLogoClick}
                >
                    <img
                        src={logoUrl}
                        alt="Wanzl Logo"
                        className="w-40 h-auto"
                    />
                    <div className="pb-1">
                        <h1 className="text-lg font-semibold text-gray-700">API Docs Config</h1>
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
                <div className="flex items-center space-x-3 pb-1">
                    {/* Template Button - only show when no projects exist */}
                    {!hasProjects && onOpenTemplate && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onOpenTemplate}
                            leftIcon={<FileText className="w-4 h-4" />}
                            className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100"
                        >
                            Use Template
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onImport}
                        leftIcon={<Upload className="w-4 h-4" />}
                    >
                        Import Project
                    </Button>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={onExport}
                        leftIcon={<Download className="w-4 h-4" />}
                    >
                        Export Data
                    </Button>

                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onSave}
                        leftIcon={<Save className="w-4 h-4" />}
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