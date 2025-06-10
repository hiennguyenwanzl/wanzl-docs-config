import React, { forwardRef } from 'react';
import type { CardProps } from '@/types';

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({
         children,
         padding = 'md',
         shadow = 'md',
         rounded = 'md',
         hover = false,
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
            'bg-white border border-gray-200',
            paddingClasses[padding],
            shadowClasses[shadow],
            roundedClasses[rounded],
            hover && 'transition-all duration-200 hover:shadow-lg hover:border-gray-300 cursor-pointer',
            className
        ].filter(Boolean).join(' ');

        return (
            <div
                ref={ref}
                className={cardClasses}
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