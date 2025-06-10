import React from 'react';

interface DefaultIconProps {
    className?: string;
}

const DefaultIcon: React.FC<DefaultIconProps> = ({ className = "w-12 h-12" }) => (
    <svg className={`${className} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21,15 16,10 5,21"/>
    </svg>
);

export default DefaultIcon;