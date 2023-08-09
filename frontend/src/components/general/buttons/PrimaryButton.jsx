import PropTypes from 'prop-types';

import BaseButton from './BaseButton';

const PrimaryButton = ({ className, ...props }) => {
    return (
        <BaseButton
            className={`bg-green-600 text-white hover:bg-green-700 ${className}`}
            {...props}
        />
    );
};
PrimaryButton.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
    icon: PropTypes.element,
};

export default PrimaryButton;
