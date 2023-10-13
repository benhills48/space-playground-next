import React from 'react';

export default function Button({
    wrapperCn = '',
    className = '',
    onClick = null,
    disabled = false,
    children,
}) {
    return (
        <span className={wrapperCn}>
            <button
                disabled={disabled}
                className={className}
                onClick={onClick}
            >
                {children}
            </button>
        </span>
    );
}
