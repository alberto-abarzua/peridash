import Link from '@/components/layout/Link';

import PropTypes from 'prop-types';

function NavLink({ text, icon, path, ...rest }) {
    const hoverStyle = 'transform transition-transform duration-200 hover:-translate-y-1';
    return (
        <Link
            className={`my-4 flex hover:border-b-2 hover:border-b-white ${hoverStyle}`}
            href={path}
            key={{ text, icon, path }}
            {...rest}
        >
            {icon}
            <h1 className="pl-3 text-2xl text-white ">{text}</h1>
        </Link>
    );
}
NavLink.propTypes = {
    text: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    path: PropTypes.string.isRequired,
};

export default NavLink;
