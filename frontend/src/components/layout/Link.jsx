import NextLink from 'next/link';
import React from 'react';

const Link = React.forwardRef(({ onClick, href, children }, ref) => {
    return (
        <a
            style={{ textDecoration: 'none', color: 'inherit' }}
            href={href}
            onClick={onClick}
            ref={ref}
        >
            {children}
        </a>
    );
});

export default Link;
