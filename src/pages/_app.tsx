import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { config } from "../wagmi";
import { MessageProvider } from "../contexts/MessageContext";
import { LoadingProvider } from "../contexts/LoadingContext";
import { lightTheme } from "../theme/theme";

import { ApolloProvider } from "@apollo/client/react";
import { client as apolloClient } from "../lib/apollo";

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={client}>
          <RainbowKitProvider>
            <ThemeProvider theme={lightTheme}>
              <CssBaseline />
              <MessageProvider>
                <LoadingProvider>
                  <Component {...pageProps} />
                </LoadingProvider>
              </MessageProvider>
            </ThemeProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ApolloProvider>
  );
}

export default MyApp;
