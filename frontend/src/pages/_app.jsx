import '@/styles/globals.css';

import Navbar from '@/components/layout/Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

const theme = createTheme({
    palette: {
        primary: {
            main: '#558b2f',
        },
        secondary: {
            main: '#191819',
            dark: 'rgba(9, 9, 9, 0.1)',
        },
        stocks: {
            green: 'rgba(19, 255, 0, 0.79)',
            green_light: 'rgba(0, 255, 3, 0.2)',
            green_dark: 'rgba(0, 255, 3, 0.5)',
            red: 'rgba(255, 0, 0, 0.79)',
            red_light: 'rgba(255, 0, 0, 0.2)',
            red_dark: 'rgba(255, 0, 0, 0.5)',
        },
    },
    typography: {
        fontFamily: '"PT Sans", serif',
    },
});

export default function MainApp({ Component, pageProps }) {
    const router = useRouter();
    let nav = <Navbar />;
    if (router.pathname === '/login') {
        nav = null;
    }
    return (
        <ThemeProvider theme={theme}>
            {nav}
            <Component {...pageProps} />
        </ThemeProvider>
    );
}

MainApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};
