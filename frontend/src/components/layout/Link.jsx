import PropTypes from 'prop-types';
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

Link.displayName = 'Link';

Link.propTypes = {
    onClick: PropTypes.func,
    href: PropTypes.string,
    children: PropTypes.node,
};

export default Link;
