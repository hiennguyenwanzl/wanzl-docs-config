import React from 'react';

interface DefaultServiceIconProps {
    className?: string;
    size?: number;
}

const DefaultServiceIcon: React.FC<DefaultServiceIconProps> = ({
                                                                   className = "w-6 h-6",
                                                                   size = 24
                                                               }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <rect x="3" y="4" width="18" height="16" rx="2" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1.5"/>
            <rect x="6" y="7" width="4" height="3" rx="1" fill="#6b7280"/>
            <rect x="6" y="11" width="6" height="2" rx="1" fill="#9ca3af"/>
            <rect x="6" y="14" width="8" height="2" rx="1" fill="#9ca3af"/>
            <circle cx="16" cy="9" r="2" fill="#3b82f6"/>
            <rect x="14" y="12" width="4" height="1" rx="0.5" fill="#3b82f6"/>
            <rect x="14" y="14" width="6" height="1" rx="0.5" fill="#3b82f6"/>
        </svg>
    );
};

// Export the SVG as a data URL for saving to files
export const DEFAULT_SERVICE_ICON_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="3" y="4" width="18" height="16" rx="2" fill="#e5e7eb" stroke="#9ca3af" stroke-width="1.5"/>
<rect x="6" y="7" width="4" height="3" rx="1" fill="#6b7280"/>
<rect x="6" y="11" width="6" height="2" rx="1" fill="#9ca3af"/>
<rect x="6" y="14" width="8" height="2" rx="1" fill="#9ca3af"/>
<circle cx="16" cy="9" r="2" fill="#3b82f6"/>
<rect x="14" y="12" width="4" height="1" rx="0.5" fill="#3b82f6"/>
<rect x="14" y="14" width="6" height="1" rx="0.5" fill="#3b82f6"/>
</svg>`;

export const DEFAULT_SERVICE_ICON_DATA_URL = `data:image/svg+xml;base64,${btoa(DEFAULT_SERVICE_ICON_SVG)}`;

export default DefaultServiceIcon;