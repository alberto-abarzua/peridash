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
        },
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
