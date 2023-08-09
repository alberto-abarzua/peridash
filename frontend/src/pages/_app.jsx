import '@/styles/globals.css';

import SideNav from '@/components/layout/SideNav';

import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

export default function MainApp({ Component, pageProps }) {
    const router = useRouter();
    let nav = <SideNav />;
    if (router.pathname === '/login') {
        nav = null;
    }
    return (
        <div>
            {nav}
            <Component {...pageProps} />
        </div>
    );
}

MainApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};
