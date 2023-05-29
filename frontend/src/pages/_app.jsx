import '@/styles/globals.css';

import PropTypes from 'prop-types';

export default function MyApp({ Component, pageProps }) {
    // If authenticated is true, render the page normally.
    return <Component {...pageProps} />;
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object,
};
