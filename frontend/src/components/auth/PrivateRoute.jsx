import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const { session } = useSelector(state => state.user);
    const token = session?.access_token;
    const isAuthenticated = token ? true : false;
    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" replace />;
};

PrivateRoute.propTypes = {
    element: PropTypes.func.isRequired,
};

export default PrivateRoute;
