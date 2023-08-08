import Link from '@/components/layout/Link';

import PropTypes from 'prop-types';

function NavLink({ text, icon, path, ...rest }) {
    const hoverStyle =
        'transform transition-transform duration-200 hover:-translate-y-1';
    return (
        <Link
            className={`flex my-4 hover:border-b-2 hover:border-b-white ${hoverStyle}`}
            href={path}
            key={{ text, icon, path }}
            {...rest}
        >
            {icon}
            <h1 className="text-white pl-3 text-2xl ">{text}</h1>
        </Link>
    );
}
NavLink.propTypes = {
    text: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    path: PropTypes.string.isRequired,
};

export default NavLink;
