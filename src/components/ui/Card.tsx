// src/components/ui/Card.tsx
import React, { forwardRef } from 'react';
import type { CardProps } from '@/types';

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({
         children,
         padding = 'md',
         shadow = 'md',
         rounded = 'md',
         hover = false,
         animate = false,
         className = '',
         ...props
     }, ref) => {
        const paddingClasses = {
            none: '',
            sm: 'p-3',
            md: 'p-4',
            lg: 'p-6',
            xl: 'p-8'
        };

        const shadowClasses = {
            none: '',
            sm: 'shadow-sm',
            md: 'shadow-md',
            lg: 'shadow-lg',
            xl: 'shadow-xl'
        };

        const roundedClasses = {
            none: '',
            sm: 'rounded-sm',
            md: 'rounded-md',
            lg: 'rounded-lg',
            xl: 'rounded-xl',
            full: 'rounded-full'
        };

        const cardClasses = [
            'bg-white border border-gray-200 transition-all duration-300 ease-in-out',
            paddingClasses[padding],
            shadowClasses[shadow],
            roundedClasses[rounded],
            hover && 'cursor-pointer hover:border-blue-400 hover:shadow-xl hover:shadow-blue-100/50',
            animate && 'hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] active:translate-y-0',
            className
        ].filter(Boolean).join(' ');

        return (
            <div
                ref={ref}
                className={cardClasses}
                style={{
                    transformOrigin: 'center',
                }}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

// Additional Card sub-components for better composition
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
                                                                               children,
                                                                               className = '',
                                                                               ...props
                                                                           }) => (
    <div
        className={`mb-4 pb-4 border-b border-gray-200 ${className}`}
        {...props}
    >
        {children}
    </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
                                                                                  children,
                                                                                  className = '',
                                                                                  ...props
                                                                              }) => (
    <h3
        className={`text-lg font-semibold text-gray-900 ${className}`}
        {...props}
    >
        {children}
    </h3>
);

export const CardSubtitle: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
                                                                                       children,
                                                                                       className = '',
                                                                                       ...props
                                                                                   }) => (
    <p
        className={`text-sm text-gray-600 mt-1 ${className}`}
        {...props}
    >
        {children}
    </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
                                                                                children,
                                                                                className = '',
                                                                                ...props
                                                                            }) => (
    <div
        className={`text-gray-700 ${className}`}
        {...props}
    >
        {children}
    </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
                                                                               children,
                                                                               className = '',
                                                                               ...props
                                                                           }) => (
    <div
        className={`mt-4 pt-4 border-t border-gray-200 ${className}`}
        {...props}
    >
        {children}
    </div>
);

export const CardActions: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
                                                                                children,
                                                                                className = '',
                                                                                ...props
                                                                            }) => (
    <div
        className={`flex items-center justify-end space-x-2 ${className}`}
        {...props}
    >
        {children}
    </div>
);

// Export main Card component as default
export default Card;