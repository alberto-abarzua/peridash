import '@/styles/globals.css';

import Navbar from '@/components/layout/Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import PropTypes from 'prop-types';

const theme = createTheme({
    palette: {
        primary: {
            main: '#558b2f',
        },
        secondary: {
            main: '#191819',
        },
    },
});

export default function MainApp({ Component, pageProps }) {
    return (
        <ThemeProvider theme={theme}>
            <Navbar />
            <Component {...pageProps} />;
        </ThemeProvider>
    );
}

MainApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object,
};
