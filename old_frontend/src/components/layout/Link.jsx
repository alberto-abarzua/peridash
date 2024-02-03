import PropTypes from 'prop-types';
import React from 'react';

const Link = React.forwardRef(({ onClick, href, children, ...rest }, ref) => {
    return (
        <a
            style={{ textDecoration: 'none', color: 'inherit' }}
            href={href}
            onClick={onClick}
            ref={ref}
            {...rest}
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
