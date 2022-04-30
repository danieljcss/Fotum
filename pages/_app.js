import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme'
import '../styles/globals.css'
import Layout from './components/layout'
import { MoralisProvider } from 'react-moralis'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <MoralisProvider appId={process.env.NEXT_PUBLIC_APPID} serverUrl={process.env.NEXT_PUBLIC_SERVER_URL}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MoralisProvider>
    </ChakraProvider>
  )
}

export default MyApp
