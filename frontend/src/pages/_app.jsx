import '@/styles/globals.css';
import PropTypes from 'prop-types';
import { verifyAuth } from '@/utils/auth';
import { useRouter } from 'next/router'
import { useEffect } from 'react'


export default function MyApp({ Component, pageProps, authenticated }) {
    const router = useRouter()
  
    useEffect(() => {
      if (!authenticated) {
        router.push('/login') // This redirects to the login page.
      }
    }, [authenticated])
  
    // If authenticated is true, render the page normally.
    return <Component {...pageProps} />
  }

  // This function runs on every request.
MyApp.getServerSideProps = async (context) => {
    // Here you can check the user's session, JWT token in the cookie, etc.
    const authenticated = await verifyAuth(context.req) 
  
    return {
      props: { authenticated }, // Will be passed to the page component as props
    }
  }

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object,
};
