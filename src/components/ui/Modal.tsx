// src/components/ui/Modal.tsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import type { ModalProps } from '@/types';

const Modal: React.FC<ModalProps> = ({
                                         isOpen,
                                         onClose,
                                         title,
                                         children,
                                         size = 'md',
                                         showCloseButton = true,
                                         closeOnOverlayClick = true,
                                         footer
                                     }) => {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-full mx-4 my-4 h-[calc(100vh-2rem)]' // Enhanced full size with proper spacing
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && closeOnOverlayClick) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div
                className={`flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0 ${
                    size === 'full' ? 'p-4' : ''
                }`}
                onClick={handleOverlayClick}
            >
                {/* Overlay */}
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />

                {/* Modal content */}
                <div className={`
                    inline-block w-full overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl
                    ${sizeClasses[size]}
                    ${size === 'full' ? 'h-full flex flex-col' : 'p-0 my-8'}
                `}>
                    {/* Header */}
                    {(title || showCloseButton) && (
                        <div className={`
                            flex items-center justify-between px-6 py-4 border-b border-gray-200
                            ${size === 'full' ? 'flex-shrink-0' : ''}
                        `}>
                            {title && (
                                <h3 className="text-lg font-medium text-gray-900">
                                    {title}
                                </h3>
                            )}
                            {showCloseButton && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Body */}
                    <div className={`
                        ${size === 'full'
                        ? 'flex-1 overflow-hidden'
                        : 'px-6 py-4 max-h-[80vh] overflow-y-auto'
                    }
                    `}>
                        {children}
                    </div>

                    {/* Footer */}
                    {footer && (
                        <div className={`
                            px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl
                            ${size === 'full' ? 'flex-shrink-0' : ''}
                        `}>
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;