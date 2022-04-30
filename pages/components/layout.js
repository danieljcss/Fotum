import Navbar from './navbar'
import Footer from './footer'
import Head from 'next/head'

export default function Layout(props) {
    return (
        <>
            <Head>
                <title>Fotum</title>
            </Head>
            <Navbar />
            <main>
                {props.children}
            </main>
            <Footer />
        </>
    )
}