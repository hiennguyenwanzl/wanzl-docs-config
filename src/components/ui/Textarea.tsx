import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, helperText, className = '', ...props }, ref) => {
        const textareaClasses = `w-full px-3 py-2 border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
            error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
        } ${className}`;

        const labelClasses = `block text-sm font-medium mb-1 ${
            error ? 'text-red-700' : 'text-gray-700'
        }`;

        return (
            <div className="w-full">
                {label && (
                    <label className={labelClasses}>
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <textarea
                    ref={ref}
                    className={textareaClasses}
                    rows={4}
                    {...props}
                />

                {error && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg
                            className="w-4 h-4 mr-1 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {error}
                    </p>
                )}

                {helperText && !error && (
                    <p className="mt-1 text-sm text-gray-500">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export default Textarea;