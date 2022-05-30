import Navbar from './navbar'
import Footer from './footer'
import Head from 'next/head'

export default function Layout(props) {

    return (
        <>
            <Head>
                <title>Fotum</title>
            </Head>
            <Navbar
                authenticate={props.authenticate}
                isAuthenticated={props.isAuthenticated}
                isAuthenticating={props.isAuthenticating}
                user={props.user}
                account={props.account}
                logout={props.logout} />
            <main>
                {props.children}
            </main>
            <Footer />
        </>
    )
}