import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function NavLink({ text, icon, path, ...rest }) {
    return (
        <Link
            className={`mx-4 my-5 flex transform transition-all hover:translate-x-1`}
            to={path}
            key={{ text, icon, path }}
            {...rest}
        >
            {icon}
            <h1 className="pl-4 text-xl text-white hover:text-gray-300 ">{text}</h1>
        </Link>
    );
}
NavLink.propTypes = {
    text: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    path: PropTypes.string.isRequired,
};

export default NavLink;
