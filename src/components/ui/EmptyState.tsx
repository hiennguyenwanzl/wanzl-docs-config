// src/components/ui/EmptyState.tsx
import React from 'react';
import { Package, Plus } from 'lucide-react';
import Button from './Button';
import Card from './Card';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    showAction?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
                                                   icon,
                                                   title,
                                                   description,
                                                   actionLabel,
                                                   onAction,
                                                   showAction = true
                                               }) => {
    return (
        <Card className="text-center py-12">
            <div className="p-6">
                {icon || <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />}
                <h3 className="text-xl font-medium text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{description}</p>
                {showAction && actionLabel && onAction && (
                    <Button
                        variant="primary"
                        onClick={onAction}
                        leftIcon={<Plus className="w-4 h-4" />}
                    >
                        {actionLabel}
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default EmptyState;