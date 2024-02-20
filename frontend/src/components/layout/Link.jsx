import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Link = React.forwardRef(({ onClick, href, children, ...rest }, ref) => {
    return (
        <RouterLink
            style={{ textDecoration: 'none', color: 'inherit' }}
            to={href}
            onClick={onClick}
            ref={ref}
            {...rest}
        >
            {children}
        </RouterLink>
    );
});

Link.displayName = 'Link';

Link.propTypes = {
    onClick: PropTypes.func,
    href: PropTypes.string,
    children: PropTypes.node,
};

export default Link;
