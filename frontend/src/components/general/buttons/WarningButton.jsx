import PropTypes from 'prop-types';

import BaseButton from './BaseButton';

const PrimaryButton = ({ className, ...rest }) => {
    return (
        <BaseButton
            className={`bg-red-600 text-white hover:bg-red-700 ${className}`}
            {...rest}
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
