import { ChakraProvider } from "@chakra-ui/react";
import { EthersProvider } from "../context/ethersProviderContext";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
  return (
    <EthersProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </EthersProvider>
  )
}

export default MyApp
