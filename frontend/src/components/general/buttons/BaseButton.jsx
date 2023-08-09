import PropTypes from 'prop-types';

const BaseButton = ({ text, onClick, icon, className, ...rest }) => {
    return (
        <button
            onClick={onClick}
            className={`flex transform px-4 py-2 shadow-lg  duration-200 hover:shadow-xl ${className} `}
            {...rest}
        >
            <div className="self-center pr-1">{text}</div>
            <div className="relative -right-2 self-center">{icon}</div>
        </button>
    );
};
BaseButton.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
    icon: PropTypes.element,
};
export default BaseButton;
